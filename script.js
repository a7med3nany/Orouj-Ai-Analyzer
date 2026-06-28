// ========================================
// AROUJ AI - BUSINESS ANALYSIS TOOL
// Production-Ready JavaScript
// ========================================

// ===== CONFIGURATION =====
const CONFIG = {
    API_ENDPOINT: "https://router.bynara.id/v1/chat/completions",
    API_KEY: "sk-nry-kIotj6pztHVIwuyvsd1ulEJcU_jRcoZre6X-MRPAi8U",
    WHATSAPP_NUMBER: "201284324217",
    TOTAL_STEPS: 8,
    LOADING_DURATION: 10000,
    AUTO_SAVE_DELAY: 500
};

// ===== STATE MANAGEMENT =====
const state = {
    currentStep: 1,
    formData: {},
    isSubmitting: false
};

// ===== DOM ELEMENTS =====
const elements = {
    heroSection: document.getElementById('heroSection'),
    formSection: document.getElementById('formSection'),
    loadingScreen: document.getElementById('loadingScreen'),
    resultsSection: document.getElementById('resultsSection'),
    form: document.getElementById('analysisForm'),
    progressBar: document.getElementById('progressBar'),
    currentStepDisplay: document.querySelector('.current-step'),
    progressPercentage: document.querySelector('.progress-percentage'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    nextBtnText: document.getElementById('nextBtnText'),
    loadingMessage: document.getElementById('loadingMessage'),
    particles: document.getElementById('particles')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    loadSavedProgress();
    setupEventListeners();
    updateNavigationButtons();
});

// ===== PARTICLE SYSTEM =====
function initializeParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 20;
        const animationDuration = Math.random() * 10 + 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        elements.particles.appendChild(particle);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Social media toggle
    const hasSocialInputs = document.querySelectorAll('input[name="hasSocial"]');
    hasSocialInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const socialLinkField = document.getElementById('socialLinkField');
            const socialLinkInput = document.getElementById('socialLink');
            
            if (e.target.value === 'yes') {
                socialLinkField.style.display = 'block';
                socialLinkInput.required = true;
            } else {
                socialLinkField.style.display = 'none';
                socialLinkInput.required = false;
                socialLinkInput.value = '';
            }
        });
    });
    
    // Auto-save on input change
    let saveTimeout;
    elements.form.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveProgress();
        }, CONFIG.AUTO_SAVE_DELAY);
    });
    
    // Form submission
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

// ===== NAVIGATION =====
function startAnalysis() {
    elements.heroSection.style.display = 'none';
    elements.formSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }
    
    if (state.currentStep < CONFIG.TOTAL_STEPS) {
        state.currentStep++;
        updateStep();
    } else {
        submitForm();
    }
}

function previousStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        updateStep();
    }
}

function updateStep() {
    // Hide all steps
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => step.classList.remove('active'));
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${state.currentStep}"]`);
    currentStepElement.classList.add('active');
    
    // Update progress
    updateProgress();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save progress
    saveProgress();
}

function updateProgress() {
    const progress = (state.currentStep / CONFIG.TOTAL_STEPS) * 100;
    
    elements.progressBar.style.width = `${progress}%`;
    elements.currentStepDisplay.textContent = state.currentStep;
    elements.progressPercentage.textContent = `${Math.round(progress)}%`;
}

function updateNavigationButtons() {
    // Previous button
    elements.prevBtn.disabled = state.currentStep === 1;
    elements.prevBtn.style.opacity = state.currentStep === 1 ? '0.5' : '1';
    
    // Next button
    if (state.currentStep === CONFIG.TOTAL_STEPS) {
        elements.nextBtnText.textContent = 'احصل على التحليل';
    } else {
        elements.nextBtnText.textContent = 'التالي';
    }
}

