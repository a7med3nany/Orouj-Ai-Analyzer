/**
 * ============================================================
 * عروج AI - الإصدار الاحترافي 3.1
 * نظام التحليل الاستراتيجي (25 سؤال) مع ميزة الحفظ التلقائي
 * ============================================================
 */

var STATE = {
    currentStep: 1,
    totalSteps: 25,
    formData: {}
};

// مفتاح التخزين في localStorage
const STORAGE_KEY = 'orouj_ai_analyzer_data';

// 1. تهيئة التطبيق عند التحميل
window.onload = function() {
    loadSavedData();
    initParticles();
};

// تحميل البيانات المحفوظة
function loadSavedData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            STATE.formData = parsed.data || {};
            STATE.currentStep = parsed.currentStep || 1;
            
            // تعبئة الحقول بالبيانات المحفوظة
            const form = document.getElementById("analysisForm");
            for (const [key, value] of Object.entries(STATE.formData)) {
                const input = form.elements[key];
                if (input) {
                    input.value = value;
                    if (key === 'businessType' && value === 'other') {
                        document.getElementById("otherBusinessTypeGroup").style.display = "block";
                    }
                }
            }
            
            // إذا كان المستخدم قد بدأ بالفعل، نظهر شاشة النموذج
            if (STATE.currentStep > 1) {
                startAnalysis(true);
            }
        } catch (e) {
            console.error("Error loading saved data", e);
        }
    }
}

// حفظ البيانات الحالية
function saveData() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: data,
        currentStep: STATE.currentStep
    }));
}

// 2. التنقل بين الخطوات
function startAnalysis(isResuming = false) {
    document.getElementById("hero-Section").style.display = "none";
    document.getElementById("formSection").classList.add("active");
    
    if (isResuming) {
        goToStep(STATE.currentStep);
    } else {
        updateProgress();
    }
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll(".form-step");
    steps.forEach(s => s.classList.remove("active"));
    
    if (steps[stepNumber - 1]) {
        steps[stepNumber - 1].classList.add("active");
        STATE.currentStep = stepNumber;
        updateProgress();
        updateNavButtons();
    }
}

function updateNavButtons() {
    document.getElementById("prevBtn").style.display = STATE.currentStep === 1 ? "none" : "block";
    const nextBtnText = document.getElementById("nextBtnText");
    if (STATE.currentStep === STATE.totalSteps) {
        nextBtnText.textContent = "إرسال وتحليل البيانات";
    } else {
        nextBtnText.textContent = "التالي";
    }
}

function changeStep(n) {
    const steps = document.querySelectorAll(".form-step");
    const currentStepEl = steps[STATE.currentStep - 1];

    // التحقق من الإدخال قبل الانتقال للخطوة التالية
    if (n > 0) {
        const inputs = currentStepEl.querySelectorAll("input, select, textarea");
        let valid = true;
        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                input.style.borderColor = "red";
                valid = false;
            } else {
                input.style.borderColor = "";
            }
        });
        if (!valid) return;
    }

    // حفظ البيانات عند كل انتقال
    saveData();

    // تحديث الخطوة
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

// 3. معالجة حقل "أخرى"
function checkOtherField(select) {
    const otherGroup = document.getElementById("otherBusinessTypeGroup");
    if (select.value === "other") {
        otherGroup.style.display = "block";
        otherGroup.querySelector("input").setAttribute("required", "required");
    } else {
        otherGroup.style.display = "none";
        otherGroup.querySelector("input").removeAttribute("required");
    }
}

// 4. إرسال وتحليل البيانات
async function submitForm() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    STATE.formData = data;
    saveData(); // حفظ نهائي قبل الإرسال
    
    // إظهار شاشة التحميل
    document.getElementById("formSection").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    
    try {
        const analysis = await getAIAnalysis(data);
        if (analysis) {
            showResults(analysis);
            sendToDatabase(data);
            // بعد النجاح، يمكننا مسح البيانات المحفوظة إذا أردت
            // localStorage.removeItem(STORAGE_KEY);
        } else {
            throw new Error("No analysis returned");
        }
    } catch (err) {
        console.error("Analysis Error:", err);
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("formSection").style.display = "block";
        alert("عذراً، حدث خطأ أثناء تحليل البيانات. يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.");
    }
}

async function getAIAnalysis(data) {
    const prompt = `أنت مستشار أعمال استراتيجي من وكالة "عروج". قم بتحليل مشروع العميل بناءً على 25 إجابة مفصلة.
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
    اكتب تقريراً مكثفاً، طويلاً، واحترافياً جداً باللغة العربية.
    التزم بالعناوين التالية (بدون نجوم أو رموز):
    [التشخيص العميق للوضع الحالي]
    [تحليل الجمهور والمنافسة]
    [خارطة الطريق التسويقية]
    [نقاط القوة والضعف بالمشرط]
    [خطة العمل أول 3 خطوات ذهبية]
    [لماذا عروج هي المنقذ؟]
    [التوصية النهائية وطلب التواصل]`;

    const targetUrl = "https://router.bynara.id/v1/chat/completions";
    const apiUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-nry-V9H1WAFFgp8UautBZnQmlSQ8DInPevXCquhtPObGUZI"
        },
        body: JSON.stringify({
            model: "mistral-medium-3-5",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 3000
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch AI analysis");
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
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
    
    // تحريك دائرة السكور (عشوائي للجاهزية)
    const score = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    const scoreValueEl = document.getElementById("scoreValue");
    if (scoreValueEl) scoreValueEl.textContent = score;
    
    const scoreCircle = document.getElementById("scoreCircle");
    if (scoreCircle) {
        const offset = 565 - (565 * score / 100);
        scoreCircle.style.strokeDashoffset = offset;
    }
}

function sendToDatabase(data) {
    console.log("Sending data to database...", data);
}

function initParticles() {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.width = Math.random() * 5 + "px";
        p.style.height = p.style.width;
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(p);
    }
}
