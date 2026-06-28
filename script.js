/**
 * ============================================================
 * عروج AI - نظام تحليل المشاريع
 * Version: 1.0.0 | Production Ready
 * Author: عروج Agency
 * ============================================================
 */

// ============================================================
// CONFIG
// ============================================================

const CONFIG = {
  TOTAL_STEPS: 8,
  LOADING_DURATION: 8000,
  LOADING_MESSAGES: [
    "جارٍ تحليل بيانات مشروعك...",
    "نقيّم نقاط القوة والضعف...",
    "نستكشف فرص النمو في السوق...",
    "نُعدّ التوصيات المناسبة لك...",
    "نُحلّل المنافسين في قطاعك...",
    "نُراجع استراتيجيات التسويق الرقمي...",
    "نُصمّم خارطة طريقك للنجاح...",
    "جارٍ إعداد التقرير النهائي...",
  ],
  MESSAGE_INTERVAL: 1000,
  STORAGE_KEY: "orooj_form_data",
  PARTICLE_COUNT: 55,
  SCORE_DESCRIPTIONS: {
    excellent: { min: 8, label: "ممتاز", color: "#4CAF50" },
    veryGood: { min: 6, label: "جيد جداً", color: "#8BC34A" },
    good: { min: 4, label: "جيد", color: "#FFC107" },
    needsImprovement: { min: 0, label: "يحتاج تحسين", color: "#F44336" },
  },
  BUSINESS_TYPES: {
    restaurant: "مطعم أو كافيه",
    retail: "متجر تجزئة",
    services: "خدمات مهنية",
    ecommerce: "تجارة إلكترونية",
    fashion: "أزياء وموضة",
    beauty: "تجميل وعناية",
    tech: "تقنية ومعلومات",
    education: "تعليم وتدريب",
    healthcare: "صحة ورعاية",
    realestate: "عقارات",
    other: "أخرى",
  },
  GOALS: {
    brand_awareness: "بناء الهوية والوعي بالعلامة التجارية",
    sales: "زيادة المبيعات والإيرادات",
    social_growth: "النمو على منصات التواصل الاجتماعي",
    online_presence: "تعزيز الحضور الرقمي",
    customer_retention: "تحسين الاحتفاظ بالعملاء",
    leads: "توليد عملاء محتملين جدد",
  },
  CHALLENGES: {
    no_brand: "غياب هوية بصرية واضحة",
    low_engagement: "انخفاض التفاعل على السوشيال ميديا",
    no_strategy: "عدم وجود استراتيجية تسويقية",
    competition: "المنافسة الشديدة في السوق",
    budget: "محدودية الميزانية التسويقية",
    content: "صعوبة إنتاج محتوى جذاب",
    ads: "ضعف نتائج الإعلانات المدفوعة",
    reach: "محدودية الوصول للجمهور المستهدف",
  },
};

// ============================================================
// STATE
// ============================================================

const STATE = {
  currentStep: 1,
  formData: {},
  analysisResult: null,
  isLoading: false,
  loadingInterval: null,
  messageIndex: 0,
  particles: [],
  animationFrame: null,
};

// ============================================================
// DOM
// ============================================================

const DOM = {
  // Sections
  heroSection: null,
  formSection: null,
  loadingSection: null,
  resultsSection: null,

  // Form
  form: null,
  steps: [],
  progressBar: null,
  progressFill: null,
  stepCounter: null,
  stepTitle: null,

  // Buttons
  btnStart: null,
  btnNext: null,
  btnPrev: null,
  btnAnalyze: null,
  btnPrint: null,
  btnRestart: null,

  // Loading
  loadingMessage: null,
  loadingProgress: null,

  // Results
  resultsContainer: null,
  scoreCircle: null,
  scoreValue: null,
  scoreLabel: null,

  // Canvas
  particleCanvas: null,

  init() {
    this.heroSection = document.getElementById("hero-section");
    this.formSection = document.getElementById("form-section");
    this.loadingSection = document.getElementById("loading-section");
    this.resultsSection = document.getElementById("results-section");

    this.form = document.getElementById("analysis-form");
    this.steps = document.querySelectorAll(".form-step");
    this.progressBar = document.getElementById("progress-bar");
    this.progressFill = document.getElementById("progress-fill");
    this.stepCounter = document.getElementById("step-counter");
    this.stepTitle = document.getElementById("step-title");

    this.btnStart = document.getElementById("btn-start");
    this.btnNext = document.getElementById("btn-next");
    this.btnPrev = document.getElementById("btn-prev");
    this.btnAnalyze = document.getElementById("btn-analyze");
    this.btnPrint = document.getElementById("btn-print");
    this.btnRestart = document.getElementById("btn-restart");

    this.loadingMessage = document.getElementById("loading-message");
    this.loadingProgress = document.getElementById("loading-progress-fill");

    this.resultsContainer = document.getElementById("results-container");
    this.scoreCircle = document.getElementById("score-circle");
    this.scoreValue = document.getElementById("score-value");
    this.scoreLabel = document.getElementById("score-label");

    this.particleCanvas = document.getElementById("particle-canvas");
  },
};

