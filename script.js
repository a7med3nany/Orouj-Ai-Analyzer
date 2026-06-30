/**
 * ============================================================
 * عروج AI - الإصدار الاحترافي 3.3
 * تحسين الحفظ اللحظي، إصلاح تداخل الأسئلة، وإصلاح الـ API
 * ============================================================
 */

var STATE = {
    currentStep: 1,
    totalSteps: 25,
    formData: {}
};

const STORAGE_KEY = 'orouj_ai_analyzer_data';
const FORMSPREE_URL = "https://formspree.io/f/xbdvkqaq";

window.onload = function() {
    loadSavedData();
    initParticles();
    setupInstantSave();
};

// 1. نظام الحفظ التلقائي المطور (لحظي)
function setupInstantSave() {
    const form = document.getElementById("analysisForm");
    const inputs = form.querySelectorAll("input, select, textarea");
    
    inputs.forEach(input => {
        // حفظ عند التغيير أو الكتابة
        input.addEventListener('input', () => {
            saveData();
        });
        input.addEventListener('change', () => {
            saveData();
        });
    });
}

function loadSavedData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            STATE.formData = parsed.data || {};
            STATE.currentStep = parsed.currentStep || 1;
            
            const form = document.getElementById("analysisForm");
            for (const [key, value] of Object.entries(STATE.formData)) {
                const input = form.elements[key];
                if (input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = (input.value === value);
                    } else {
                        input.value = value;
                    }
                    
                    // معالجة حقل "أخرى" عند التحميل
                    if (key === 'businessType' && value === 'other') {
                        const otherGroup = document.getElementById("otherBusinessTypeGroup");
                        if (otherGroup) otherGroup.style.display = "block";
                    }
                }
            }
            
            // إذا كان المستخدم في خطوة متقدمة، نظهر شاشة النموذج فوراً
            if (STATE.currentStep > 1) {
                startAnalysis(true);
            }
        } catch (e) {
            console.error("Error loading saved data", e);
        }
    }
}

function saveData() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: data,
        currentStep: STATE.currentStep
    }));
}

// 2. إدارة الخطوات والتنقل
function startAnalysis(isResuming = false) {
    const hero = document.getElementById("hero-Section");
    const formSec = document.getElementById("formSection");
    
    if (hero) hero.style.display = "none";
    if (formSec) formSec.classList.add("active");
    
    if (isResuming) {
        goToStep(STATE.currentStep);
    } else {
        STATE.currentStep = 1;
        goToStep(1);
    }
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll(".form-step");
    
    // إخفاء كل الخطوات أولاً لضمان عدم التداخل
    steps.forEach(s => {
        s.classList.remove("active");
        s.style.display = "none";
    });
    
    // إظهار الخطوة المطلوبة فقط
    const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (targetStep) {
        targetStep.classList.add("active");
        targetStep.style.display = "block";
        STATE.currentStep = stepNumber;
        updateProgress();
        updateNavButtons();
        saveData(); // حفظ رقم الخطوة الحالية
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) prevBtn.style.display = STATE.currentStep === 1 ? "none" : "block";
    
    const nextBtnText = document.getElementById("nextBtnText");
    if (nextBtnText) {
        nextBtnText.textContent = STATE.currentStep === STATE.totalSteps ? "إرسال وتحليل البيانات" : "التالي";
    }
}

function changeStep(n) {
    const steps = document.querySelectorAll(".form-step");
    const currentStepEl = document.querySelector(`.form-step[data-step="${STATE.currentStep}"]`);

    if (n > 0) {
        // التحقق من الحقول المطلوبة في الخطوة الحالية
        const inputs = currentStepEl.querySelectorAll("input[required], select[required], textarea[required]");
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = "red";
                valid = false;
            } else {
                input.style.borderColor = "";
            }
        });
        if (!valid) return;
    }

    const nextStep = STATE.currentStep + n;

    if (nextStep > STATE.totalSteps) {
        submitForm();
    } else if (nextStep >= 1) {
        goToStep(nextStep);
    }
}

function updateProgress() {
    const pct = Math.round((STATE.currentStep / STATE.totalSteps) * 100);
    const progressBar = document.getElementById("progressBar");
    if (progressBar) progressBar.style.width = pct + "%";
    
    const pctEl = document.querySelector(".progress-percentage");
    if (pctEl) pctEl.textContent = pct + "%";
    
    const currentStepEl = document.querySelector(".current-step");
    if (currentStepEl) currentStepEl.textContent = STATE.currentStep;
}

function checkOtherField(select) {
    const otherGroup = document.getElementById("otherBusinessTypeGroup");
    if (otherGroup) {
        if (select.value === "other") {
            otherGroup.style.display = "block";
            otherGroup.querySelector("input").setAttribute("required", "required");
        } else {
            otherGroup.style.display = "none";
            otherGroup.querySelector("input").removeAttribute("required");
        }
    }
}

