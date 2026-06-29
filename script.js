/**
 * ============================================================
 * عروج AI - نظام تحليل المشاريع
 * Version: 2.1.0 | Production Ready
 * Author: عروج Agency
 * ============================================================
 *
 * HTML ID MAP:
 *   hero-Section        → Hero section
 *   formSection         → Form section
 *   loadingScreen       → Loading screen
 *   resultsSection      → Results section
 *   analysisForm        → The <form>
 *   progressBar         → Progress fill bar
 *   prevBtn             → Previous button
 *   nextBtn             → Next button
 *   nextBtnText         → <span> inside nextBtn
 *   loadingMessage      → Loading status text
 *   scoreCircle         → SVG circle (r=90)
 *   scoreValue          → Numeric score display
 *   reportContent       → Report injection target
 *   socialLinkField     → Conditional social link group
 * ============================================================
 */

// ============================================================
// CONFIG
// ============================================================

var CONFIG = {
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
    "جارٍ إعداد التقرير النهائي..."
  ],
  STORAGE_KEY: "orooj_form_data",
  PARTICLE_COUNT: 50,
  SCORE_DESCRIPTIONS: {
    excellent:        { min: 8, label: "ممتاز",        color: "#4CAF50" },
    veryGood:         { min: 6, label: "جيد جداً",     color: "#8BC34A" },
    good:             { min: 4, label: "جيد",           color: "#FFC107" },
    needsImprovement: { min: 0, label: "يحتاج تحسين",  color: "#F44336" }
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
    other:      "أخرى"
  },
  GOALS: {
    "increase-sales":          "زيادة المبيعات",
    "build-brand":             "بناء براند قوي",
    "increase-customers":      "زيادة عدد العملاء",
    "improve-online-presence": "تحسين الظهور على الإنترنت",
    "launch-project":          "إطلاق مشروع جديد",
    "improve-ads":             "تحسين الإعلانات"
  },
  CHALLENGES: {
    "weak-sales":      "ضعف المبيعات",
    "weak-engagement": "ضعف التفاعل على السوشيال ميديا",
    "no-identity":     "عدم وجود هوية بصرية واضحة",
    "weak-content":    "ضعف المحتوى",
    "few-customers":   "قلة العملاء",
    "ads-not-working": "الإعلانات لا تحقق نتائج",
    "launch":          "إطلاق المشروع بشكل احترافي",
    "other":           "أخرى"
  },
  BUDGETS: {
    "less-3k":  "أقل من 3000 جنيه",
    "3k-10k":   "3000 - 10000 جنيه",
    "10k-30k":  "10000 - 30000 جنيه",
    "30k-plus": "أكثر من 30000 جنيه"
  },
  BUSINESS_AGES: {
    "new":         "مشروع جديد",
    "less-year":   "أقل من سنة",
    "1-3-years":   "من سنة إلى 3 سنوات",
    "3plus-years": "أكثر من 3 سنوات"
  }
};

// ============================================================
// STATE
// ============================================================

var STATE = {
  currentStep: 1,
  formData: {},
  analysisResult: null,
  isLoading: false,
  loadingTimer: null,
  loadingInterval: null,
  messageIndex: 0,
  animationFrame: null
};

// ============================================================
// DOM
// ============================================================

var DOM = {
  heroSection: null,
  formSection: null,
  loadingScreen: null,
  resultsSection: null,
  form: null,
  steps: [],
  progressBar: null,
  progressPct: null,
  currentStepEl: null,
  prevBtn: null,
  nextBtn: null,
  nextBtnText: null,
  loadingMessage: null,
  loadingBarFill: null,
  scoreCircle: null,
  scoreValue: null,
  reportContent: null,
  socialLinkField: null,
  particleContainer: null,

  init: function() {
    this.heroSection      = document.getElementById("hero-Section");
    this.formSection      = document.getElementById("formSection");
    this.loadingScreen    = document.getElementById("loadingScreen");
    this.resultsSection   = document.getElementById("resultsSection");
    this.form             = document.getElementById("analysisForm");
    this.steps            = Array.from(document.querySelectorAll(".form-step"));
    this.progressBar      = document.getElementById("progressBar");
    this.progressPct      = document.querySelector(".progress-percentage");
    this.currentStepEl    = document.querySelector(".current-step");
    this.prevBtn          = document.getElementById("prevBtn");
    this.nextBtn          = document.getElementById("nextBtn");
    this.nextBtnText      = document.getElementById("nextBtnText");
    this.loadingMessage   = document.getElementById("loadingMessage");
    this.loadingBarFill   = document.querySelector(".loading-progress-bar");
    this.scoreCircle      = document.getElementById("scoreCircle");
    this.scoreValue       = document.getElementById("scoreValue");
    this.reportContent    = document.getElementById("reportContent");
    this.socialLinkField  = document.getElementById("socialLinkField");
    this.particleContainer = document.getElementById("particles");

    console.log("DOM initialized successfully");
    console.log("heroSection:", !!this.heroSection);
    console.log("formSection:", !!this.formSection);
    console.log("steps count:", this.steps.length);
  }
};