// ============================================================
// VALIDATION
// ============================================================

const VALIDATION = {
  rules: {
    required: (value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && String(value).trim() !== "";
    },
    egyptPhone: (value) => /^01[0125][0-9]{8}$/.test(String(value).trim()),
    url: (value) => {
      if (!value || String(value).trim() === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/.test(value);
      }
    },
    minLength: (value, min) => String(value).trim().length >= min,
    maxLength: (value, max) => String(value).trim().length <= max,
  },

  messages: {
    required: "هذا الحقل مطلوب",
    egyptPhone: "يرجى إدخال رقم هاتف مصري صحيح (01xxxxxxxxx)",
    url: "يرجى إدخال رابط صحيح",
    minLength: (min) => `يجب أن يحتوي على ${min} أحرف على الأقل`,
    maxLength: (max) => `يجب ألا يتجاوز ${max} حرفاً`,
  },

  getFieldConfig(stepIndex) {
    const configs = [
      // Step 1 - Business Info
      {
        businessName: { required: true, minLength: 2 },
        businessType: { required: true },
        businessAge: { required: true },
        city: { required: true },
      },
      // Step 2 - Contact
      {
        ownerName: { required: true, minLength: 2 },
        phone: { required: true, egyptPhone: true },
        email: { required: false },
      },
      // Step 3 - Products/Services
      {
        productsDescription: { required: true, minLength: 20 },
        priceRange: { required: true },
        targetAudience: { required: true, minLength: 10 },
      },
      // Step 4 - Social Media
      {
        hasSocial: { required: true },
      },
      // Step 5 - Goals
      {
        goal: { required: true },
        monthlyBudget: { required: true },
      },
      // Step 6 - Challenges
      {
        challenges: { required: true },
      },
      // Step 7 - Competition
      {
        competitorNames: { required: false },
        uniqueValue: { required: true, minLength: 15 },
      },
      // Step 8 - Additional
      {
        additionalInfo: { required: false },
        expectations: { required: true },
      },
    ];
    return configs[stepIndex] || {};
  },

  validateField(name, value, rules) {
    const errors = [];

    if (rules.required && !this.rules.required(value)) {
      errors.push(this.messages.required);
      return errors;
    }

    if (value && String(value).trim() !== "") {
      if (rules.egyptPhone && !this.rules.egyptPhone(value)) {
        errors.push(this.messages.egyptPhone);
      }
      if (rules.url && !this.rules.url(value)) {
        errors.push(this.messages.url);
      }
      if (rules.minLength && !this.rules.minLength(value, rules.minLength)) {
        errors.push(this.messages.minLength(rules.minLength));
      }
      if (rules.maxLength && !this.rules.maxLength(value, rules.maxLength)) {
        errors.push(this.messages.maxLength(rules.maxLength));
      }
    }

    return errors;
  },

  validateStep(stepIndex) {
    const config = this.getFieldConfig(stepIndex);
    const stepEl = DOM.steps[stepIndex];
    let isValid = true;

    this.clearErrors(stepEl);

    for (const [fieldName, rules] of Object.entries(config)) {
      const value = this.getFieldValue(stepEl, fieldName);
      const errors = this.validateField(fieldName, value, rules);

      if (errors.length > 0) {
        this.showError(stepEl, fieldName, errors[0]);
        isValid = false;
      }
    }

    // Special validation: if hasSocial = yes, require socialLink
    if (stepIndex === 3) {
      const hasSocial = this.getFieldValue(stepEl, "hasSocial");
      if (hasSocial === "yes") {
        const socialLink = this.getFieldValue(stepEl, "socialLink");
        if (!socialLink || String(socialLink).trim() === "") {
          this.showError(stepEl, "socialLink", "يرجى إدخال رابط صفحتك على السوشيال ميديا");
          isValid = false;
        } else if (!this.rules.url(socialLink)) {
          this.showError(stepEl, "socialLink", this.messages.url);
          isValid = false;
        }
      }
    }

    return isValid;
  },

  getFieldValue(stepEl, fieldName) {
    // Radio
    const radio = stepEl.querySelector(`input[name="${fieldName}"]:checked`);
    if (radio) return radio.value;

    // Checkboxes
    const checkboxes = stepEl.querySelectorAll(`input[name="${fieldName}"]:checked`);
    if (checkboxes.length > 0) return Array.from(checkboxes).map((cb) => cb.value);

    // Select
    const select = stepEl.querySelector(`select[name="${fieldName}"]`);
    if (select) return select.value;

    // Text/textarea/tel
    const input = stepEl.querySelector(`[name="${fieldName}"]`);
    if (input) return input.value;

    return null;
  },

  showError(stepEl, fieldName, message) {
    const field = stepEl.querySelector(`[name="${fieldName}"]`);
    const container = field ? field.closest(".field-group") || field.parentElement : null;

    if (container) {
      let errorEl = container.querySelector(".field-error");
      if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.className = "field-error";
        container.appendChild(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.display = "block";
      if (field) field.classList.add("input-error");
    }
  },

  clearErrors(stepEl) {
    stepEl.querySelectorAll(".field-error").forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });
    stepEl.querySelectorAll(".input-error").forEach((el) => {
      el.classList.remove("input-error");
    });
  },
};

