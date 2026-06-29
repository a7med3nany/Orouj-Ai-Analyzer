/**
 * ============================================================
 * عروج AI - نظام تحليل المشاريع
 * Version: 2.0.0 | Production Ready — HTML-Compatible Build
 * Author: عروج Agency
 * ============================================================
 *
 * HTML ID MAP (do NOT change — must match index.html exactly):
 *   hero-Section        → Hero section  (capital S)
 *   formSection         → Form section
 *   loadingScreen       → Loading screen
 *   resultsSection      → Results section
 *   analysisForm        → The <form>
 *   progressBar         → The fill bar inside .progress-bar-container
 *   prevBtn             → Previous button
 *   nextBtn             → Next button
 *   nextBtnText         → <span> inside nextBtn
 *   loadingMessage      → Loading status text
 *   scoreCircle         → SVG <circle> for animated ring (r=90)
 *   scoreValue          → Numeric score display
 *   reportContent       → Report injection target
 *   socialLinkField     → Conditional social link group
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
  STORAGE_KEY: "orooj_form_data",
  PARTICLE_COUNT: 50,
  SCORE_DESCRIPTIONS: {
    excellent:        { min: 8, label: "ممتاز",        color: "#4CAF50" },
    veryGood:         { min: 6, label: "جيد جداً",     color: "#8BC34A" },
    good:             { min: 4, label: "جيد",           color: "#FFC107" },
    needsImprovement: { min: 0, label: "يحتاج تحسين",  color: "#F44336" },
  },
  BUSINESS_TYPES: {
    restaurant: "مطعم أو كافيه",
    clinic:     "عيادة أو مركز طبي",
    ecommerce:  "متجر إلكتروني",
    fashion:    "ملابس وأزياء",
    education:  "تعليم وكورسات",
    realestate: "عقارات",
    services:   "خدمات",
    company:    "شركة",
    other:      "أخرى",
  },
  GOALS: {
    "increase-sales":           "زيادة المبيعات",
    "build-brand":              "بناء براند قوي",
    "increase-customers":       "زيادة عدد العملاء",
    "improve-online-presence":  "تحسين الظهور على الإنترنت",
    "launch-project":           "إطلاق مشروع جديد",
    "improve-ads":              "تحسين الإعلانات",
  },
  CHALLENGES: {
    "weak-sales":      "ضعف المبيعات",
    "weak-engagement": "ضعف التفاعل على السوشيال ميديا",
    "no-identity":     "عدم وجود هوية بصرية واضحة",
    "weak-content":    "ضعف المحتوى",
    "few-customers":   "قلة العملاء",
    "ads-not-working": "الإعلانات لا تحقق نتائج",
    "launch":          "إطلاق المشروع بشكل احترافي",
    "other":           "أخرى",
  },
  BUDGETS: {
    "less-3k":  "أقل من 3000 جنيه",
    "3k-10k":   "3000 - 10000 جنيه",
    "10k-30k":  "10000 - 30000 جنيه",
    "30k-plus": "أكثر من 30000 جنيه",
  },
  BUSINESS_AGES: {
    "new":         "مشروع جديد",
    "less-year":   "أقل من سنة",
    "1-3-years":   "من سنة إلى 3 سنوات",
    "3plus-years": "أكثر من 3 سنوات",
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
  loadingTimer: null,
  loadingInterval: null,
  messageIndex: 0,
  animationFrame: null,
};

// ============================================================
// DOM  — all IDs matched to index.html
// ============================================================

const DOM = {
  heroSection:    null,   // id="hero-Section"
  formSection:    null,   // id="formSection"
  loadingScreen:  null,   // id="loadingScreen"
  resultsSection: null,   // id="resultsSection"

  form:           null,   // id="analysisForm"
  steps:          [],     // class="form-step"
  progressBar:    null,   // id="progressBar"   ← the fill bar
  progressPct:    null,   // class="progress-percentage" (text)
  currentStepEl:  null,   // class="current-step" inside step-counter

  prevBtn:        null,   // id="prevBtn"
  nextBtn:        null,   // id="nextBtn"
  nextBtnText:    null,   // id="nextBtnText"

  loadingMessage: null,   // id="loadingMessage"
  loadingBarFill: null,   // class="loading-progress-bar" (no id in HTML)

  scoreCircle:    null,   // id="scoreCircle"  (SVG circle r=90)
  scoreValue:     null,   // id="scoreValue"
  reportContent:  null,   // id="reportContent"

  socialLinkField: null,  // id="socialLinkField"

  particleContainer: null, // id="particles"

  init() {
    this.heroSection     = document.getElementById("hero-Section");
    this.formSection     = document.getElementById("formSection");
    this.loadingScreen   = document.getElementById("loadingScreen");
    this.resultsSection  = document.getElementById("resultsSection");

    this.form            = document.getElementById("analysisForm");
    this.steps           = Array.from(document.querySelectorAll(".form-step"));
    this.progressBar     = document.getElementById("progressBar");
    this.progressPct     = document.querySelector(".progress-percentage");
    this.currentStepEl   = document.querySelector(".current-step");

    this.prevBtn         = document.getElementById("prevBtn");
    this.nextBtn         = document.getElementById("nextBtn");
    this.nextBtnText     = document.getElementById("nextBtnText");

    this.loadingMessage  = document.getElementById("loadingMessage");
    this.loadingBarFill  = document.querySelector(".loading-progress-bar");

    this.scoreCircle     = document.getElementById("scoreCircle");
    this.scoreValue      = document.getElementById("scoreValue");
    this.reportContent   = document.getElementById("reportContent");

    this.socialLinkField = document.getElementById("socialLinkField");

    this.particleContainer = document.getElementById("particles");
  },
};

// ============================================================
// VALIDATION  — mapped to actual HTML field names per step
// ============================================================

const VALIDATION = {
  // Per-step field config — index = stepIndex (0-based)
  stepConfigs: [
    // Step 1: fullName, whatsapp
    {
      fullName:  { required: true, minLength: 2 },
      whatsapp:  { required: true, egyptPhone: true },
    },
    // Step 2: businessName, businessType
    {
      businessName: { required: true, minLength: 2 },
      businessType: { required: true },
    },
    // Step 3: businessAge (radio)
    {
      businessAge: { required: true },
    },
    // Step 4: challenges (checkbox group, at least 1)
    {
      challenges: { required: true },
    },
    // Step 5: goal (radio)
    {
      goal: { required: true },
    },
    // Step 6: hasSocial (radio) + conditional socialLink
    {
      hasSocial: { required: true },
    },
    // Step 7: budget (radio)
    {
      budget: { required: true },
    },
    // Step 8: mainProblem (textarea)
    {
      mainProblem: { required: true, minLength: 10 },
    },
  ],

  rules: {
    required(value) {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && String(value).trim() !== "";
    },
    egyptPhone(value) {
      return /^01[0125][0-9]{8}$/.test(String(value).trim());
    },
    url(value) {
      if (!value || String(value).trim() === "") return true;
      try { new URL(value); return true; } catch (_) {}
      return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\u0600-\u06FF-]+(\.[a-zA-Z]{2,})+/.test(value);
    },
    minLength(value, min) {
      return String(value).trim().length >= min;
    },
  },

  messages: {
    required:   "هذا الحقل مطلوب",
    egyptPhone: "يرجى إدخال رقم هاتف مصري صحيح (01xxxxxxxxx)",
    url:        "يرجى إدخال رابط صحيح",
    minLength:  (min) => `يجب أن يحتوي على ${min} أحرف على الأقل`,
  },

  // Read field value from a step element
  getFieldValue(stepEl, name) {
    // Checked radio
    const radio = stepEl.querySelector(`input[type="radio"][name="${name}"]:checked`);
    if (radio) return radio.value;

    // Checkboxes → array
    const checkboxes = stepEl.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
    if (checkboxes.length) {
      const checked = Array.from(checkboxes).filter((c) => c.checked).map((c) => c.value);
      return checked;
    }

    // Select
    const select = stepEl.querySelector(`select[name="${name}"]`);
    if (select) return select.value;

    // Everything else
    const el = stepEl.querySelector(`[name="${name}"]`);
    return el ? el.value : null;
  },

  // Show error below a field
  showError(stepEl, name, message) {
    // Try to find nearest .input-error sibling to the field
    const field = stepEl.querySelector(`[name="${name}"]`);
    let errorEl = null;

    if (field) {
      const parent = field.closest(".form-group") || field.parentElement;
      errorEl = parent ? parent.querySelector(".input-error") : null;
      if (field) field.classList.add("is-invalid");
    }

    // Fallback: first .input-error in step
    if (!errorEl) {
      errorEl = stepEl.querySelector(".input-error");
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
      errorEl.style.color = "#e74c3c";
      errorEl.style.fontSize = "0.82rem";
      errorEl.style.marginTop = "4px";
    }
  },

  clearErrors(stepEl) {
    stepEl.querySelectorAll(".input-error").forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });
    stepEl.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  },

  // Validate all fields in a step. Returns true if valid.
  validateStep(stepIndex) {
    const config = this.stepConfigs[stepIndex] || {};
    const stepEl = DOM.steps[stepIndex];
    if (!stepEl) return true;

    this.clearErrors(stepEl);
    let valid = true;

    for (const [name, rules] of Object.entries(config)) {
      const value = this.getFieldValue(stepEl, name);

      if (rules.required && !this.rules.required(value)) {
        this.showError(stepEl, name, this.messages.required);
        valid = false;
        continue;
      }

      const strVal = Array.isArray(value) ? value.join(",") : String(value || "");

      if (rules.egyptPhone && !this.rules.egyptPhone(strVal)) {
        this.showError(stepEl, name, this.messages.egyptPhone);
        valid = false;
      }

      if (rules.minLength && !this.rules.minLength(strVal, rules.minLength)) {
        this.showError(stepEl, name, this.messages.minLength(rules.minLength));
        valid = false;
      }
    }

    // Step 6 (index 5): if hasSocial=yes → socialLink required
    if (stepIndex === 5) {
      const hasSocial = this.getFieldValue(stepEl, "hasSocial");
      if (hasSocial === "yes") {
        const linkVal = this.getFieldValue(stepEl, "socialLink");
        if (!linkVal || String(linkVal).trim() === "") {
          this.showError(stepEl, "socialLink", "يرجى إدخال رابط صفحتك على السوشيال ميديا");
          valid = false;
        } else if (!this.rules.url(linkVal)) {
          this.showError(stepEl, "socialLink", this.messages.url);
          valid = false;
        }
      }
    }

    return valid;
  },
};

// ============================================================
// STORAGE
// ============================================================

const STORAGE = {
  save(data) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.warn("AutoSave failed:", e); }
  },
  load() {
    try {
      const s = localStorage.getItem(CONFIG.STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  },
  clear() {
    try { localStorage.removeItem(CONFIG.STORAGE_KEY); }
    catch (e) { /* silent */ }
  },
  restore(data) {
    if (!data) return;
    Object.entries(data).forEach(([name, value]) => {
      const els = document.querySelectorAll(`[name="${name}"]`);
      if (!els.length) return;
      const type = els[0].type;

      if (type === "radio") {
        els.forEach((el) => { el.checked = el.value === value; });
      } else if (type === "checkbox") {
        const vals = Array.isArray(value) ? value : [value];
        els.forEach((el) => { el.checked = vals.includes(el.value); });
      } else if (els[0].tagName === "SELECT") {
        els[0].value = value;
      } else {
        els[0].value = value;
      }
    });
    // Re-trigger social link visibility
    const social = document.querySelector('input[name="hasSocial"]:checked');
    if (social) toggleSocialLink(social.value);
  },
};

