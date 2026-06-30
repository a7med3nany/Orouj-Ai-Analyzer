/**
 * ============================================================
 * عروج AI - الإصدار النهائي المعتمد 8.0
 * الاعتماد الكامل والحصري على الـ API عبر Google Apps Script
 * ============================================================
 */

var STATE = {
    currentStep: 1,
    totalSteps: 25,
    formData: {}
};

const STORAGE_KEY = 'orouj_ai_analyzer_data';
const FORMSPREE_URL = "https://formspree.io/f/xbdvkqaq";
// الرابط النهائي لـ Google Apps Script الذي تم إنشاؤه في حسابك
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbx1ICAaaFp4P8lB0deDnHxhbklnkTgnnbMu1k4NSfnSTJZWMKfh0gdEIYP-cot2Jy2V8Q/exec";

window.onload = function() {
    loadSavedData();
    initParticles();
    setupInstantSave();
};

function setupInstantSave() {
    const form = document.getElementById("analysisForm");
    if (!form) return;
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
        input.addEventListener('input', saveData);
        input.addEventListener('change', saveData);
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
                }
            }
            if (STATE.currentStep > 1) startAnalysis(true);
        } catch (e) { console.error(e); }
    }
}

function saveData() {
    const form = document.getElementById("analysisForm");
    if (!form) return;
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
    if (isResuming) goToStep(STATE.currentStep);
    else { STATE.currentStep = 1; goToStep(1); }
}

function goToStep(stepNumber) {
    const steps = document.querySelectorAll(".form-step");
    steps.forEach(s => { s.classList.remove("active"); s.style.display = "none"; });
    const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (targetStep) {
        targetStep.classList.add("active");
        targetStep.style.display = "block";
        STATE.currentStep = stepNumber;
        updateProgress();
        updateNavButtons();
        saveData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) prevBtn.style.display = STATE.currentStep === 1 ? "none" : "block";
    const nextBtnText = document.getElementById("nextBtnText");
    if (nextBtnText) nextBtnText.textContent = STATE.currentStep === STATE.totalSteps ? "إرسال وتحليل البيانات" : "التالي";
}

function changeStep(n) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${STATE.currentStep}"]`);
    if (n > 0) {
        const inputs = currentStepEl.querySelectorAll("input[required], select[required], textarea[required]");
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) { input.style.borderColor = "#ff4d4d"; valid = false; }
            else input.style.borderColor = "";
        });
        if (!valid) return;
    }
    const nextStep = STATE.currentStep + n;
    if (nextStep > STATE.totalSteps) submitForm();
    else if (nextStep >= 1) goToStep(nextStep);
}

function updateProgress() {
    const pct = Math.round((STATE.currentStep / STATE.totalSteps) * 100);
    const progressBar = document.getElementById("progressBar");
    if (progressBar) progressBar.style.width = pct + "%";
    const pctEl = document.querySelector(".progress-percentage");
    if (pctEl) pctEl.textContent = pct + "%";
}

function checkOtherField(select) {
    const otherGroup = document.getElementById("otherBusinessTypeGroup");
    if (otherGroup) otherGroup.style.display = select.value === "other" ? "block" : "none";
}

async function submitForm() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    STATE.formData = data;
    saveData();
    
    document.getElementById("formSection").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    
    let loadStep = 1;
    const loadInterval = setInterval(() => {
        loadStep++;
        const stepEl = document.getElementById(`l-step-${loadStep}`);
        if (stepEl) {
            document.querySelectorAll('.loading-step').forEach(el => el.classList.remove('active'));
            stepEl.classList.add('active');
        }
    }, 3000);
    
    try {
        // إرسال البيانات فوراً لـ Formspree
        fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).catch(e => console.warn(e));
        
        // جلب التحليل حصرياً من الـ API
        const analysis = await getAIAnalysis(data);
        clearInterval(loadInterval);
        showResults(analysis);
    } catch (err) {
        clearInterval(loadInterval);
        console.error("Critical API Error:", err);
        alert("عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقاً.");
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("formSection").style.display = "block";
    }
}

async function getAIAnalysis(data) {
    const prompt = `أنت مستشار أعمال استراتيجي من وكالة "عروج". قم بتحليل مشروع العميل بناءً على إجاباته الـ 25 التالية:
    ${JSON.stringify(data)}
    
    المطلوب: اكتب تقريراً مكثفاً واحترافياً جداً باللغة العربية.
    التزم بالعناوين التالية (بدون نجوم أو رموز):
    [التشخيص العميق للوضع الحالي]
    [تحليل الجمهور والمنافسة]
    [خارطة الطريق التسويقية]
    [نقاط القوة والضعف بالمشرط]
    [خطة العمل أول 3 خطوات ذهبية]
    [لماذا عروج هي المنقذ؟]
    [التوصية النهائية وطلب التواصل]`;

    try {
        const response = await fetch(googleScriptUrl, {
            method: "POST",
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "أنت خبير استراتيجي في وكالة عروج للتسويق." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        if (result.choices && result.choices[0] && result.choices[0].message) {
            return result.choices[0].message.content.trim();
        } else {
            throw new Error("Invalid API Response Format");
        }
    } catch (e) {
        console.error("Fetch Failed through Google Proxy:", e);
        throw e;
    }
}

function showResults(text) {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("hero-Section").style.display = "none";
    document.getElementById("formSection").style.display = "none";
    const header = document.querySelector(".logo-container");
    if (header) header.style.display = "none";

    const resultsSection = document.getElementById("resultsSection");
    resultsSection.style.display = "block";
    resultsSection.style.padding = "20px";
    
    const reportContent = document.getElementById("reportContent");
    const sections = text.split('[');
    let html = "";
    sections.forEach(section => {
        if (!section.trim()) return;
        const parts = section.split(']');
        if (parts.length < 2) return;
        html += `
            <div class="report-section" style="margin-bottom: 25px; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border-right: 5px solid #C9A84C; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h3 style="color: #C9A84C; margin-bottom: 15px; font-size: 1.4rem;">${parts[0]}</h3>
                <div style="line-height: 1.8; color: #e0e0e0; font-size: 1.1rem;">${parts[1].trim().replace(/\n/g, '<br>')}</div>
            </div>
        `;
    });
    reportContent.innerHTML = html;
    const score = Math.floor(Math.random() * (96 - 82 + 1)) + 82;
    document.getElementById("scoreValue").textContent = score;
    const scoreCircle = document.getElementById("scoreCircle");
    if (scoreCircle) scoreCircle.style.strokeDashoffset = 565 - (565 * score / 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initParticles() {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.cssText = `width:2px;height:2px;left:${Math.random()*100}%;top:${Math.random()*100}%;position:absolute;background:#C9A84C;opacity:0.2;border-radius:50%;`;
        container.appendChild(p);
    }
}