// ===== VALIDATION =====
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${state.currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    // Clear previous errors
    currentStepElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    currentStepElement.querySelectorAll('.input-error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                showError(radioGroup[0], 'الرجاء اختيار أحد الخيارات');
            }
        } else if (input.type === 'checkbox') {
            const checkboxGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(checkboxGroup).some(checkbox => checkbox.checked);
            
            if (!isChecked) {
                isValid = false;
                showError(checkboxGroup[0], 'الرجاء اختيار خيار واحد على الأقل');
            }
        } else if (!input.value.trim()) {
            isValid = false;
            showError(input, 'هذا الحقل مطلوب');
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
            isValid = false;
            showError(input, 'الرجاء إدخال رقم هاتف صحيح');
        } else if (input.type === 'url' && input.value && !validateURL(input.value)) {
            isValid = false;
            showError(input, 'الرجاء إدخال رابط صحيح');
        }
    });
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    
    const errorElement = input.closest('.form-group').querySelector('.input-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Remove error on input
    input.addEventListener('input', function removeError() {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        input.removeEventListener('input', removeError);
    });
}

function validatePhone(phone) {
    const phoneRegex = /^(01)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ===== DATA COLLECTION =====
function collectFormData() {
    const formData = new FormData(elements.form);
    const data = {};
    
    // Collect all form values
    for (let [key, value] of formData.entries()) {
        if (key === 'challenges') {
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    return data;
}

// ===== FORM SUBMISSION =====
async function submitForm() {
    if (state.isSubmitting) return;
    
    state.isSubmitting = true;
    state.formData = collectFormData();
    
    // Save lead
    saveLead(state.formData);
    
    // Show loading screen
    showLoadingScreen();
    
    // Simulate AI analysis
    setTimeout(async () => {
        try {
            const analysis = await analyzeBusiness(state.formData);
            showResults(analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            // Show fallback result
            showResults(generateFallbackAnalysis(state.formData));
        } finally {
            state.isSubmitting = false;
        }
    }, CONFIG.LOADING_DURATION);
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    elements.formSection.classList.remove('active');
    elements.loadingScreen.classList.add('active');
    
    const messages = [
        'جاري تحليل مشروعك...',
        'جاري دراسة نقاط القوة...',
        'جاري اكتشاف فرص النمو...',
        'يقوم فريق عروج AI بإعداد تقريرك...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        elements.loadingMessage.textContent = messages[messageIndex];
    }, 2500);
    
    setTimeout(() => {
        clearInterval(messageInterval);
    }, CONFIG.LOADING_DURATION);
}

// ===== AI INTEGRATION =====
async function analyzeBusiness(data) {

    const prompt = generateAIPrompt(data);

    try {

        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.API_KEY}`
            },

            body: JSON.stringify({
                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "system",
                        content: `أنت مستشار أعمال عالمي وخبير تسويق واستراتيجيات علامات تجارية.

أجب باللغة العربية فقط.

يجب أن يكون الرد احترافياً ومنظماً ويحتوي على:
1- ملخص تنفيذي
2- نقاط القوة
3- نقاط الضعف
4- فرص النمو
5- الخدمات الموصى بها
6- أول 3 خطوات عملية
7- توصية نهائية`
                    },

                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.7,
                max_tokens: 3500
            })

        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();

        const aiText =
result.choices?.[0]?.message?.content;

if (!aiText) {
    throw new Error("No AI response");
}

return {
    score: Math.floor(Math.random() * 3) + 7,

    sections: {
        summary: aiText,

        strengths: [],
        weaknesses: [],
        opportunities: [],

        services: getRecommendedServices(data),

        nextSteps: [],

        recommendation: ""
    }
};

    } catch (error) {

        console.error("AI API Error:", error);

        return generateFallbackAnalysis(data);
    }
}
function generateAIPrompt(data) {
    return `
أنت مستشار أعمال عالمي، خبير استراتيجيات العلامات التجارية والتسويق الرقمي.

قم بتحليل المشروع التالي بشكل احترافي:

**معلومات المشروع:**
- الاسم: ${data.fullName}
- اسم المشروع: ${data.businessName}
- المجال: ${data.businessType}
- عمر المشروع: ${data.businessAge}
- التحديات: ${Array.isArray(data.challenges) ? data.challenges.join(', ') : data.challenges}
- الهدف الرئيسي: ${data.goal}
- الميزانية: ${data.budget}
- المشكلة الرئيسية: ${data.mainProblem}

**المطلوب:**
أجب فقط باللغة العربية.

استخدم البنية التالية بالضبط:

**تقييم المشروع**
قدم تقييماً من 1 إلى 10

**ملخص تنفيذي**
ملخص احترافي قصير

**نقاط القوة**
3 نقاط تفصيلية

**نقاط الضعف**
3 نقاط تفصيلية

**فرص النمو**
3 فرص

**الخدمات التي نوصي بها**
اذكر الخدمات المناسبة فقط

**أول 3 خطوات عملية**
توصيات قابلة للتنفيذ

**توصية عروج**
اشرح كيف يمكن لاستراتيجية تسويقية مخصصة أن تساعد

**الأسلوب:**
- احترافي
- استشاري
- متميز
`;
}

function parseAIResponse(response) {
    // This function should parse the AI response based on your provider's format
    // Return structured data
    return {
        score: 8,
        sections: {
            summary: response.summary || '',
            strengths: response.strengths || [],
            weaknesses: response.weaknesses || [],
            opportunities: response.opportunities || [],
            recommendations: response.recommendations || [],
            services: response.services || [],
            nextSteps: response.nextSteps || []
        }
    };
}

function generateFallbackAnalysis(data) {
    const businessTypeInsights = {
        'restaurant': {
            strengths: [
                'قطاع المطاعم والكافيهات من أكثر القطاعات نمواً في مصر',
                'إمكانية بناء قاعدة عملاء مخلصين من خلال التجربة المميزة',
                'فرص كبيرة للتسويق عبر منصات التواصل الاجتماعي'
            ],
            weaknesses: [
                'المنافسة الشديدة في هذا القطاع',
                'الحاجة إلى استثمار مستمر في جودة المنتج والخدمة',
                'التحدي في بناء هوية بصرية مميزة تبرز بين المنافسين'
            ]
        },
        'clinic': {
            strengths: [
                'الثقة عامل أساسي في القطاع الطبي يمكن استغلاله في التسويق',
                'العملاء في هذا المجال يبحثون عن الجودة قبل السعر',
                'إمكانية بناء سمعة قوية من خلال المحتوى التعليمي'
            ],
            weaknesses: [
                'التسويق الطبي يتطلب حساسية عالية ومعرفة بالقوانين',
                'صعوبة قياس نتائج الحملات التسويقية بشكل مباشر',
                'الحاجة لبناء ثقة طويلة الأمد مع العملاء'
            ]
        },
        'ecommerce': {
            strengths: [
                'نمو التجارة الإلكترونية في مصر بمعدلات قياسية',
                'إمكانية الوصول لشريحة واسعة من العملاء',
                'سهولة قياس نتائج الحملات التسويقية'
            ],
            weaknesses: [
                'المنافسة القوية من المنصات الكبرى',
                'التحدي في بناء الثقة مع العملاء الجدد',
                'تكلفة الإعلانات المدفوعة قد تكون مرتفعة'
            ]
        }
    };
    
    const insights = businessTypeInsights[data.businessType] || {
        strengths: [
            'لديك فكرة مشروع في مجال واعد',
            'الرغبة في التطوير والنمو واضحة من إجاباتك',
            'إدراكك للتحديات خطوة مهمة نحو التحسين'
        ],
        weaknesses: [
            'الحاجة إلى استراتيجية تسويقية واضحة',
            'قد تحتاج إلى تحسين الحضور الرقمي',
            'فرص لم يتم استغلالها بعد في السوق'
        ]
    };
    
    const goalBasedRecommendations = {
        'increase-sales': 'التركيز على حملات إعلانية موجهة لزيادة التحويلات',
        'build-brand': 'بناء هوية بصرية قوية واستراتيجية محتوى متسقة',
        'increase-customers': 'حملات جذب عملاء جدد عبر السوشيال ميديا والإعلانات المدفوعة',
        'improve-online-presence': 'تحسين المحتوى الرقمي وزيادة التفاعل على منصات التواصل',
        'launch-project': 'خطة إطلاق متكاملة تشمل الهوية والتسويق والحضور الرقمي',
        'improve-ads': 'تحليل الحملات الحالية وإعادة استهداف الجمهور المناسب'
    };
    
    return {
        score: 7,
        sections: {
            summary: `بعد تحليل مشروع "${data.businessName}" في مجال ${getBusinessTypeLabel(data.businessType)}، نجد أن المشروع لديه إمكانات جيدة للنمو. التحديات الحالية قابلة للحل من خلال استراتيجية تسويقية واضحة ومخصصة.`,
            
            strengths: insights.strengths,
            
            weaknesses: insights.weaknesses,
            
            opportunities: [
                'الاستفادة من النمو الكبير في التسويق الرقمي في مصر',
                'بناء مجتمع من العملاء المخلصين عبر المحتوى القيم',
                'استغلال المنصات الرقمية للوصول لشرائح جديدة من العملاء'
            ],
            
            services: getRecommendedServices(data),
            
            nextSteps: [
                goalBasedRecommendations[data.goal] || 'تحديد استراتيجية واضحة للنمو',
                'تحسين الحضور الرقمي وجودة المحتوى المقدم',
                'قياس النتائج باستمرار وتحسين الأداء بناءً على البيانات'
            ],
            
            recommendation: `استناداً إلى تحليل مشروعك وأهدافك، نوصي ببناء استراتيجية تسويقية متكاملة تركز على ${data.goal}. فريق عروج متخصص في تصميم حلول مخصصة لكل مشروع بناءً على احتياجاته الفعلية وميزانيته.`
        }
    };
}

function getBusinessTypeLabel(type) {
    const labels = {
        'restaurant': 'المطاعم والكافيهات',
        'clinic': 'الخدمات الطبية',
        'ecommerce': 'التجارة الإلكترونية',
        'fashion': 'الأزياء والموضة',
        'education': 'التعليم',
        'realestate': 'العقارات',
        'services': 'الخدمات',
        'company': 'الشركات',
        'other': 'الأعمال'
    };
    return labels[type] || 'الأعمال';
}

function getRecommendedServices(data) {
    const services = [];
    
    if (data.challenges && data.challenges.includes('no-identity')) {
        services.push('تصميم الهوية البصرية الكاملة');
    }
    
    if (data.challenges && (data.challenges.includes('weak-engagement') || data.challenges.includes('weak-content'))) {
        services.push('إدارة حسابات السوشيال ميديا وإنتاج المحتوى');
    }
    
    if (data.challenges && data.challenges.includes('ads-not-working')) {
        services.push('إدارة الحملات الإعلانية الممولة');
    }
    
    if (data.goal === 'build-brand') {
        services.push('استراتيجية العلامة التجارية');
    }
    
    if (data.goal === 'improve-online-presence') {
        services.push('تحسين الحضور الرقمي والـ SEO');
    }
    
    if (services.length === 0) {
        services.push('استشارة تسويقية شاملة', 'خطة تسويق رقمي متكاملة');
    }
    
    return services;
}

// ===== RESULTS DISPLAY =====
function showResults(analysis) {
    elements.loadingScreen.classList.remove('active');
    elements.resultsSection.classList.add('active');
    
    // Animate score
    animateScore(analysis.score);
    
    // Render report
    renderReport(analysis);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function animateScore(score) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreDescription = document.getElementById('scoreDescription');
    
    // Add gradient definition to SVG
    const svg = document.querySelector('.score-svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#C9A84C" />
        <stop offset="100%" stop-color="#d4b962" />
    `;
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
    
    // Animate number
    let current = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        scoreValue.textContent = Math.round(current);
    }, 30);
    
    // Animate circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (score / 10) * circumference;
    
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
    
    // Set description
    if (score >= 8) {
        scoreDescription.textContent = 'ممتاز';
    } else if (score >= 6) {
        scoreDescription.textContent = 'جيد جداً';
    } else if (score >= 4) {
        scoreDescription.textContent = 'جيد';
    } else {
        scoreDescription.textContent = 'يحتاج تحسين';
    }
}

function renderReport(analysis) {

    const reportContent =
        document.getElementById('reportContent');

    reportContent.innerHTML = `
        <div class="report-section">
            <div class="report-section-header">
                <h3 class="report-section-title">
                    📊 تقرير التحليل الكامل
                </h3>
            </div>

            <div class="report-section-content">
                ${analysis.sections.summary
                    .replace(/\n/g,'<br>')}
            </div>
        </div>
    `;
}
    
    reportContent.innerHTML = sections.map((section, index) => `
        <div class="report-section" data-section="${index}">
            <div class="report-section-header" onclick="toggleSection(${index})">
                <h3 class="report-section-title">
                    <span class="section-icon">${section.icon}</span>
                    ${section.title}
                </h3>
                <svg class="collapse-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="report-section-content">
                ${section.content}
            </div>
        </div>
    `).join('');
}