// ============================================================
// STORAGE
// ============================================================

const STORAGE = {
  save(data) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("AutoSave: تعذّر الحفظ في localStorage", e);
    }
  },

  load() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("AutoSave: تعذّر التحميل من localStorage", e);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (e) {
      console.warn("AutoSave: تعذّر الحذف من localStorage", e);
    }
  },

  restore(data) {
    if (!data) return;
    Object.entries(data).forEach(([name, value]) => {
      const els = document.querySelectorAll(`[name="${name}"]`);
      if (!els.length) return;

      const type = els[0].type;

      if (type === "radio") {
        els.forEach((el) => {
          el.checked = el.value === value;
        });
      } else if (type === "checkbox") {
        const values = Array.isArray(value) ? value : [value];
        els.forEach((el) => {
          el.checked = values.includes(el.value);
        });
      } else if (els[0].tagName === "SELECT") {
        els[0].value = value;
      } else {
        els[0].value = value;
      }
    });

    // Trigger social link visibility after restore
    const hasSocialEl = document.querySelector('input[name="hasSocial"]:checked');
    if (hasSocialEl) {
      FORM.toggleSocialLink(hasSocialEl.value);
    }
  },
};

// ============================================================
// PARTICLES (Utilities - Background)
// ============================================================

const PARTICLES = {
  canvas: null,
  ctx: null,
  items: [],

  init(canvas) {
    this.canvas = canvas;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.create();
    this.animate();
    window.addEventListener("resize", () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  create() {
    this.items = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      this.items.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6 ? "#C9A84C" : "#0D7377",
      });
    }
  },

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.items.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > this.canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.dy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });

    // Draw connecting lines
    this.items.forEach((a, i) => {
      this.items.slice(i + 1).forEach((b) => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = "#C9A84C";
          this.ctx.globalAlpha = (1 - dist / 100) * 0.12;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      });
    });

    STATE.animationFrame = requestAnimationFrame(() => this.animate());
  },
};

// ============================================================
// FORM
// ============================================================