// ============================================================
// PARTICLES  — canvas-free, DOM-based (injected into #particles)
// ============================================================

const PARTICLES_SYS = {
  container: null,
  items: [],
  running: false,

  init(container) {
    this.container = container;
    if (!container) return;

    // Make container fixed & full-screen
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "0",
      overflow: "hidden",
    });

    this.create();
    this.running = true;
    this.tick();
  },

  create() {
    this.items = [];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 4 + 1;
      const isGold = Math.random() > 0.55;

      Object.assign(el.style, {
        position: "absolute",
        width:  size + "px",
        height: size + "px",
        borderRadius: "50%",
        background: isGold ? "#C9A84C" : "#0D7377",
        opacity: String(Math.random() * 0.45 + 0.08),
        willChange: "transform",
        transition: "none",
      });

      const p = {
        el,
        x: Math.random() * W,
        y: Math.random() * H,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      };

      el.style.transform = `translate(${p.x}px,${p.y}px)`;
      this.container.appendChild(el);
      this.items.push(p);
    }
  },

  tick() {
    if (!this.running) return;
    const W = window.innerWidth;
    const H = window.innerHeight;

    this.items.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      p.el.style.transform = `translate(${p.x}px,${p.y}px)`;
    });

    STATE.animationFrame = requestAnimationFrame(() => this.tick());
  },
};