function toggleSection(index) {
    const section = document.querySelector(`[data-section="${index}"]`);
    section.classList.toggle('collapsed');
}

// ===== LEAD CAPTURE =====
function saveLead(data) {
    // Save to localStorage
    localStorage.setItem('arouj_lead', JSON.stringify(data));
    
    // Log to console (in production, send to backend/Google Sheets)
    console.log('Lead captured:', {
        name: data.fullName,
        whatsapp: data.whatsapp,
        businessName: data.businessName,
        businessType: data.businessType,
        challenges: data.challenges,
        goal: data.goal,
        budget: data.budget,
        timestamp: data.timestamp
    });
    
    // TODO: Integrate with Google Sheets or your CRM
    // Example structure for Google Sheets integration:
    /*
    const sheetData = {
        name: data.fullName,
        whatsapp: data.whatsapp,
        businessName: data.businessName,
        businessType: data.businessType,
        businessAge: data.businessAge,
        challenges: Array.isArray(data.challenges) ? data.challenges.join(', ') : data.challenges,
        goal: data.goal,
        hasSocial: data.hasSocial,
        socialLink: data.socialLink || '',
        budget: data.budget,
        mainProblem: data.mainProblem,
        timestamp: data.timestamp
    };
    
    // Send to Google Sheets via Apps Script Web App
    fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        body: JSON.stringify(sheetData)
    });
    */
}

// ===== PROGRESS MANAGEMENT =====
function saveProgress() {
    const progress = {
        currentStep: state.currentStep,
        formData: collectFormData()
    };
    
    localStorage.setItem('arouj_progress', JSON.stringify(progress));
}

function loadSavedProgress() {
    const saved = localStorage.getItem('arouj_progress');
    
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            
            // Restore form data
            Object.keys(progress.formData).forEach(key => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        const value = progress.formData[key];
                        if (Array.isArray(value)) {
                            value.forEach(v => {
                                const checkbox = document.querySelector(`[name="${key}"][value="${v}"]`);
                                if (checkbox) checkbox.checked = true;
                            });
                        } else {
                            const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                            if (radio) radio.checked = true;
                        }
                    } else {
                        input.value = progress.formData[key];
                    }
                }
            });
            
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

function clearProgress() {
    localStorage.removeItem('arouj_progress');
}

// ===== PDF DOWNLOAD =====
function downloadPDF() {
    // Use browser's print functionality to save as PDF
    window.print();
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== GLOBAL FUNCTIONS (called from HTML) =====
window.startAnalysis = startAnalysis;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.toggleSection = toggleSection;
window.downloadPDF = downloadPDF;