const FORM = {
  collectData() {
    const data = {};
    document.querySelectorAll(".form-step").forEach((step) => {
      // Radios
      step.querySelectorAll("input[type='radio']:checked").forEach((el) => {
        data[el.name] = el.value;
      });
      // Checkboxes
      const checkGroups = {};
      step.querySelectorAll("input[type='checkbox']").forEach((el) => {
        if (!checkGroups[el.name]) checkGroups[el.name] = [];
        if (el.checked) checkGroups[el.name].push(el.value);
      });
      Object.assign(data, checkGroups);
      // Selects
      step.querySelectorAll("select").forEach((el) => {
        if (el.name) data[el.name] = el.value;
      });
      // Text/tel/textarea/email
      step
        .querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], textarea")
        .forEach((el) => {
          if (el.name) data[el.name] = el.value;
        });
    });
    return data;
  },

  toggleSocialLink(value) {
    const socialLinkGroup = document.getElementById("social-link-group");
    if (!socialLinkGroup) return;
    if (value === "yes") {
      socialLinkGroup.style.display = "block";
      socialLinkGroup.classList.add("fade-in");
    } else {
      socialLinkGroup.style.display = "none";
      const socialLinkInput = document.querySelector('[name="socialLink"]');
      if (socialLinkInput) socialLinkInput.value = "";
    }
  },

  autoSave() {
    const data = this.collectData();
    STATE.formData = data;
    STORAGE.save(data);
  },

  setupListeners() {
    // Auto-save on any input change
    document.addEventListener("input", () => this.autoSave());
    document.addEventListener("change", () => {
      this.autoSave();
      // Handle social link toggle
      const hasSocial = document.querySelector('input[name="hasSocial"]:checked');
      if (hasSocial) this.toggleSocialLink(hasSocial.value);
    });
  },
};

// ============================================================
// PROGRESS
// ============================================================

const PROGRESS = {
  stepTitles: [
    "معلومات المشروع الأساسية",
    "بيانات التواصل",
    "المنتجات والخدمات",
    "التواجد على السوشيال ميديا",
    "الأهداف والميزانية",
    "التحديات الحالية",
    "المنافسة والتميز",
    "معلومات إضافية وتوقعاتك",
  ],

  update(step) {
    const percentage = ((step - 1) / (CONFIG.TOTAL_STEPS - 1)) * 100;

    if (DOM.stepCounter) DOM.stepCounter.textContent = `الخطوة ${step} من ${CONFIG.TOTAL_STEPS}`;
    if (DOM.progressFill) DOM.progressFill.style.width = `${percentage}%`;
    if (DOM.stepTitle) DOM.stepTitle.textContent = this.stepTitles[step - 1] || "";

    // Update step dots if they exist
    document.querySelectorAll(".step-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index + 1 === step);
      dot.classList.toggle("completed", index + 1 < step);
    });
  },
};

// ============================================================
// NAVIGATION
// ============================================================