// ============================================================
// VALIDATION
// ============================================================

var VALIDATION = {
  stepConfigs: [
    { fullName: { required: true, minLength: 2 }, whatsapp: { required: true, egyptPhone: true } },
    { businessName: { required: true, minLength: 2 }, businessType: { required: true } },
    { businessAge: { required: true } },
    { challenges: { required: true } },
    { goal: { required: true } },
    { hasSocial: { required: true } },
    { budget: { required: true } },
    { mainProblem: { required: true, minLength: 10 } }
  ],

  rules: {
    required: function(value) {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && String(value).trim() !== "";
    },
    egyptPhone: function(value) {
      return /^01[0125][0-9]{8}$/.test(String(value).trim());
    },
    url: function(value) {
      if (!value || String(value).trim() === "") return true;
      try { new URL(value); return true; } catch (e) { /* continue */ }
      return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\u0600-\u06FF-]+(\.[a-zA-Z]{2,})+/.test(value);
    },
    minLength: function(value, min) {
      return String(value).trim().length >= min;
    }
  },

  messages: {
    required:   "هذا الحقل مطلوب",
    egyptPhone: "يرجى إدخال رقم هاتف مصري صحيح (01xxxxxxxxx)",
    url:        "يرجى إدخال رابط صحيح",
    minLength:  function(min) { return "يجب أن يحتوي على " + min + " أحرف على الأقل"; }
  },

  getFieldValue: function(stepEl, name) {
    var radio = stepEl.querySelector('input[type="radio"][name="' + name + '"]:checked');
    if (radio) return radio.value;

    var checkboxes = stepEl.querySelectorAll('input[type="checkbox"][name="' + name + '"]');
    if (checkboxes.length) {
      var checked = [];
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) checked.push(checkboxes[i].value);
      }
      return checked;
    }

    var select = stepEl.querySelector('select[name="' + name + '"]');
    if (select) return select.value;

    var el = stepEl.querySelector('[name="' + name + '"]');
    return el ? el.value : null;
  },

  showError: function(stepEl, name, message) {
    var field = stepEl.querySelector('[name="' + name + '"]');
    var errorEl = null;

    if (field) {
      var parent = field.closest(".form-group") || field.parentElement;
      errorEl = parent ? parent.querySelector(".input-error") : null;
      field.classList.add("is-invalid");
    }

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

  clearErrors: function(stepEl) {
    var errors = stepEl.querySelectorAll(".input-error");
    for (var i = 0; i < errors.length; i++) {
      errors[i].textContent = "";
      errors[i].style.display = "none";
    }
    var invalids = stepEl.querySelectorAll(".is-invalid");
    for (var j = 0; j < invalids.length; j++) {
      invalids[j].classList.remove("is-invalid");
    }
  },

  validateStep: function(stepIndex) {
    var config = this.stepConfigs[stepIndex] || {};
    var stepEl = DOM.steps[stepIndex];
    if (!stepEl) return true;

    this.clearErrors(stepEl);
    var valid = true;

    var keys = Object.keys(config);
    for (var k = 0; k < keys.length; k++) {
      var name = keys[k];
      var rules = config[name];
      var value = this.getFieldValue(stepEl, name);

      if (rules.required && !this.rules.required(value)) {
        this.showError(stepEl, name, this.messages.required);
        valid = false;
        continue;
      }

      var strVal = Array.isArray(value) ? value.join(",") : String(value || "");

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
      var hasSocial = this.getFieldValue(stepEl, "hasSocial");
      if (hasSocial === "yes") {
        var linkVal = this.getFieldValue(stepEl, "socialLink");
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
  }
};

// ============================================================
// STORAGE
// ============================================================

var STORAGE = {
  save: function(data) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.warn("AutoSave failed:", e); }
  },
  load: function() {
    try {
      var s = localStorage.getItem(CONFIG.STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  },
  clear: function() {
    try { localStorage.removeItem(CONFIG.STORAGE_KEY); }
    catch (e) { /* silent */ }
  },
  restore: function(data) {
    if (!data) return;
    var entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i][0];
      var value = entries[i][1];
      var els = document.querySelectorAll('[name="' + name + '"]');
      if (!els.length) continue;
      var type = els[0].type;

      if (type === "radio") {
        for (var r = 0; r < els.length; r++) {
          els[r].checked = els[r].value === value;
        }
      } else if (type === "checkbox") {
        var vals = Array.isArray(value) ? value : [value];
        for (var c = 0; c < els.length; c++) {
          els[c].checked = vals.indexOf(els[c].value) !== -1;
        }
      } else if (els[0].tagName === "SELECT") {
        els[0].value = value;
      } else {
        els[0].value = value;
      }
    }
    var social = document.querySelector('input[name="hasSocial"]:checked');
    if (social) toggleSocialLink(social.value);
  }
};

