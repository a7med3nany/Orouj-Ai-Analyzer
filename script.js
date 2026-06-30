/**
 * ============================================================
 * عروج AI - الإصدار المصلح 3.2
 * إصلاح مشاكل الـ API، Formspree، وتحسين واجهة التحميل
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
};

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
                    input.value = value;
                    if (key === 'businessType' && value === 'other') {
                        const otherGroup = document.getElementById("otherBusinessTypeGroup");
                        if (otherGroup) otherGroup.style.display = "block";
                    }
                }
            }
            
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
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) prevBtn.style.display = STATE.currentStep === 1 ? "none" : "block";
    
    const nextBtnText = document.getElementById("nextBtnText");
    if (nextBtnText) {
        nextBtnText.textContent = STATE.currentStep === STATE.totalSteps ? "إرسال وتحليل البيانات" : "التالي";
    }
}

function changeStep(n) {
    const steps = document.querySelectorAll(".form-step");
    const currentStepEl = steps[STATE.currentStep - 1];

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

    saveData();
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

async function submitForm() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    STATE.formData = data;
    saveData();
    
    document.getElementById("formSection").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    
    // محاكاة تغيير خطوات التحميل لتحسين الشكل
    let loadStep = 1;
    const loadInterval = setInterval(() => {
        loadStep++;
        const stepEl = document.getElementById(`l-step-${loadStep}`);
        if (stepEl) {
            document.querySelectorAll('.loading-step').forEach(el => el.classList.remove('active'));
            stepEl.classList.add('active');
        } else {
            clearInterval(loadInterval);
        }
    }, 3000);
    
    try {
        // إرسال البيانات لـ Formspree أولاً
        await sendToFormspree(data);
        
        // ثم الحصول على تحليل الذكاء الاصطناعي
        const analysis = await getAIAnalysis(data);
        
        clearInterval(loadInterval);
        if (analysis) {
            showResults(analysis);
        } else {
            throw new Error("No analysis returned");
        }
    } catch (err) {
        clearInterval(loadInterval);
        console.error("Error:", err);
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("formSection").style.display = "block";
        alert("عذراً، حدث خطأ أثناء معالجة البيانات. يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.");
    }
}

async function sendToFormspree(data) {
    try {
        await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        console.log("Data sent to Formspree successfully");
    } catch (e) {
        console.error("Formspree Error:", e);
        // لا نعطل العملية إذا فشل Formspree، نستمر للتحليل
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

    // استخدام الـ API مباشرة بدون بروكسي إذا أمكن، أو استخدام بروكسي موثوق
    const apiUrl = "https://router.bynara.id/v1/chat/completions";

    try {
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
            // محاولة بديلة عبر البروكسي إذا فشل المباشر بسبب CORS
            const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(apiUrl);
            const proxyResponse = await fetch(proxyUrl, {
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
            
            if (!proxyResponse.ok) throw new Error("API call failed");
            const result = await proxyResponse.json();
            return result.choices[0].message.content.trim();
        }

        const result = await response.json();
        return result.choices[0].message.content.trim();
    } catch (e) {
        console.error("AI API Error:", e);
        throw e;
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
    
    const score = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
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