const NAV = {
  showStep(stepNumber) {
    DOM.steps.forEach((step, index) => {
      step.classList.toggle("active", index + 1 === stepNumber);
      step.style.display = index + 1 === stepNumber ? "block" : "none";
    });

    // Show/hide buttons
    if (DOM.btnPrev) DOM.btnPrev.style.display = stepNumber > 1 ? "flex" : "none";
    if (DOM.btnNext) DOM.btnNext.style.display = stepNumber < CONFIG.TOTAL_STEPS ? "flex" : "none";
    if (DOM.btnAnalyze) DOM.btnAnalyze.style.display = stepNumber === CONFIG.TOTAL_STEPS ? "flex" : "none";

    PROGRESS.update(stepNumber);
    STATE.currentStep = stepNumber;

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  goNext() {
    const isValid = VALIDATION.validateStep(STATE.currentStep - 1);
    if (!isValid) return;

    FORM.autoSave();

    if (STATE.currentStep < CONFIG.TOTAL_STEPS) {
      this.showStep(STATE.currentStep + 1);
    }
  },

  goPrev() {
    if (STATE.currentStep > 1) {
      this.showStep(STATE.currentStep - 1);
    }
  },

  showSection(sectionName) {
    const sections = {
      hero: DOM.heroSection,
      form: DOM.formSection,
      loading: DOM.loadingSection,
      results: DOM.resultsSection,
    };

    Object.entries(sections).forEach(([name, el]) => {
      if (!el) return;
      if (name === sectionName) {
        el.style.display = "block";
        el.classList.add("fade-in");
      } else {
        el.style.display = "none";
        el.classList.remove("fade-in");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  startForm() {
    this.showSection("form");
    this.showStep(1);
  },
};

// ============================================================
// LOADING
// ============================================================

const LOADING = {
  start() {
    NAV.showSection("loading");
    STATE.messageIndex = 0;
    STATE.isLoading = true;

    if (DOM.loadingMessage) {
      DOM.loadingMessage.textContent = CONFIG.LOADING_MESSAGES[0];
    }

    let elapsed = 0;
    const interval = 100;
    const totalMessages = CONFIG.LOADING_MESSAGES.length;

    STATE.loadingInterval = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / CONFIG.LOADING_DURATION) * 100, 100);

      if (DOM.loadingProgress) {
        DOM.loadingProgress.style.width = `${progress}%`;
      }

      const msgIndex = Math.floor((elapsed / CONFIG.LOADING_DURATION) * totalMessages);
      const clampedIndex = Math.min(msgIndex, totalMessages - 1);
      if (clampedIndex !== STATE.messageIndex) {
        STATE.messageIndex = clampedIndex;
        if (DOM.loadingMessage) {
          DOM.loadingMessage.classList.add("fade-out");
          setTimeout(() => {
            if (DOM.loadingMessage) {
              DOM.loadingMessage.textContent = CONFIG.LOADING_MESSAGES[clampedIndex];
              DOM.loadingMessage.classList.remove("fade-out");
              DOM.loadingMessage.classList.add("fade-in");
            }
          }, 200);
        }
      }

      if (elapsed >= CONFIG.LOADING_DURATION) {
        clearInterval(STATE.loadingInterval);
      }
    }, interval);
  },

  stop() {
    if (STATE.loadingInterval) {
      clearInterval(STATE.loadingInterval);
      STATE.loadingInterval = null;
    }
    STATE.isLoading = false;
  },
};

// ============================================================
// AI
// ============================================================

async function analyzeBusiness(data) {
  // ADD API HERE
  // Example:
  // const response = await fetch("sk-nry-kIotj6pztHVIwuyvsd1ulEJcU_jRcoZre6X-MRPAi8U", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // return await response.json();

  // Default fallback analysis
  return generateDefaultAnalysis(data);
}

function generateDefaultAnalysis(data) {
  const businessType = data.businessType || "other";
  const goal = data.goal || "";
  const challenges = Array.isArray(data.challenges) ? data.challenges : [];
  const hasSocial = data.hasSocial === "yes";
  const businessAge = data.businessAge || "new";
  const budget = data.monthlyBudget || "low";

  // Calculate score
  let score = 5;

  if (hasSocial) score += 1;
  if (businessAge === "established" || businessAge === "growing") score += 1;
  if (budget === "high" || budget === "medium") score += 1;
  if (challenges.length <= 3) score += 0.5;
  if (data.uniqueValue && data.uniqueValue.length > 30) score += 0.5;

  score = Math.min(Math.round(score * 10) / 10, 10);

  const businessTypeLabel = CONFIG.BUSINESS_TYPES[businessType] || "مشروع تجاري";
  const goalLabel = CONFIG.GOALS[goal] || "تطوير الأعمال";

  const strengthsList = [];
  const weaknessesList = [];
  const opportunitiesList = [];
  const servicesList = [];
  const nextStepsList = [];

  // Strengths
  if (hasSocial) strengthsList.push("لديك تواجد مسبق على منصات التواصل الاجتماعي يمكن البناء عليه");
  if (data.uniqueValue) strengthsList.push(`تمتلك قيمة تنافسية واضحة: ${data.uniqueValue.substring(0, 80)}...`);
  if (businessAge === "established") strengthsList.push("خبرة مُكتسبة في السوق تمنحك ميزة تنافسية على المنافسين الجدد");
  if (budget === "high") strengthsList.push("ميزانية تسويقية مناسبة تتيح لك تنفيذ حملات متكاملة وفعّالة");
  if (strengthsList.length === 0) strengthsList.push("وضوح الرؤية في هدفك التسويقي يُسهّل بناء الاستراتيجية الصحيحة");

  // Weaknesses
  if (challenges.includes("no_brand")) weaknessesList.push("غياب هوية بصرية واضحة يُضعف الانطباع الأول لدى العملاء");
  if (challenges.includes("no_strategy")) weaknessesList.push("عدم وجود استراتيجية تسويقية موثقة يؤدي إلى تشتت الجهود وضياع الموارد");
  if (challenges.includes("low_engagement")) weaknessesList.push("انخفاض معدل التفاعل يُشير إلى ضعف في جودة المحتوى أو توقيت النشر");
  if (!hasSocial) weaknessesList.push("غياب التواجد الرقمي يجعلك غير مرئي لشريحة كبيرة من عملائك المحتملين");
  if (budget === "low") weaknessesList.push("محدودية الميزانية تستوجب التركيز على القنوات ذات العائد الأعلى");
  if (weaknessesList.length === 0) weaknessesList.push("تحتاج إلى تعزيز وجودك الرقمي لتواكب المنافسة المتصاعدة في السوق");

  // Opportunities
  opportunitiesList.push(`قطاع ${businessTypeLabel} في نمو مستمر ويتيح فرصاً واسعة للتمييز الرقمي`);
  opportunitiesList.push("التسويق بالمحتوى العربي يملأ فراغاً كبيراً في السوق المحلي ويجذب جمهوراً أوسع");
  if (goal === "sales") opportunitiesList.push("الإعلانات الممولة المستهدفة على فيسبوك وإنستغرام تحقق عائداً ممتازاً في هذا القطاع");
  if (goal === "social_growth") opportunitiesList.push("الريلز والفيديو القصير يحقق انتشاراً عضوياً واسعاً بتكلفة منخفضة");
  opportunitiesList.push("التعاون مع المؤثرين المحليين الصغار (Micro-Influencers) يمنحك وصولاً استهدافياً بتكلفة معقولة");

  // Services
  if (goal === "brand_awareness" || challenges.includes("no_brand")) {
    servicesList.push("تصميم هوية بصرية متكاملة (شعار، ألوان، خطوط، دليل العلامة التجارية)");
  }
  if (goal === "social_growth" || challenges.includes("low_engagement")) {
    servicesList.push("إدارة منصات التواصل الاجتماعي مع خطة محتوى شهرية احترافية");
  }
  if (goal === "sales" || challenges.includes("ads")) {
    servicesList.push("إدارة حملات الإعلانات الممولة (Meta Ads & Google Ads) مع تتبع النتائج");
  }
  if (challenges.includes("content")) {
    servicesList.push("إنتاج محتوى إبداعي (تصوير، فيديو، تصميم) يعكس هوية علامتك التجارية");
  }
  servicesList.push("استراتيجية تسويقية رقمية شاملة مخصصة لقطاعك وأهدافك");
  servicesList.push("تقارير أداء شهرية مع توصيات لتحسين النتائج المستمر");

  // Next Steps
  nextStepsList.push("احجز جلسة استشارية مجانية مع فريق عروج لمناقشة خطتك التسويقية");
  nextStepsList.push(`ابدأ بتدقيق وضعك الحالي على السوشيال ميديا وتحديد الثغرات في ${businessTypeLabel}`);
  nextStepsList.push("ضع ميزانية تسويقية واضحة بعائد استثمار مُقاس لأول 3 أشهر");

  const recommendation = `بناءً على تحليل مشروعك في قطاع ${businessTypeLabel} وهدفك المتمثل في "${goalLabel}"، نوصي بالبدء فوراً بـ${servicesList[0]}. مشروعك يمتلك إمكانات حقيقية للنمو، وعروج جاهزة لتكون شريكك الاستراتيجي في هذه الرحلة.`;

  return {
    score,
    sections: {
      summary: `تحليل شامل لمشروعك في قطاع ${businessTypeLabel} يكشف عن فرصة تسويقية واعدة. هدفك الأساسي هو "${goalLabel}"، وبناءً على المعطيات المُقدمة، يُقيَّم مشروعك بـ ${score} من 10. التحدي الرئيسي الذي يواجهك هو ${challenges.length > 0 ? CONFIG.CHALLENGES[challenges[0]] || "تطوير الاستراتيجية" : "تعزيز الحضور الرقمي"}، وهو تحدٍ قابل للحل بمنهجية صحيحة ونهج مدروس.`,
      strengths: strengthsList,
      weaknesses: weaknessesList,
      opportunities: opportunitiesList,
      services: servicesList,
      nextSteps: nextStepsList,
      recommendation,
    },
  };
}

// ============================================================
// RESULTS
// ============================================================

function getScoreDescription(score) {
  if (score >= CONFIG.SCORE_DESCRIPTIONS.excellent.min) return CONFIG.SCORE_DESCRIPTIONS.excellent;
  if (score >= CONFIG.SCORE_DESCRIPTIONS.veryGood.min) return CONFIG.SCORE_DESCRIPTIONS.veryGood;
  if (score >= CONFIG.SCORE_DESCRIPTIONS.good.min) return CONFIG.SCORE_DESCRIPTIONS.good;
  return CONFIG.SCORE_DESCRIPTIONS.needsImprovement;
}

function animateScore(targetScore, element, circleEl) {
  let current = 0;
  const step = targetScore / 60;
  const interval = setInterval(() => {
    current = Math.min(current + step, targetScore);
    if (element) element.textContent = current.toFixed(1);

    // Animate SVG circle
    if (circleEl) {
      const circumference = 2 * Math.PI * 54;
      const offset = circumference - (current / 10) * circumference;
      circleEl.style.strokeDashoffset = offset;
    }

    if (current >= targetScore) {
      clearInterval(interval);
      if (element) element.textContent = targetScore.toFixed(1);
    }
  }, 16);
}

function renderReport(analysis) {
  if (!analysis || !analysis.sections) return;

  const { score, sections } = analysis;
  const desc = getScoreDescription(score);

  // Score display
  if (DOM.scoreValue) {
    const scoreCirclePath = document.getElementById("score-circle-path");
    const circumference = 2 * Math.PI * 54;
    if (scoreCirclePath) {
      scoreCirclePath.style.strokeDasharray = circumference;
      scoreCirclePath.style.stroke = desc.color;
      scoreCirclePath.style.strokeDashoffset = circumference;
    }
    setTimeout(() => animateScore(score, DOM.scoreValue, scoreCirclePath), 300);
  }

  if (DOM.scoreLabel) {
    DOM.scoreLabel.textContent = desc.label;
    DOM.scoreLabel.style.color = desc.color;
  }

  // Build report HTML
  const reportHTML = `
    <div class="report-grid">
      ${buildAccordion("📋 الملخص التنفيذي", renderSummary(sections.summary), "summary", true)}
      ${buildAccordion("💪 نقاط القوة", renderList(sections.strengths, "strength-item"), "strengths")}
      ${buildAccordion("⚠️ نقاط الضعف", renderList(sections.weaknesses, "weakness-item"), "weaknesses")}
      ${buildAccordion("🚀 فرص النمو", renderList(sections.opportunities, "opportunity-item"), "opportunities")}
      ${buildAccordion("🛠️ الخدمات الموصى بها", renderList(sections.services, "service-item"), "services")}
      ${buildAccordion("✅ أول 3 خطوات", renderSteps(sections.nextSteps), "next-steps")}
      ${buildAccordion("⭐ توصية عروج", renderRecommendation(sections.recommendation), "recommendation", true)}
    </div>
  `;

  if (DOM.resultsContainer) {
    DOM.resultsContainer.innerHTML = reportHTML;
    setupAccordions();
  }
}

function buildAccordion(title, content, id, openByDefault = false) {
  return `
    <div class="accordion-item ${openByDefault ? "open" : ""}" id="acc-${id}">
      <button class="accordion-header" onclick="toggleAccordion('acc-${id}')">
        <span class="accordion-title">${title}</span>
        <span class="accordion-icon">${openByDefault ? "▲" : "▼"}</span>
      </button>
      <div class="accordion-body" style="display: ${openByDefault ? "block" : "none"}">
        ${content}
      </div>
    </div>
  `;
}

function renderSummary(text) {
  return `<p class="summary-text">${text}</p>`;
}

function renderList(items, className) {
  if (!items || items.length === 0) return "<p>لا توجد بيانات</p>";
  return `<ul class="report-list">${items.map((item) => `<li class="${className}"><span class="list-icon">◆</span>${item}</li>`).join("")}</ul>`;
}

function renderSteps(steps) {
  if (!steps || steps.length === 0) return "<p>لا توجد خطوات</p>";
  return `<ol class="steps-list">${steps
    .slice(0, 3)
    .map(
      (step, i) =>
        `<li class="step-item"><span class="step-number">${i + 1}</span><span class="step-text">${step}</span></li>`
    )
    .join("")}</ol>`;
}

function renderRecommendation(text) {
  return `
    <div class="recommendation-box">
      <div class="orooj-logo-badge">عـروج</div>
      <p class="recommendation-text">${text}</p>
      <a href="https://wa.me/201284324217" target="_blank" class="whatsapp-btn">
        💬 تواصل معنا على واتساب
      </a>
    </div>
  `;
}

function toggleAccordion(id) {
  const item = document.getElementById(id);
  if (!item) return;

  const body = item.querySelector(".accordion-body");
  const icon = item.querySelector(".accordion-icon");
  const isOpen = item.classList.contains("open");

  if (isOpen) {
    item.classList.remove("open");
    body.style.display = "none";
    if (icon) icon.textContent = "▼";
  } else {
    item.classList.add("open");
    body.style.display = "block";
    if (icon) icon.textContent = "▲";
  }
}

function setupAccordions() {
  // Already handled via inline onclick in buildAccordion
}

// ============================================================
// PDF
// ============================================================

function printReport() {
  window.print();
}

// ============================================================
// UTILITIES
// ============================================================

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function restartApp() {
  STORAGE.clear();
  STATE.currentStep = 1;
  STATE.formData = {};
  STATE.analysisResult = null;

  if (DOM.form) DOM.form.reset();

  const socialLinkGroup = document.getElementById("social-link-group");
  if (socialLinkGroup) socialLinkGroup.style.display = "none";

  NAV.showSection("hero");
}

function bindEvents() {
  // Start button
  if (DOM.btnStart) {
    DOM.btnStart.addEventListener("click", () => NAV.startForm());
  }

  // Next button
  if (DOM.btnNext) {
    DOM.btnNext.addEventListener("click", () => NAV.goNext());
  }

  // Prev button
  if (DOM.btnPrev) {
    DOM.btnPrev.addEventListener("click", () => NAV.goPrev());
  }

  // Analyze button
  if (DOM.btnAnalyze) {
    DOM.btnAnalyze.addEventListener("click", async () => {
      const isValid = VALIDATION.validateStep(STATE.currentStep - 1);
      if (!isValid) return;

      FORM.autoSave();
      const data = FORM.collectData();
      STATE.formData = data;

      LOADING.start();

      try {
        const [analysis] = await Promise.all([
          analyzeBusiness(data),
          new Promise((resolve) => setTimeout(resolve, CONFIG.LOADING_DURATION)),
        ]);

        STATE.analysisResult = analysis;
        LOADING.stop();
        NAV.showSection("results");
        renderReport(analysis);
      } catch (error) {
        console.error("خطأ في التحليل:", error);
        LOADING.stop();
        const fallback = generateDefaultAnalysis(data);
        STATE.analysisResult = fallback;
        NAV.showSection("results");
        renderReport(fallback);
      }
    });
  }

  // Print button
  if (DOM.btnPrint) {
    DOM.btnPrint.addEventListener("click", () => printReport());
  }

  // Restart button
  if (DOM.btnRestart) {
    DOM.btnRestart.addEventListener("click", () => restartApp());
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (DOM.formSection && DOM.formSection.style.display !== "none") {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (STATE.currentStep < CONFIG.TOTAL_STEPS) {
          NAV.goNext();
        }
      }
    }
  });
}

// ============================================================
// INIT
// ============================================================

function init() {
  DOM.init();

  // Initialize particles
  PARTICLES.init(DOM.particleCanvas);

  // Bind all events
  bindEvents();

  // Setup form listeners for auto-save
  FORM.setupListeners();

  // Restore saved data if any
  const savedData = STORAGE.load();
  if (savedData && Object.keys(savedData).length > 0) {
    setTimeout(() => STORAGE.restore(savedData), 100);
  }

  // Show initial step setup
  NAV.showSection("hero");

  // Make toggleAccordion globally accessible
  window.toggleAccordion = toggleAccordion;

  console.log("%cعروج AI — جاهز للتحليل 🚀", "color: #C9A84C; font-size: 16px; font-weight: bold;");
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