// ============================================================
// FORM HELPERS
// ============================================================

function collectFormData() {
  const data = {};
  DOM.steps.forEach((step) => {
    // Radios
    step.querySelectorAll("input[type='radio']:checked").forEach((el) => {
      data[el.name] = el.value;
    });
    // Checkboxes
    const cbMap = {};
    step.querySelectorAll("input[type='checkbox']").forEach((el) => {
      if (!cbMap[el.name]) cbMap[el.name] = [];
      if (el.checked) cbMap[el.name].push(el.value);
    });
    Object.assign(data, cbMap);
    // Selects
    step.querySelectorAll("select").forEach((el) => {
      if (el.name) data[el.name] = el.value;
    });
    // Text inputs
    step.querySelectorAll("input[type='text'],input[type='tel'],input[type='email'],input[type='url'],textarea").forEach((el) => {
      if (el.name) data[el.name] = el.value;
    });
  });
  return data;
}

function autoSave() {
  const data = collectFormData();
  STATE.formData = data;
  STORAGE.save(data);
}

// ============================================================
// PROGRESS BAR
// ============================================================

function updateProgress(step) {
  const pct = Math.round(((step - 1) / (CONFIG.TOTAL_STEPS - 1)) * 100);

  if (DOM.progressBar) DOM.progressBar.style.width = pct + "%";
  if (DOM.progressPct) DOM.progressPct.textContent = pct + "%";
  if (DOM.currentStepEl) DOM.currentStepEl.textContent = step;
}

// ============================================================
// STEP DISPLAY
// ============================================================