// 3. الإرسال والتحليل (إصلاح الـ API)
async function submitForm() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    STATE.formData = data;
    saveData();
    
    document.getElementById("formSection").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    
    // محاكاة خطوات التحميل
    let loadStep = 1;
    const loadInterval = setInterval(() => {
        loadStep++;
        const stepEl = document.getElementById(`l-step-${loadStep}`);
        if (stepEl) {
            document.querySelectorAll('.loading-step').forEach(el => el.classList.remove('active'));
            stepEl.classList.add('active');
        }
    }, 4000);
    
    try {
        // 1. إرسال لـ Formspree
        await sendToFormspree(data);
        
        // 2. الحصول على تحليل AI
        const analysis = await getAIAnalysis(data);
        
        clearInterval(loadInterval);
        if (analysis) {
            showResults(analysis);
            // اختياري: مسح البيانات بعد النجاح الكامل
            // localStorage.removeItem(STORAGE_KEY);
        } else {
            throw new Error("No analysis returned");
        }
    } catch (err) {
        clearInterval(loadInterval);
        console.error("Critical Error:", err);
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("formSection").style.display = "block";
        document.getElementById("formSection").classList.add("active");
        alert("عذراً، حدث خطأ أثناء معالجة البيانات. يرجى التأكد من اتصال الإنترنت وصلاحية مفتاح الـ API.");
    }
}

async function sendToFormspree(data) {
    try {
        await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.warn("Formspree bypass:", e);
    }
}

async function getAIAnalysis(data) {
    const prompt = `أنت مستشار أعمال استراتيجي من وكالة "عروج". قم بتحليل مشروع العميل بناءً على إجاباته.
    البيانات المقدمة:
    - اسم العميل: ${data.fullName}
    - اسم المشروع: ${data.businessName}
    - المجال: ${data.businessType === 'other' ? data.otherBusinessType : data.businessType}
    - الفكرة: ${data.businessIdea}
    - الجمهور: ${data.targetAudience} في ${data.location}
    - المنافسين: ${data.competitors}
    - المنتج الأساسي: ${data.mainProduct} بسعر ${data.avgPrice}
    - الميزة التنافسية: ${data.uniqueSellingPoint}
    - مشكلة البيع: ${data.salesProblem}
    - التسويق الحالي: ${data.socialPlatforms} (أفضلهم ${data.bestPlatform})
    - الميزانية: ${data.marketingBudget}
    - الهدف: ${data.shortTermGoal}
    - العائق: ${data.growthBarrier}
    - المشكلة الممغصة: ${data.mainPainPoint}

    المطلوب:
    اكتب تقريراً مكثفاً واحترافياً جداً باللغة العربية.
    التزم بالعناوين التالية (بدون نجوم أو رموز):
    [التشخيص العميق للوضع الحالي]
    [تحليل الجمهور والمنافسة]
    [خارطة الطريق التسويقية]
    [نقاط القوة والضعف بالمشرط]
    [خطة العمل أول 3 خطوات ذهبية]
    [لماذا عروج هي المنقذ؟]
    [التوصية النهائية وطلب التواصل]`;

    const apiKey = "sk-nry-V9H1WAFFgp8UautBZnQmlSQ8DInPevXCquhtPObGUZI";
    const directUrl = "https://router.bynara.id/v1/chat/completions";
    // استخدام بروكسي عام لحل مشكلة CORS في المتصفح
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(directUrl);

    const payload = {
        model: "mimo-v2.5-free", // الموديل المجاني الأكثر استقراراً
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    };

    console.log("Attempting API call via Proxy...");

    try {
        // المحاولة الأولى عبر البروكسي (لحل مشاكل CORS)
        let response = await fetch(proxyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        // إذا فشل البروكسي، نحاول الاتصال المباشر كحل أخير
        if (!response.ok) {
            console.warn("Proxy failed, trying direct connection...");
            response = await fetch(directUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errorData = await response.text();
            console.error("API Error Detail:", errorData);
            throw new Error(`API returned status ${response.status}`);
        }

        const result = await response.json();
        console.log("Analysis received successfully!");
        return result.choices[0].message.content.trim();

    } catch (e) {
        console.error("Critical API Error:", e);
        // محاولة أخيرة بموديل أبسط إذا كان هناك خطأ في الموديل المختار
        try {
            console.log("Final fallback attempt...");
            const finalResponse = await fetch(proxyUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "bynara-mimo-v2.5",
                    messages: [{ role: "user", content: prompt }]
                })
            });
            const finalResult = await finalResponse.json();
            return finalResult.choices[0].message.content.trim();
        } catch (innerError) {
            throw e; // نمرر الخطأ الأصلي إذا فشلت كل المحاولات
        }
    }
}

function showResults(text) {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("resultsSection").style.display = "block";
    
    const reportContent = document.getElementById("reportContent");
    const sections = text.split('[');
    
    let html = "";
    sections.forEach(section => {
        if (!section.trim()) return;
        const parts = section.split(']');
        if (parts.length < 2) return;
        const title = parts[0];
        const content = parts[1];
        
        html += `
            <div class="report-section">
                <h3>${title}</h3>
                <div>${content.trim().replace(/\n/g, '<br>')}</div>
            </div>
        `;
    });
    
    reportContent.innerHTML = html;
    
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    const scoreValueEl = document.getElementById("scoreValue");
    if (scoreValueEl) scoreValueEl.textContent = score;
    
    const scoreCircle = document.getElementById("scoreCircle");
    if (scoreCircle) {
        const offset = 565 - (565 * score / 100);
        scoreCircle.style.strokeDashoffset = offset;
    }
}

function initParticles() {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 25; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.width = Math.random() * 4 + "px";
        p.style.height = p.style.width;
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(p);
    }
}