// ============================================================
// PARTICLES
// ============================================================

var PARTICLES_SYS = {
  container: null,
  items: [],
  running: false,

  init: function(container) {
    this.container = container;
    if (!container) return;

    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "0";
    container.style.overflow = "hidden";

    this.create();
    this.running = true;
    this.tick();
  },

  create: function() {
    this.items = [];
    var W = window.innerWidth;
    var H = window.innerHeight;

    for (var i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      var el = document.createElement("div");
      var size = Math.random() * 4 + 1;
      var isGold = Math.random() > 0.55;

      el.style.position = "absolute";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.borderRadius = "50%";
      el.style.background = isGold ? "#C9A84C" : "#0D7377";
      el.style.opacity = String(Math.random() * 0.45 + 0.08);
      el.style.willChange = "transform";
      el.style.transition = "none";

      var p = {
        el: el,
        x: Math.random() * W,
        y: Math.random() * H,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      };

      el.style.transform = "translate(" + p.x + "px," + p.y + "px)";
      this.container.appendChild(el);
      this.items.push(p);
    }
  },

  tick: function() {
    if (!this.running) return;
    var self = this;
    var W = window.innerWidth;
    var H = window.innerHeight;

    for (var i = 0; i < this.items.length; i++) {
      var p = this.items[i];
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      p.el.style.transform = "translate(" + p.x + "px," + p.y + "px)";
    }

    STATE.animationFrame = requestAnimationFrame(function() { self.tick(); });
  }
};

// ============================================================
// FORM HELPERS
// ============================================================

function collectFormData() {
  var data = {};
  for (var s = 0; s < DOM.steps.length; s++) {
    var step = DOM.steps[s];

    var radios = step.querySelectorAll("input[type='radio']:checked");
    for (var r = 0; r < radios.length; r++) {
      data[radios[r].name] = radios[r].value;
    }

    var cbMap = {};
    var checkboxes = step.querySelectorAll("input[type='checkbox']");
    for (var c = 0; c < checkboxes.length; c++) {
      if (!cbMap[checkboxes[c].name]) cbMap[checkboxes[c].name] = [];
      if (checkboxes[c].checked) cbMap[checkboxes[c].name].push(checkboxes[c].value);
    }
    var cbKeys = Object.keys(cbMap);
    for (var ck = 0; ck < cbKeys.length; ck++) {
      data[cbKeys[ck]] = cbMap[cbKeys[ck]];
    }

    var selects = step.querySelectorAll("select");
    for (var sel = 0; sel < selects.length; sel++) {
      if (selects[sel].name) data[selects[sel].name] = selects[sel].value;
    }

    var inputs = step.querySelectorAll("input[type='text'],input[type='tel'],input[type='email'],input[type='url'],textarea");
    for (var inp = 0; inp < inputs.length; inp++) {
      if (inputs[inp].name) data[inputs[inp].name] = inputs[inp].value;
    }
  }
  return data;
}

function autoSave() {
  var data = collectFormData();
  STATE.formData = data;
  STORAGE.save(data);
}

// ============================================================
// PROGRESS BAR
// ============================================================

function updateProgress(step) {
  var pct = Math.round(((step - 1) / (CONFIG.TOTAL_STEPS - 1)) * 100);

  if (DOM.progressBar) DOM.progressBar.style.width = pct + "%";
  if (DOM.progressPct) DOM.progressPct.textContent = pct + "%";
  if (DOM.currentStepEl) DOM.currentStepEl.textContent = step;
}