function showStep(stepNumber) {
  DOM.steps.forEach((el) => {
    const isActive = parseInt(el.getAttribute("data-step")) === stepNumber;
    el.style.display = isActive ? "block" : "none";
    el.classList.toggle("active", isActive);
  });

  // Prev button
  if (DOM.prevBtn) {
    DOM.prevBtn.style.display = stepNumber > 1 ? "" : "none";
  }

  // Next / Submit button text
  if (DOM.nextBtnText) {
    if (stepNumber === CONFIG.TOTAL_STEPS) {
      DOM.nextBtnText.textContent = "احصل على التحليل";
    } else {
      DOM.nextBtnText.textContent = "التالي";
    }
  }

  updateProgress(stepNumber);
  STATE.currentStep = stepNumber;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// SECTION VISIBILITY
// ============================================================

function showSection(name) {
  const map = {
    hero:     DOM.heroSection,
    form:     DOM.formSection,
    loading:  DOM.loadingScreen,
    results:  DOM.resultsSection,
  };
  Object.entries(map).forEach(([key, el]) => {
    if (!el) return;
    if (key === name) {
      el.style.display = "block";
      el.style.opacity = "1";
    } else {
      el.style.display = "none";
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// SOCIAL LINK TOGGLE
// ============================================================

function toggleSocialLink(value) {
  if (!DOM.socialLinkField) return;
  if (value === "yes") {
    DOM.socialLinkField.style.display = "block";
  } else {
    DOM.socialLinkField.style.display = "none";
    const linkInput = document.querySelector('[name="socialLink"]');
    if (linkInput) linkInput.value = "";
  }
}

// ============================================================
// LOADING SCREEN
// ============================================================

function showLoading() {
  showSection("loading");
  STATE.isLoading = true;
  STATE.messageIndex = 0;

  if (DOM.loadingBarFill) DOM.loadingBarFill.style.width = "0%";
  if (DOM.loadingMessage) DOM.loadingMessage.textContent = CONFIG.LOADING_MESSAGES[0];

  let elapsed = 0;
  const tick = 100;
  const total = CONFIG.LOADING_DURATION;
  const msgCount = CONFIG.LOADING_MESSAGES.length;

  STATE.loadingInterval = setInterval(() => {
    elapsed += tick;
    const pct = Math.min((elapsed / total) * 100, 100);

    if (DOM.loadingBarFill) DOM.loadingBarFill.style.width = pct + "%";

    const idx = Math.min(Math.floor((elapsed / total) * msgCount), msgCount - 1);
    if (idx !== STATE.messageIndex && DOM.loadingMessage) {
      STATE.messageIndex = idx;
      DOM.loadingMessage.style.opacity = "0";
      setTimeout(() => {
        if (DOM.loadingMessage) {
          DOM.loadingMessage.textContent = CONFIG.LOADING_MESSAGES[idx];
          DOM.loadingMessage.style.opacity = "1";
          DOM.loadingMessage.style.transition = "opacity 0.3s";
        }
      }, 250);
    }

    if (elapsed >= total) {
      clearInterval(STATE.loadingInterval);
      STATE.loadingInterval = null;
    }
  }, tick);
}

function hideLoading() {
  if (STATE.loadingInterval) {
    clearInterval(STATE.loadingInterval);
    STATE.loadingInterval = null;
  }
  STATE.isLoading = false;
}

// ============================================================
// PUBLIC NAVIGATION FUNCTIONS  (called by inline onclick in HTML)
// ============================================================

function startAnalysis() {
  showSection("form");
  showStep(1);
}

function nextStep() {
  // Last step → trigger analysis
  if (STATE.currentStep === CONFIG.TOTAL_STEPS) {
    runAnalysis();
    return;
  }

  const valid = VALIDATION.validateStep(STATE.currentStep - 1);
  if (!valid) return;

  autoSave();
  showStep(STATE.currentStep + 1);
}

function previousStep() {
  if (STATE.currentStep > 1) {
    showStep(STATE.currentStep - 1);
  }
}

// ============================================================
// ANALYSIS RUNNER
// ============================================================

async function runAnalysis() {
  const valid = VALIDATION.validateStep(STATE.currentStep - 1);
  if (!valid) return;

  autoSave();
  const data = collectFormData();
  STATE.formData = data;

  showLoading();

  try {
    const [analysis] = await Promise.all([
      analyzeBusiness(data),
      new Promise((resolve) => setTimeout(resolve, CONFIG.LOADING_DURATION)),
    ]);
    STATE.analysisResult = analysis;
    hideLoading();
    showResults(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    hideLoading();
    const fallback = generateDefaultAnalysis(data);
    STATE.analysisResult = fallback;
    showResults(fallback);
  }
}

// ============================================================
// RESULTS
// ============================================================

function showResults(analysis) {
  showSection("results");
  renderReport(analysis);
}

function getScoreDescription(score) {
  if (score >= CONFIG.SCORE_DESCRIPTIONS.excellent.min)        return CONFIG.SCORE_DESCRIPTIONS.excellent;
  if (score >= CONFIG.SCORE_DESCRIPTIONS.veryGood.min)         return CONFIG.SCORE_DESCRIPTIONS.veryGood;
  if (score >= CONFIG.SCORE_DESCRIPTIONS.good.min)             return CONFIG.SCORE_DESCRIPTIONS.good;
  return CONFIG.SCORE_DESCRIPTIONS.needsImprovement;
}

function animateScore(target, valueEl, circleEl) {
  const RADIUS = 90; // matches r="90" in HTML SVG
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 565.49

  if (circleEl) {
    circleEl.style.strokeDasharray  = CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = CIRCUMFERENCE;
  }

  let current = 0;
  const increment = target / 60;

  const tick = setInterval(() => {
    current = Math.min(current + increment, target);
    if (valueEl) valueEl.textContent = current.toFixed(1);
    if (circleEl) {
      const offset = CIRCUMFERENCE - (current / 10) * CIRCUMFERENCE;
      circleEl.style.strokeDashoffset = offset;
    }
    if (current >= target) {
      clearInterval(tick);
      if (valueEl) valueEl.textContent = target.toFixed(1);
    }
  }, 16);
}

function renderReport(analysis) {
  if (!analysis || !analysis.sections) return;

  const { score, sections } = analysis;
  const desc = getScoreDescription(score);

  // Animate score ring
  if (DOM.scoreCircle) {
    DOM.scoreCircle.style.stroke = desc.color;
  }
  setTimeout(() => animateScore(score, DOM.scoreValue, DOM.scoreCircle), 400);

  // Score label below value
  const labelEl = document.getElementById("scoreLabel");
  if (labelEl) {
    labelEl.textContent = desc.label;
    labelEl.style.color = desc.color;
  }

  // Inject report HTML
  const html = `
    <div class="score-label-text" style="text-align:center;margin-bottom:24px;font-size:1.1rem;font-weight:600;color:${desc.color};">
      ${desc.label}
    </div>
    <div class="report-accordions">
      ${buildAccordion("📋 الملخص التنفيذي",      renderSummary(sections.summary),              "acc-summary",      true)}
      ${buildAccordion("💪 نقاط القوة",            renderList(sections.strengths,   "strength"),  "acc-strengths")}
      ${buildAccordion("⚠️ نقاط الضعف",           renderList(sections.weaknesses,  "weakness"),  "acc-weaknesses")}
      ${buildAccordion("🚀 فرص النمو",             renderList(sections.opportunities,"opportunity"),"acc-opportunities")}
      ${buildAccordion("🛠️ الخدمات الموصى بها",  renderList(sections.services,    "service"),   "acc-services")}
      ${buildAccordion("✅ أول 3 خطوات",           renderSteps(sections.nextSteps),              "acc-steps")}
      ${buildAccordion("⭐ توصية عروج",            renderRecommendation(sections.recommendation),"acc-recommendation",true)}
    </div>
  `;

  if (DOM.reportContent) DOM.reportContent.innerHTML = html;
}

// ============================================================
// REPORT RENDERERS
// ============================================================

function renderSummary(text) {
  return `<p style="line-height:1.8;color:var(--text-secondary,#ccc);margin:0;">${text}</p>`;
}

function renderList(items, type) {
  if (!items || !items.length) return "<p>لا توجد بيانات</p>";
  const icons = { strength: "✅", weakness: "⚠️", opportunity: "🚀", service: "🛠️" };
  const icon = icons[type] || "◆";
  return `<ul style="list-style:none;padding:0;margin:0;">
    ${items.map((item) => `
      <li style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.1);line-height:1.7;color:var(--text-secondary,#ccc);">
        <span style="flex-shrink:0;font-size:1rem;">${icon}</span>
        <span>${item}</span>
      </li>`).join("")}
  </ul>`;
}

function renderSteps(steps) {
  if (!steps || !steps.length) return "<p>لا توجد خطوات</p>";
  return `<ol style="list-style:none;padding:0;margin:0;counter-reset:step;">
    ${steps.slice(0, 3).map((step, i) => `
      <li style="display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid rgba(201,168,76,0.1);">
        <span style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:#C9A84C;color:#0D2B2B;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">${i + 1}</span>
        <span style="color:var(--text-secondary,#ccc);line-height:1.7;">${step}</span>
      </li>`).join("")}
  </ol>`;
}

function renderRecommendation(text) {
  return `
    <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:1.6rem;font-weight:800;color:#C9A84C;margin-bottom:12px;letter-spacing:2px;">عـروج</div>
      <p style="color:var(--text-secondary,#ccc);line-height:1.8;margin:0 0 20px;">${text}</p>
      <a href="https://wa.me/201284324217" target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;font-size:0.95rem;">
        💬 تواصل معنا على واتساب
      </a>
    </div>`;
}

// ============================================================
// ACCORDION
// ============================================================

function buildAccordion(title, content, id, openByDefault = false) {
  return `
    <div class="accordion-item ${openByDefault ? "open" : ""}" id="${id}"
         style="margin-bottom:12px;border:1px solid rgba(201,168,76,0.2);border-radius:12px;overflow:hidden;background:rgba(255,255,255,0.03);">
      <button class="accordion-header" onclick="toggleAccordion('${id}')"
              style="width:100%;display:flex;justify-content:space-between;align-items:center;
                     padding:16px 20px;background:transparent;border:none;cursor:pointer;
                     color:var(--text-primary,#fff);font-size:1rem;font-weight:600;
                     font-family:inherit;text-align:right;direction:rtl;">
        <span>${title}</span>
        <span class="accordion-icon" style="font-size:0.8rem;color:#C9A84C;transition:transform 0.2s;">
          ${openByDefault ? "▲" : "▼"}
        </span>
      </button>
      <div class="accordion-body" style="display:${openByDefault ? "block" : "none"};padding:0 20px 20px;">
        ${content}
      </div>
    </div>`;
}

function toggleAccordion(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const body = item.querySelector(".accordion-body");
  const icon = item.querySelector(".accordion-icon");
  const isOpen = item.classList.contains("open");

  if (isOpen) {
    item.classList.remove("open");
    if (body) body.style.display = "none";
    if (icon) icon.textContent = "▼";
  } else {
    item.classList.add("open");
    if (body) body.style.display = "block";
    if (icon) icon.textContent = "▲";
  }
}

// ============================================================
// PDF / PRINT
// ============================================================

function downloadPDF() {
  window.print();
}

// ============================================================
// RESTART
// ============================================================

function restartApp() {
  STORAGE.clear();
  STATE.currentStep = 1;
  STATE.formData = {};
  STATE.analysisResult = null;

  if (DOM.form) DOM.form.reset();
  if (DOM.socialLinkField) DOM.socialLinkField.style.display = "none";

  showSection("hero");
}

// ============================================================
// AI  — Nara Router API + fallback
// ============================================================

async function analyzeBusiness(data) {
  const prompt = `
قم بتحليل المشروع التالي وأعطني تقريراً احترافياً باللغة العربية:

الاسم: ${data.fullName || ""}
اسم المشروع: ${data.businessName || ""}
نوع المشروع: ${CONFIG.BUSINESS_TYPES[data.businessType] || data.businessType || ""}
عمر المشروع: ${CONFIG.BUSINESS_AGES[data.businessAge] || data.businessAge || ""}
الهدف الرئيسي: ${CONFIG.GOALS[data.goal] || data.goal || ""}
الميزانية الشهرية: ${CONFIG.BUDGETS[data.budget] || data.budget || ""}
التحديات: ${(Array.isArray(data.challenges) ? data.challenges : []).map((c) => CONFIG.CHALLENGES[c] || c).join("، ")}
التواجد على السوشيال: ${data.hasSocial === "yes" ? "نعم — " + (data.socialLink || "بدون رابط") : "لا"}
المشكلة الأكثر إلحاحاً: ${data.mainProblem || ""}

أريد ردك منظماً بالضبط على الشكل التالي (استخدم هذه العناوين حرفياً):

[ملخص]
اكتب هنا ملخصاً تنفيذياً في فقرة واحدة.

[نقاط القوة]
- نقطة 1
- نقطة 2
- نقطة 3

[نقاط الضعف]
- نقطة 1
- نقطة 2
- نقطة 3

[فرص النمو]
- فرصة 1
- فرصة 2
- فرصة 3

[الخدمات الموصى بها]
- خدمة 1
- خدمة 2
- خدمة 3

[أول 3 خطوات]
- خطوة 1
- خطوة 2
- خطوة 3

[التوصية النهائية]
اكتب هنا توصيتك النهائية في فقرة واحدة.

أجب باللغة العربية فقط ولا تضف أي نص خارج هذا الهيكل.
`;

  try {
    const response = await fetch("https://router.bynara.id/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-nry-V9H1WAFFgp8UautBZnQmlSQ8DInPevXCquhtPObGUZI",
      },
      body: JSON.stringify({
        model: "mimo-v2.5-free",
        messages: [
          {
            role: "system",
            content: "أنت مستشار أعمال وتسويق محترف متخصص في السوق المصري والعربي.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log(response.status);

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
    }

    const aiText = result?.choices?.[0]?.message?.content || "";

    if (!aiText.trim()) {
      throw new Error("API returned empty content");
    }

    return parseAIResponse(aiText, data);

  } catch (err) {
    console.error("analyzeBusiness — API Error:", err);
    return generateDefaultAnalysis(data);
  }
}

function parseAIResponse(text, data) {
  function extractSection(tag) {
    const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\[|$)`);
    const match = text.match(regex);
    if (!match) return null;
    return match[1].trim();
  }

  function extractList(tag) {
    const block = extractSection(tag);
    if (!block) return [];
    return block
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter((line) => line.length > 0);
  }

  const summary    = extractSection("ملخص")              || text.substring(0, 300);
  const strengths  = extractList("نقاط القوة");
  const weaknesses = extractList("نقاط الضعف");
  const opps       = extractList("فرص النمو");
  const services   = extractList("الخدمات الموصى بها");
  const steps      = extractList("أول 3 خطوات");
  const recommend  = extractSection("التوصية النهائية") || "";

  // Score based on richness of AI response
  const score = Math.min(
    7 + Math.floor((strengths.length + opps.length) / 3),
    10
  );

  return {
    score,
    sections: {
      summary,
      strengths:     strengths.length  ? strengths  : ["مشروعك يمتلك إمكانات جيدة للنمو"],
      weaknesses:    weaknesses.length ? weaknesses : ["يحتاج إلى تطوير الاستراتيجية التسويقية"],
      opportunities: opps.length       ? opps       : ["فرص نمو متاحة في السوق المحلي"],
      services:      services.length   ? services   : ["استراتيجية تسويق متكاملة"],
      nextSteps:     steps.length      ? steps      : ["التواصل مع فريق عروج للبدء"],
      recommendation: recommend || "عروج جاهزة لمساعدتك في تطوير مشروعك وتحقيق أهدافك.",
    },
  };
}

// ============================================================
// DEFAULT ANALYSIS  (pure JS, no API needed)
// ============================================================

function generateDefaultAnalysis(data) {
  const businessType  = data.businessType  || "other";
  const goal          = data.goal          || "";
  const challenges    = Array.isArray(data.challenges) ? data.challenges : [];
  const hasSocial     = data.hasSocial === "yes";
  const businessAge   = data.businessAge   || "new";
  const budget        = data.budget        || "less-3k";

  // Score calculation
  let score = 5;
  if (hasSocial)                                  score += 1;
  if (businessAge === "3plus-years")              score += 1;
  if (businessAge === "1-3-years")                score += 0.5;
  if (budget === "30k-plus")                      score += 1;
  if (budget === "10k-30k")                       score += 0.5;
  if (challenges.length > 0 && challenges.length <= 3) score += 0.5;
  if (data.mainProblem && data.mainProblem.length > 30) score += 0.5;
  score = Math.min(Math.round(score * 10) / 10, 10);

  const typeLabel   = CONFIG.BUSINESS_TYPES[businessType] || "مشروع تجاري";
  const goalLabel   = CONFIG.GOALS[goal]  || "تطوير الأعمال";
  const budgetLabel = CONFIG.BUDGETS[budget] || "";

  // --- Strengths ---
  const strengths = [];
  if (hasSocial)                    strengths.push("تواجد مسبق على منصات التواصل الاجتماعي يمكن البناء عليه وتطويره");
  if (businessAge === "3plus-years") strengths.push("خبرة سوقية متراكمة تمنحك ميزة تنافسية واضحة على المنافسين الجدد");
  if (budget === "30k-plus" || budget === "10k-30k") strengths.push("ميزانية تسويقية كافية تتيح تنفيذ حملات متكاملة وقياس النتائج بدقة");
  if (data.mainProblem)             strengths.push("وضوح رؤية صاحب المشروع ومعرفته الدقيقة للمشكلة الأساسية — وهذا نصف الحل");
  if (strengths.length === 0)       strengths.push("امتلاك رغبة حقيقية في التطوير والتحسين هو المحرك الأساسي لأي نجاح");
  if (strengths.length < 3)         strengths.push(`قطاع ${typeLabel} يتيح نماذج أعمال متعددة وفرصاً للتمييز عن المنافسين`);

  // --- Weaknesses ---
  const weaknesses = [];
  if (challenges.includes("no-identity"))     weaknesses.push("غياب هوية بصرية واضحة يضعف الانطباع الأول لدى العملاء ويقلل الثقة بالعلامة التجارية");
  if (challenges.includes("weak-engagement")) weaknesses.push("انخفاض التفاعل على السوشيال ميديا يشير إلى ضعف في استراتيجية المحتوى أو توقيت النشر");
  if (challenges.includes("ads-not-working")) weaknesses.push("ضعف نتائج الإعلانات يدل على إشكالية في الاستهداف أو الرسالة التسويقية أو الصفحة الهدف");
  if (!hasSocial)                             weaknesses.push("غياب التواجد الرقمي يجعل مشروعك غير مرئي لشريحة كبيرة ومتنامية من العملاء المحتملين");
  if (budget === "less-3k")                   weaknesses.push("محدودية الميزانية تستوجب التركيز على القنوات ذات العائد الأعلى وتجنب التشتت");
  if (weaknesses.length === 0)               weaknesses.push("الاعتماد على التسويق الشفهي فقط دون حضور رقمي منظم يحد من إمكانيات النمو");
  if (weaknesses.length < 3)                 weaknesses.push("عدم قياس نتائج الجهود التسويقية يجعل من الصعب تحسين الأداء واتخاذ قرارات مدروسة");

  // --- Opportunities ---
  const opps = [];
  opps.push(`قطاع ${typeLabel} في نمو مستمر والطلب المحلي عليه يتصاعد — وهذا يفتح أمامك فرصاً حقيقية للتوسع`);
  opps.push("المحتوى العربي الأصيل يملأ فراغاً كبيراً في السوق المحلي ويحقق تفاعلاً عضوياً أعلى بكثير من المحتوى المترجم");
  if (goal === "increase-sales" || goal === "increase-customers") opps.push("الإعلانات الممولة المستهدفة على Meta تحقق عائداً ممتازاً عند إعدادها بشكل صحيح مع تتبع دقيق للنتائج");
  opps.push("بناء قاعدة عملاء مخلصين عبر برامج الولاء والتواصل المستمر يخفض تكلفة الاستحواذ على عملاء جدد بشكل كبير");
  if (opps.length < 3) opps.push("التعاون مع المؤثرين المحليين الصغار (Micro-Influencers) يوفر وصولاً مستهدفاً بتكلفة معقولة جداً");

  // --- Services ---
  const services = [];
  if (challenges.includes("no-identity"))             services.push("تصميم هوية بصرية متكاملة: شعار، ألوان، خطوط، ودليل العلامة التجارية");
  if (goal === "increase-sales" || goal === "improve-ads") services.push("إدارة حملات إعلانية ممولة (Meta Ads & Google Ads) مع تقارير أداء شهرية");
  if (!hasSocial || challenges.includes("weak-engagement")) services.push("إدارة منصات التواصل الاجتماعي مع خطة محتوى شهرية وجدول نشر منتظم");
  if (challenges.includes("weak-content"))            services.push("إنتاج محتوى إبداعي: تصوير، فيديو ريلز، وتصميم بصري يعكس هوية علامتك");
  services.push("استراتيجية تسويق رقمي شاملة مخصصة لقطاعك وأهدافك مع خارطة طريق واضحة");
  services.push("تقارير أداء شهرية مع تحليل مفصل وتوصيات مستمرة لتحسين النتائج");

  // --- Next Steps ---
  const nextSteps = [
    "احجز جلسة استشارية مجانية مع فريق عروج لمناقشة خطتك التسويقية وتحديد أولوياتك",
    `أجرِ تدقيقاً شاملاً لوضعك الحالي على السوشيال ميديا وحدد الثغرات التي تحتاج معالجة فورية`,
    `ضع ميزانية تسويقية موثقة بأهداف قابلة للقياس لأول 3 أشهر (${budgetLabel}) وحدد المؤشرات التي ستتابعها`,
  ];

  return {
    score,
    sections: {
      summary: `مشروعك في قطاع ${typeLabel} يمتلك إمكانات حقيقية للنمو. هدفك الأساسي هو "${goalLabel}"، ويُقيَّم مشروعك بـ ${score}/10. التحدي الرئيسي — ${challenges.length ? CONFIG.CHALLENGES[challenges[0]] || "التطوير العام" : "تعزيز الحضور الرقمي"} — قابل للحل تماماً بمنهجية صحيحة. التقرير أدناه يوضح لك بالتفصيل نقاط قوتك وفرصك وخطوات البداية الموصى بها.`,
      strengths,
      weaknesses,
      opportunities: opps,
      services,
      nextSteps,
      recommendation: `بناءً على التحليل الشامل لمشروعك في قطاع ${typeLabel} وهدفك المتمثل في "${goalLabel}"، توصي عروج بالبدء فوراً بـ${services[0]}. مشروعك أقوى مما تظن، وعروج جاهزة لتكون شريكك الاستراتيجي في هذه الرحلة.`,
    },
  };
}

// ============================================================
// AUTO-SAVE LISTENERS
// ============================================================

function setupAutoSave() {
  document.addEventListener("input",  () => autoSave());
  document.addEventListener("change", (e) => {
    autoSave();
    // Toggle social link field
    if (e.target.name === "hasSocial") {
      toggleSocialLink(e.target.value);
    }
  });
}

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

function setupKeyboard() {
  document.addEventListener("keydown", (e) => {
    const formVisible = DOM.formSection && DOM.formSection.style.display !== "none";
    if (!formVisible) return;
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      nextStep();
    }
  });
}

// ============================================================
// INIT
// ============================================================

function init() {
  DOM.init();

  // Particles
  PARTICLES_SYS.init(DOM.particleContainer);

  // Auto-save & keyboard
  setupAutoSave();
  setupKeyboard();

  // Restore saved session
  const saved = STORAGE.load();
  if (saved && Object.keys(saved).length > 0) {
    setTimeout(() => STORAGE.restore(saved), 150);
  }

  // Initial state: show hero, hide everything else
  showSection("hero");

  // Expose globals required by inline onclick handlers in HTML
  window.startAnalysis   = startAnalysis;
  window.nextStep        = nextStep;
  window.previousStep    = previousStep;
  window.showLoading     = showLoading;
  window.hideLoading     = hideLoading;
  window.showResults     = showResults;
  window.renderReport    = renderReport;
  window.toggleAccordion = toggleAccordion;
  window.downloadPDF     = downloadPDF;
  window.restartApp      = restartApp;

  console.log(
    "%cعروج AI ✓ — جاهز للتحليل",
    "color:#C9A84C;font-weight:bold;font-size:15px;"
  );
}

// ============================================================
// BOOTSTRAP
// ============================================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
