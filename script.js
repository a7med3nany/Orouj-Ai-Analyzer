/**
 * ============================================================
 * عروج AI - الإصدار الاحترافي 4.0
 * حل نهائي لمشكلة الـ API وتجاوز CORS
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
        input.addEventListener('input', () => saveData());
        input.addEventListener('change', () => saveData());
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
    steps.forEach(s => {
        s.classList.remove("active");
        s.style.display = "none";
    });
    
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
    if (nextBtnText) {
        nextBtnText.textContent = STATE.currentStep === STATE.totalSteps ? "إرسال وتحليل البيانات" : "التالي";
    }
}

function changeStep(n) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${STATE.currentStep}"]`);
    if (n > 0) {
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
}

// 3. الإرسال والتحليل
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
    }, 4000);
    
    try {
        await sendToFormspree(data);
        const analysis = await getAIAnalysis(data);
        
        clearInterval(loadInterval);
        if (analysis) {
            showResults(analysis);
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
    } catch (e) { console.warn("Formspree bypass:", e); }
}

async function getAIAnalysis(data) {
    const apiKey = "sk-nry-V9H1WAFFgp8UautBZnQmlSQ8DInPevXCquhtPObGUZI";
    const apiUrl = "https://router.bynara.id/v1/chat/completions";
    // الحل النهائي: استخدام بروكسي مدمج في الرابط
    const finalUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);

    const prompt = `أنت مستشار أعمال استراتيجي من وكالة "عروج". قم بتحليل مشروع العميل بناءً على إجاباته الـ 25.
    البيانات: ${JSON.stringify(data)}
    
    المطلوب: اكتب تقريراً احترافياً جداً بالعناوين التالية:
    [التشخيص العميق للوضع الحالي]
    [تحليل الجمهور والمنافسة]
    [خارطة الطريق التسويقية]
    [نقاط القوة والضعف بالمشرط]
    [خطة العمل أول 3 خطوات ذهبية]
    [لماذا عروج هي المنقذ؟]
    [التوصية النهائية وطلب التواصل]`;

    const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify({
            model: "mimo-v2.5-free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })
    });

    if (!response.ok) throw new Error("API Error");
    const result = await response.json();
    return result.choices[0].message.content.trim();
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
            <div class="report-section" style="margin-bottom: 25px; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border-right: 5px solid #C9A84C; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h3 style="color: #C9A84C; margin-bottom: 15px; font-size: 1.4rem;">${parts[0]}</h3>
                <div style="line-height: 1.9; color: #e0e0e0; font-size: 1.1rem;">${parts[1].trim().replace(/\n/g, '<br>')}</div>
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
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.cssText = `width:${Math.random()*4}px;height:2px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*5}s;position:absolute;background:#C9A84C;opacity:0.3;border-radius:50%;`;
        container.appendChild(p);
    }
}