// ============================================================
// STEP DISPLAY
// ============================================================

function showStep(stepNumber) {
  console.log("showStep called:", stepNumber);

  for (var i = 0; i < DOM.steps.length; i++) {
    var el = DOM.steps[i];
    var isActive = parseInt(el.getAttribute("data-step")) === stepNumber;
    el.style.display = isActive ? "block" : "none";
    if (isActive) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  }

  if (DOM.prevBtn) {
    DOM.prevBtn.style.display = stepNumber > 1 ? "" : "none";
  }

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
  console.log("showSection called:", name);

  var map = {
    hero:     DOM.heroSection,
    form:     DOM.formSection,
    loading:  DOM.loadingScreen,
    results:  DOM.resultsSection
  };

  var keys = Object.keys(map);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var el = map[key];
    if (!el) continue;

    if (key === name) {
      if (key === "loading") {
        el.style.display = "flex";
      } else {
        el.style.display = "block";
      }
      el.style.opacity = "1";
    } else {
      el.style.display = "none";
    }
  }

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
    var linkInput = document.querySelector('[name="socialLink"]');
    if (linkInput) linkInput.value = "";
  }
}

// ============================================================
// LOADING SCREEN
// ============================================================

function showLoading() {
  console.log("showLoading called");
  showSection("loading");
  STATE.isLoading = true;
  STATE.messageIndex = 0;

  if (DOM.loadingBarFill) {
    DOM.loadingBarFill.style.width = "0%";
    DOM.loadingBarFill.style.animation = "none";
  }
  if (DOM.loadingMessage) DOM.loadingMessage.textContent = CONFIG.LOADING_MESSAGES[0];

  var elapsed = 0;
  var tick = 100;
  var total = CONFIG.LOADING_DURATION;
  var msgCount = CONFIG.LOADING_MESSAGES.length;

  STATE.loadingInterval = setInterval(function() {
    elapsed += tick;
    var pct = Math.min((elapsed / total) * 100, 100);

    if (DOM.loadingBarFill) DOM.loadingBarFill.style.width = pct + "%";

    var idx = Math.min(Math.floor((elapsed / total) * msgCount), msgCount - 1);
    if (idx !== STATE.messageIndex && DOM.loadingMessage) {
      STATE.messageIndex = idx;
      DOM.loadingMessage.style.opacity = "0";
      setTimeout(function() {
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
// PUBLIC NAVIGATION FUNCTIONS
// ============================================================

function startAnalysis() {
  console.log("startAnalysis clicked");
  showSection("form");
  showStep(1);
}

function nextStep() {
  console.log("nextStep clicked, current:", STATE.currentStep);

  if (STATE.currentStep === CONFIG.TOTAL_STEPS) {
    runAnalysis();
    return;
  }

  var valid = VALIDATION.validateStep(STATE.currentStep - 1);
  if (!valid) {
    console.log("Validation failed for step:", STATE.currentStep);
    return;
  }

  autoSave();
  showStep(STATE.currentStep + 1);
}

function previousStep() {
  console.log("previousStep clicked, current:", STATE.currentStep);
  if (STATE.currentStep > 1) {
    showStep(STATE.currentStep - 1);
  }
}

// ============================================================
// ANALYSIS RUNNER
// ============================================================

function runAnalysis() {
  console.log("runAnalysis called");

  var valid = VALIDATION.validateStep(STATE.currentStep - 1);
  if (!valid) {
    console.log("Final step validation failed");
    return;
  }

  autoSave();
  var data = collectFormData();
  STATE.formData = data;

  console.log("Form data collected:", JSON.stringify(data));

  showLoading();

  var analysisPromise = analyzeBusiness(data);
  var delayPromise = new Promise(function(resolve) {
    setTimeout(resolve, CONFIG.LOADING_DURATION);
  });

  Promise.all([analysisPromise, delayPromise]).then(function(results) {
    var analysis = results[0];
    console.log("Analysis complete, score:", analysis.score);
    STATE.analysisResult = analysis;
    hideLoading();
    showResults(analysis);
  }).catch(function(err) {
    console.error("runAnalysis error:", err);
    hideLoading();
    var fallback = generateDefaultAnalysis(data);
    STATE.analysisResult = fallback;
    showResults(fallback);
  });
}

// ============================================================
// RESULTS
// ============================================================

function showResults(analysis) {
  console.log("showResults called");
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
  var RADIUS = 90;
  var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  if (circleEl) {
    circleEl.style.strokeDasharray  = CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = CIRCUMFERENCE;
  }

  var current = 0;
  var increment = target / 60;

  var tick = setInterval(function() {
    current = Math.min(current + increment, target);
    if (valueEl) valueEl.textContent = current.toFixed(1);
    if (circleEl) {
      var offset = CIRCUMFERENCE - (current / 10) * CIRCUMFERENCE;
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

  var score = analysis.score;
  var sections = analysis.sections;
  var desc = getScoreDescription(score);

  if (DOM.scoreCircle) {
    DOM.scoreCircle.style.stroke = desc.color;
  }
  setTimeout(function() { animateScore(score, DOM.scoreValue, DOM.scoreCircle); }, 400);

  var html = '<div class="score-label-text" style="text-align:center;margin-bottom:24px;font-size:1.1rem;font-weight:600;color:' + desc.color + ';">' + desc.label + '</div>' +
    '<div class="report-accordions">' +
    buildAccordion("📋 الملخص التنفيذي",      renderSummary(sections.summary),              "acc-summary",      true) +
    buildAccordion("💪 نقاط القوة",            renderList(sections.strengths,   "strength"),  "acc-strengths",    false) +
    buildAccordion("⚠️ نقاط الضعف",           renderList(sections.weaknesses,  "weakness"),  "acc-weaknesses",   false) +
    buildAccordion("🚀 فرص النمو",             renderList(sections.opportunities,"opportunity"),"acc-opportunities",false) +
    buildAccordion("🛠️ الخدمات الموصى بها",  renderList(sections.services,    "service"),   "acc-services",     false) +
    buildAccordion("✅ أول 3 خطوات",           renderSteps(sections.nextSteps),              "acc-steps",        false) +
    buildAccordion("⭐ توصية عروج",            renderRecommendation(sections.recommendation),"acc-recommendation",true) +
    '</div>';

  if (DOM.reportContent) DOM.reportContent.innerHTML = html;
}

// ============================================================
// REPORT RENDERERS
// ============================================================

function renderSummary(text) {
  return '<p style="line-height:1.8;color:#ccc;margin:0;">' + text + '</p>';
}

function renderList(items, type) {
  if (!items || !items.length) return "<p>لا توجد بيانات</p>";
  var icons = { strength: "✅", weakness: "⚠️", opportunity: "🚀", service: "🛠️" };
  var icon = icons[type] || "◆";
  var html = '<ul style="list-style:none;padding:0;margin:0;">';
  for (var i = 0; i < items.length; i++) {
    html += '<li style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.1);line-height:1.7;color:#ccc;">' +
      '<span style="flex-shrink:0;font-size:1rem;">' + icon + '</span>' +
      '<span>' + items[i] + '</span></li>';
  }
  html += '</ul>';
  return html;
}

function renderSteps(steps) {
  if (!steps || !steps.length) return "<p>لا توجد خطوات</p>";
  var html = '<ol style="list-style:none;padding:0;margin:0;counter-reset:step;">';
  var count = Math.min(steps.length, 3);
  for (var i = 0; i < count; i++) {
    html += '<li style="display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid rgba(201,168,76,0.1);">' +
      '<span style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:#C9A84C;color:#0D2B2B;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">' + (i + 1) + '</span>' +
      '<span style="color:#ccc;line-height:1.7;">' + steps[i] + '</span></li>';
  }
  html += '</ol>';
  return html;
}

function renderRecommendation(text) {
  return '<div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:20px;text-align:center;">' +
    '<div style="font-size:1.6rem;font-weight:800;color:#C9A84C;margin-bottom:12px;letter-spacing:2px;">عـروج</div>' +
    '<p style="color:#ccc;line-height:1.8;margin:0 0 20px;">' + text + '</p>' +
    '<a href="https://wa.me/201284324217" target="_blank" rel="noopener" ' +
    'style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;font-size:0.95rem;">' +
    '💬 تواصل معنا على واتساب</a></div>';
}

// ============================================================
// ACCORDION
// ============================================================

function buildAccordion(title, content, id, openByDefault) {
  var isOpen = !!openByDefault;
  return '<div class="accordion-item ' + (isOpen ? "open" : "") + '" id="' + id + '" ' +
    'style="margin-bottom:12px;border:1px solid rgba(201,168,76,0.2);border-radius:12px;overflow:hidden;background:rgba(255,255,255,0.03);">' +
    '<button class="accordion-header" onclick="toggleAccordion(\'' + id + '\')" ' +
    'style="width:100%;display:flex;justify-content:space-between;align-items:center;' +
    'padding:16px 20px;background:transparent;border:none;cursor:pointer;' +
    'color:#fff;font-size:1rem;font-weight:600;font-family:inherit;text-align:right;direction:rtl;">' +
    '<span>' + title + '</span>' +
    '<span class="accordion-icon" style="font-size:0.8rem;color:#C9A84C;transition:transform 0.2s;">' +
    (isOpen ? "▲" : "▼") + '</span></button>' +
    '<div class="accordion-body" style="display:' + (isOpen ? "block" : "none") + ';padding:0 20px 20px;">' +
    content + '</div></div>';
}

function toggleAccordion(id) {
  var item = document.getElementById(id);
  if (!item) return;
  var body = item.querySelector(".accordion-body");
  var icon = item.querySelector(".accordion-icon");
  var isOpen = item.classList.contains("open");

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
// AI — Nara Router API + fallback
// ============================================================
async function analyzeBusiness(data) {
  var challengesText = "";
  if (Array.isArray(data.challenges)) {
    challengesText = data.challenges.map(function(c) { return CONFIG.CHALLENGES[c] || c; }).join("، ");
  }

  var prompt = "حلل هذا المشروع باحترافية (ملخص، نقاط قوة، نقاط ضعف، فرص، خدمات، 3 خطوات، توصية):\n" +
    "المشروع: " + (data.businessName || "") + "\n" +
    "التخصص: " + (CONFIG.BUSINESS_TYPES[data.businessType] || "") + "\n" +
    "الهدف: " + (CONFIG.GOALS[data.goal] || "") + "\n" +
    "المشكلة: " + (data.mainProblem || "");

  var targetUrl = "https://router.bynara.id/v1/chat/completions";
  var apiUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-nry-V9H1WAFFgp8UautBZnQmlSQ8DInPevXCquhtPObGUZI"
      },
      body: JSON.stringify({
        model: "mistral-medium-3-5", // موديل سريع جداً ومجاني في حسابك
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) throw new Error("HTTP " + response.status);

    const result = await response.json();
    const aiText = result.choices[0].message.content;
    
    return parseAIResponse(aiText, data);

  } catch (err) {
    console.error("[API Debug] Error:", err);
    alert("حدث خطأ: " + err.message);
    return generateDefaultAnalysis(data);
  }
}






function parseAIResponse(text, data) {
  function extractSection(tag) {
    var regex = new RegExp("\\[" + tag + "\\]\\s*([\\s\\S]*?)(?=\\[|$)");
    var match = text.match(regex);
    if (!match) return null;
    return match[1].trim();
  }

  function extractList(tag) {
    var block = extractSection(tag);
    if (!block) return [];
    return block
      .split("\n")
      .map(function(line) { return line.replace(/^[-•*]\s*/, "").trim(); })
      .filter(function(line) { return line.length > 0; });
  }

  var summary    = extractSection("ملخص")              || text.substring(0, 300);
  var strengths  = extractList("نقاط القوة");
  var weaknesses = extractList("نقاط الضعف");
  var opps       = extractList("فرص النمو");
  var services   = extractList("الخدمات الموصى بها");
  var steps      = extractList("أول 3 خطوات");
  var recommend  = extractSection("التوصية النهائية") || "";

  var score = Math.min(
    7 + Math.floor((strengths.length + opps.length) / 3),
    10
  );

  return {
    score: score,
    sections: {
      summary: summary,
      strengths:     strengths.length  ? strengths  : ["مشروعك يمتلك إمكانات جيدة للنمو"],
      weaknesses:    weaknesses.length ? weaknesses : ["يحتاج إلى تطوير الاستراتيجية التسويقية"],
      opportunities: opps.length       ? opps       : ["فرص نمو متاحة في السوق المحلي"],
      services:      services.length   ? services   : ["استراتيجية تسويق متكاملة"],
      nextSteps:     steps.length      ? steps      : ["التواصل مع فريق عروج للبدء"],
      recommendation: recommend || "عروج جاهزة لمساعدتك في تطوير مشروعك وتحقيق أهدافك."
    }
  };
}

// ============================================================
// DEFAULT ANALYSIS (only used as fallback)
// ============================================================

function generateDefaultAnalysis(data) {
  console.log("Using DEFAULT analysis (API fallback)");

  var businessType  = data.businessType  || "other";
  var goal          = data.goal          || "";
  var challenges    = Array.isArray(data.challenges) ? data.challenges : [];
  var hasSocial     = data.hasSocial === "yes";
  var businessAge   = data.businessAge   || "new";
  var budget        = data.budget        || "less-3k";

  var score = 5;
  if (hasSocial)                                        score += 1;
  if (businessAge === "3plus-years")                    score += 1;
  if (businessAge === "1-3-years")                      score += 0.5;
  if (budget === "30k-plus")                            score += 1;
  if (budget === "10k-30k")                             score += 0.5;
  if (challenges.length > 0 && challenges.length <= 3)  score += 0.5;
  if (data.mainProblem && data.mainProblem.length > 30) score += 0.5;
  score = Math.min(Math.round(score * 10) / 10, 10);

  var typeLabel   = CONFIG.BUSINESS_TYPES[businessType] || "مشروع تجاري";
  var goalLabel   = CONFIG.GOALS[goal]  || "تطوير الأعمال";
  var budgetLabel = CONFIG.BUDGETS[budget] || "";

  var strengths = [];
  if (hasSocial)                    strengths.push("تواجد مسبق على منصات التواصل الاجتماعي يمكن البناء عليه وتطويره");
  if (businessAge === "3plus-years") strengths.push("خبرة سوقية متراكمة تمنحك ميزة تنافسية واضحة على المنافسين الجدد");
  if (budget === "30k-plus" || budget === "10k-30k") strengths.push("ميزانية تسويقية كافية تتيح تنفيذ حملات متكاملة وقياس النتائج بدقة");
  if (data.mainProblem)             strengths.push("وضوح رؤية صاحب المشروع ومعرفته الدقيقة للمشكلة الأساسية — وهذا نصف الحل");
  if (strengths.length === 0)       strengths.push("امتلاك رغبة حقيقية في التطوير والتحسين هو المحرك الأساسي لأي نجاح");
  if (strengths.length < 3)         strengths.push("قطاع " + typeLabel + " يتيح نماذج أعمال متعددة وفرصاً للتمييز عن المنافسين");

  var weaknesses = [];
  if (challenges.indexOf("no-identity") !== -1)     weaknesses.push("غياب هوية بصرية واضحة يضعف الانطباع الأول لدى العملاء ويقلل الثقة بالعلامة التجارية");
  if (challenges.indexOf("weak-engagement") !== -1) weaknesses.push("انخفاض التفاعل على السوشيال ميديا يشير إلى ضعف في استراتيجية المحتوى أو توقيت النشر");
  if (challenges.indexOf("ads-not-working") !== -1) weaknesses.push("ضعف نتائج الإعلانات يدل على إشكالية في الاستهداف أو الرسالة التسويقية أو الصفحة الهدف");
  if (!hasSocial)                             weaknesses.push("غياب التواجد الرقمي يجعل مشروعك غير مرئي لشريحة كبيرة ومتنامية من العملاء المحتملين");
  if (budget === "less-3k")                   weaknesses.push("محدودية الميزانية تستوجب التركيز على القنوات ذات العائد الأعلى وتجنب التشتت");
  if (weaknesses.length === 0)               weaknesses.push("الاعتماد على التسويق الشفهي فقط دون حضور رقمي منظم يحد من إمكانيات النمو");
  if (weaknesses.length < 3)                 weaknesses.push("عدم قياس نتائج الجهود التسويقية يجعل من الصعب تحسين الأداء واتخاذ قرارات مدروسة");

  var opps = [];
  opps.push("قطاع " + typeLabel + " في نمو مستمر والطلب المحلي عليه يتصاعد — وهذا يفتح أمامك فرصاً حقيقية للتوسع");
  opps.push("المحتوى العربي الأصيل يملأ فراغاً كبيراً في السوق المحلي ويحقق تفاعلاً عضوياً أعلى بكثير من المحتوى المترجم");
  if (goal === "increase-sales" || goal === "increase-customers") opps.push("الإعلانات الممولة المستهدفة على Meta تحقق عائداً ممتازاً عند إعدادها بشكل صحيح مع تتبع دقيق للنتائج");
  opps.push("بناء قاعدة عملاء مخلصين عبر برامج الولاء والتواصل المستمر يخفض تكلفة الاستحواذ على عملاء جدد بشكل كبير");
  if (opps.length < 3) opps.push("التعاون مع المؤثرين المحليين الصغار (Micro-Influencers) يوفر وصولاً مستهدفاً بتكلفة معقولة جداً");

  var services = [];
  if (challenges.indexOf("no-identity") !== -1)              services.push("تصميم هوية بصرية متكاملة: شعار، ألوان، خطوط، ودليل العلامة التجارية");
  if (goal === "increase-sales" || goal === "improve-ads")   services.push("إدارة حملات إعلانية ممولة (Meta Ads & Google Ads) مع تقارير أداء شهرية");
  if (!hasSocial || challenges.indexOf("weak-engagement") !== -1) services.push("إدارة منصات التواصل الاجتماعي مع خطة محتوى شهرية وجدول نشر منتظم");
  if (challenges.indexOf("weak-content") !== -1)              services.push("إنتاج محتوى إبداعي: تصوير، فيديو ريلز، وتصميم بصري يعكس هوية علامتك");
  services.push("استراتيجية تسويق رقمي شاملة مخصصة لقطاعك وأهدافك مع خارطة طريق واضحة");
  services.push("تقارير أداء شهرية مع تحليل مفصل وتوصيات مستمرة لتحسين النتائج");

  var nextSteps = [
    "احجز جلسة استشارية مجانية مع فريق عروج لمناقشة خطتك التسويقية وتحديد أولوياتك",
    "أجرِ تدقيقاً شاملاً لوضعك الحالي على السوشيال ميديا وحدد الثغرات التي تحتاج معالجة فورية",
    "ضع ميزانية تسويقية موثقة بأهداف قابلة للقياس لأول 3 أشهر (" + budgetLabel + ") وحدد المؤشرات التي ستتابعها"
  ];

  var challengeLabel = challenges.length ? (CONFIG.CHALLENGES[challenges[0]] || "التطوير العام") : "تعزيز الحضور الرقمي";

  return {
    score: score,
    sections: {
      summary: "مشروعك في قطاع " + typeLabel + " يمتلك إمكانات حقيقية للنمو. هدفك الأساسي هو \"" + goalLabel + "\"، ويُقيَّم مشروعك بـ " + score + "/10. التحدي الرئيسي — " + challengeLabel + " — قابل للحل تماماً بمنهجية صحيحة. التقرير أدناه يوضح لك بالتفصيل نقاط قوتك وفرصك وخطوات البداية الموصى بها.",
      strengths: strengths,
      weaknesses: weaknesses,
      opportunities: opps,
      services: services,
      nextSteps: nextSteps,
      recommendation: "بناءً على التحليل الشامل لمشروعك في قطاع " + typeLabel + " وهدفك المتمثل في \"" + goalLabel + "\"، توصي عروج بالبدء فوراً بـ" + services[0] + ". مشروعك أقوى مما تظن، وعروج جاهزة لتكون شريكك الاستراتيجي في هذه الرحلة."
    }
  };
}

// ============================================================
// AUTO-SAVE LISTENERS
// ============================================================

function setupAutoSave() {
  document.addEventListener("input", function() { autoSave(); });
  document.addEventListener("change", function(e) {
    autoSave();
    if (e.target.name === "hasSocial") {
      toggleSocialLink(e.target.value);
    }
  });
}

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

function setupKeyboard() {
  document.addEventListener("keydown", function(e) {
    var formVisible = DOM.formSection && DOM.formSection.style.display !== "none";
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
  console.log("=== عروج AI Initializing ===");

  DOM.init();

  // Verify critical DOM elements
  if (!DOM.heroSection)  console.error("MISSING: hero-Section");
  if (!DOM.formSection)  console.error("MISSING: formSection");
  if (!DOM.steps.length) console.error("MISSING: .form-step elements");

  // Particles
  PARTICLES_SYS.init(DOM.particleContainer);

  // Auto-save & keyboard
  setupAutoSave();
  setupKeyboard();

  // Restore saved session
  var saved = STORAGE.load();
  if (saved && Object.keys(saved).length > 0) {
    console.log("Restoring saved form data");
    setTimeout(function() { STORAGE.restore(saved); }, 150);
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

  console.log("=== عروج AI Ready ===");
  console.log("%cعروج AI ✓ — جاهز للتحليل", "color:#C9A84C;font-weight:bold;font-size:15px;");
}

// ============================================================
// BOOTSTRAP
// ============================================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
                   }
