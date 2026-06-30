/**
 * ============================================================
 * عروج AI - الإصدار الاحترافي 2.5
 * نظام التحليل الاستراتيجي (25 سؤال)
 * ============================================================
 */

var STATE = {
    currentStep: 1,
    totalSteps: 25,
    formData: {}
};

// 1. التنقل بين الخطوات
function startAnalysis() {
    document.getElementById("hero-Section").style.display = "none";
    document.getElementById("formSection").classList.add("active");
    updateProgress();
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

    // إخفاء الخطوة الحالية
    currentStepEl.classList.remove("active");
    
    // تحديث الخطوة
    STATE.currentStep += n;

    // إظهار الخطوة الجديدة
    steps[STATE.currentStep - 1].classList.add("active");

    // تحديث الأزرار والتقدم
    document.getElementById("prevBtn").style.display = STATE.currentStep === 1 ? "none" : "block";
    
    if (STATE.currentStep === STATE.totalSteps) {
        document.getElementById("nextBtnText").textContent = "إرسال وتحليل البيانات";
    } else {
        document.getElementById("nextBtnText").textContent = "التالي";
    }

    // إذا وصلنا لنهاية الأسئلة
    if (STATE.currentStep > STATE.totalSteps) {
        submitForm();
    } else {
        updateProgress();
    }
}

function updateProgress() {
    const pct = Math.round((STATE.currentStep / STATE.totalSteps) * 100);
    document.getElementById("progressBar").style.width = pct + "%";
    document.querySelector(".progress-percentage").textContent = pct + "%";
    document.querySelector(".current-step").textContent = STATE.currentStep;
}

// 2. معالجة حقل "أخرى"
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

// 3. إرسال وتحليل البيانات
async function submitForm() {
    const form = document.getElementById("analysisForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    STATE.formData = data;
    
    // إظهار شاشة التحميل
    document.getElementById("formSection").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    
    try {
        const analysis = await getAIAnalysis(data);
        showResults(analysis);
        // هنا يمكن إضافة وظيفة إرسال البيانات لـ Google Sheets
        sendToDatabase(data);
    } catch (err) {
        alert("حدث خطأ أثناء التحليل، يرجى المحاولة مرة أخرى.");
        location.reload();
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
    [التشخيص العميق للوضع الحالي] (اكتب 5 أسطر على الأقل)
    [تحليل الجمهور والمنافسة] (اكتب 3 نقاط مفصلة)
    [خارطة الطريق التسويقية] (اكتب 3 نقاط مفصلة)
    [نقاط القوة والضعف بالمشرط] (اكتب 4 نقاط مفصلة)
    [خطة العمل أول 3 خطوات ذهبية] (اكتب 3 خطوات مرقمة 1، 2، 3)
    [لماذا عروج هي المنقذ؟] (اكتب فقرة إقناعية قوية توضح كيف تحل عروج مشكلة العميل الممغصة)
    [التوصية النهائية وطلب التواصل] (دعوة للتواصل فوراً مع عروج)`;

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

    const result = await response.json();
    return result.choices[0].message.content.replace(/\*/g, '').replace(/#/g, '');
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
        const title = parts[0];
        const content = parts[1];
        
        html += `
            <div class="report-section">
                <h3>${title}</h3>
                <div>${content.replace(/\n/g, '<br>')}</div>
            </div>
        `;
    });
    
    reportContent.innerHTML = html;
    
    // تحريك دائرة السكور (عشوائي للجاهزية)
    const score = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    document.getElementById("scoreValue").textContent = score;
    const offset = 565 - (565 * score / 100);
    document.getElementById("scoreCircle").style.strokeDashoffset = offset;
}

// 4. وظيفة إرسال البيانات (قاعدة البيانات)
function sendToDatabase(data) {
    console.log("Sending data to database...", data);
    // ملاحظة للمستخدم: لربط Google Sheets، ستحتاج لاستخدام Google Apps Script URL هنا
    // fetch("https://formspree.io/f/xbdvkqaq", { method: "POST", body: JSON.stringify(data) });
}

// تهيئة الجسيمات في الخلفية
window.onload = function() {
    const container = document.getElementById("particles");
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
};
