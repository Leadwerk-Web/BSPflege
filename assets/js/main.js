(function () {
  "use strict";

  document.body.classList.add("has-mobile-call");

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var close = document.getElementById("navClose");
  var overlay = document.getElementById("navOverlay");
  var links = document.querySelectorAll(".nav__link, .nav__cta");

  /* ---- Sticky header state ---- */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile / kompakte Navigation ---- */
  function openNav() {
    nav.classList.add("open");
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add("show"); });
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    nav.classList.remove("open");
    overlay.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () { overlay.hidden = true; }, 300);
  }

  if (toggle) toggle.addEventListener("click", openNav);
  if (close) close.addEventListener("click", closeNav);
  if (overlay) overlay.addEventListener("click", closeNav);
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav.classList.contains("open")) closeNav();
    });
  });

  /* Desktop-Nav nur einzeilig; sonst Burger */
  var navList = nav ? nav.querySelector(".nav__list") : null;
  var navModeTimer;

  function updateNavMode() {
    if (!header || !nav || !navList) return;
    var wasOpen = nav.classList.contains("open");
    header.classList.remove("nav-compact");
    if (wasOpen) closeNav();

    /* erzwingen: Layout messen im Desktop-Zustand */
    void navList.offsetWidth;

    var overflows = navList.scrollWidth > navList.clientWidth + 2;
    var wraps = false;
    navList.querySelectorAll(".nav__link").forEach(function (link) {
      if (link.scrollHeight > link.clientHeight + 2) wraps = true;
    });

    if (overflows || wraps || window.innerWidth <= 960) {
      header.classList.add("nav-compact");
    }
  }

  function scheduleNavMode() {
    clearTimeout(navModeTimer);
    navModeTimer = setTimeout(updateNavMode, 80);
  }

  window.addEventListener("resize", scheduleNavMode);
  window.addEventListener("load", updateNavMode);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateNavMode).catch(function () {});
  }
  updateNavMode();
  requestAnimationFrame(updateNavMode);

  /* ---- Hero-Hintergrund-Slider ---- */
  var heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    var heroSlides = heroSlider.querySelectorAll(".hero__slide");
    var heroIndex = 0;
    var heroTimer;
    var heroReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showHeroSlide(index) {
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === heroIndex);
      });
    }
    function startHeroAuto() {
      if (heroReduced || heroSlides.length < 2) return;
      clearInterval(heroTimer);
      heroTimer = setInterval(function () { showHeroSlide(heroIndex + 1); }, 5500);
    }
    showHeroSlide(0);
    startHeroAuto();
  }

  /* ---- Horizontales Leistungs-Akkordeon ---- */
  var accPanels = document.querySelectorAll(".acc-panel");
  accPanels.forEach(function (panel) {
    var trigger = panel.querySelector(".acc-panel__trigger");
    if (!trigger) return;
    function activate() {
      accPanels.forEach(function (p) {
        p.classList.remove("is-open");
        var t = p.querySelector(".acc-panel__trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      panel.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
    trigger.addEventListener("click", function (e) {
      var navTarget = e.target.closest("[data-href]");
      if (navTarget && panel.classList.contains("is-open")) {
        var href = navTarget.getAttribute("data-href");
        if (href) {
          window.location.href = href;
          return;
        }
      }
      activate();
    });
    trigger.addEventListener("mouseenter", activate);
    trigger.addEventListener("focus", activate);
  });

  /* ---- Stimmen-Slider ---- */
  var testiSlider = document.getElementById("testiSlider");
  if (testiSlider) {
    var slides = testiSlider.querySelectorAll(".testi-slide");
    var dots = testiSlider.querySelectorAll(".testi-slider__dot");
    var current = 0;
    var timer;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }
    function startAuto() {
      clearInterval(timer);
      timer = setInterval(function () { showSlide(current + 1); }, 6000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { showSlide(i); startAuto(); });
    });
    startAuto();
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Active nav link via scroll spy (nur Anker auf derselben Seite) ---- */
  var sections = ["team", "karriere", "faq", "kontakt"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll(".nav__link");

  function setActive() {
    if (!sections.length) return;
    var pos = window.scrollY + 140;
    var current = "";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      if (link.getAttribute("aria-current") === "page") return;
      var href = link.getAttribute("href") || "";
      var hashIdx = href.indexOf("#");
      if (hashIdx === -1) return;
      var hash = href.slice(hashIdx + 1);
      if (!hash) return;
      link.classList.toggle("active", hash === current);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---- Deep-Link: Pflegewohngemeinschaften-Panel öffnen ---- */
  function openPanelByHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    var panel = document.getElementById(hash);
    if (!panel || !panel.classList.contains("acc-panel")) return;
    var trigger = panel.querySelector(".acc-panel__trigger");
    if (!trigger) return;
    accPanels.forEach(function (p) {
      p.classList.remove("is-open");
      var t = p.querySelector(".acc-panel__trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }
  openPanelByHash();
  window.addEventListener("hashchange", openPanelByHash);

  /* ---- FAQ accordion ---- */
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    var trigger = item.querySelector(".faq__trigger");
    var panel = item.querySelector(".faq__panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      if (isOpen) {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        panel.hidden = true;
      } else {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });

  /* ---- Barrierefreiheit Sidebar ---- */
  var a11yKey = "bs-a11y";
  var a11yRoot = document.documentElement;
  var a11yWidget = document.getElementById("a11yWidget");
  var a11yToggle = document.getElementById("a11yToggle");
  var a11yPanel = document.getElementById("a11yPanel");
  var a11yClose = document.getElementById("a11yClose");
  var a11yReset = document.getElementById("a11yReset");
  var a11yFontBtns = document.querySelectorAll(".a11y__font-btn");
  var a11yContrast = document.getElementById("a11yContrast");
  var a11yUnderline = document.getElementById("a11yUnderline");
  var a11yMotion = document.getElementById("a11yMotion");
  var a11yLineHeight = document.getElementById("a11yLineHeight");

  var defaultA11y = {
    font: "normal",
    contrast: false,
    underline: false,
    motion: false,
    lineHeight: false
  };

  var a11yFontScales = { normal: 1, sm: 0.875, lg: 1.125, xl: 1.25 };

  function applyFontScale(font) {
    var scale = a11yFontScales[font] || 1;
    if (scale === 1) {
      a11yRoot.removeAttribute("data-a11y-font");
      a11yRoot.style.zoom = "";
      a11yRoot.style.fontSize = "";
      return;
    }
    a11yRoot.setAttribute("data-a11y-font", font);
    a11yRoot.style.zoom = scale;
    a11yRoot.style.fontSize = "";
  }

  function loadA11y() {
    try {
      return Object.assign({}, defaultA11y, JSON.parse(localStorage.getItem(a11yKey) || "{}"));
    } catch (e) {
      return Object.assign({}, defaultA11y);
    }
  }

  function saveA11y(settings) {
    localStorage.setItem(a11yKey, JSON.stringify(settings));
  }

  function applyA11y(settings) {
    applyFontScale(settings.font || "normal");
    a11yRoot.classList.toggle("a11y-contrast", settings.contrast);
    a11yRoot.classList.toggle("a11y-underline-links", settings.underline);
    a11yRoot.classList.toggle("a11y-reduced-motion", settings.motion);
    a11yRoot.classList.toggle("a11y-line-height", settings.lineHeight);
  }

  function syncA11yUI(settings) {
    a11yFontBtns.forEach(function (btn) {
      var active = btn.getAttribute("data-a11y-font") === settings.font;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (a11yContrast) a11yContrast.setAttribute("aria-pressed", settings.contrast ? "true" : "false");
    if (a11yUnderline) a11yUnderline.setAttribute("aria-pressed", settings.underline ? "true" : "false");
    if (a11yMotion) a11yMotion.setAttribute("aria-pressed", settings.motion ? "true" : "false");
    if (a11yLineHeight) a11yLineHeight.setAttribute("aria-pressed", settings.lineHeight ? "true" : "false");
  }

  var a11ySettings = loadA11y();
  applyA11y(a11ySettings);
  syncA11yUI(a11ySettings);

  function openA11y() {
    if (!a11yPanel || !a11yToggle) return;
    a11yPanel.hidden = false;
    a11yWidget.classList.add("is-open");
    a11yToggle.setAttribute("aria-expanded", "true");
    a11yToggle.setAttribute("aria-label", "Barrierefreiheit schließen");
    if (a11yClose) a11yClose.focus();
  }

  function closeA11y() {
    if (!a11yPanel || !a11yToggle) return;
    a11yPanel.hidden = true;
    a11yWidget.classList.remove("is-open");
    a11yToggle.setAttribute("aria-expanded", "false");
    a11yToggle.setAttribute("aria-label", "Barrierefreiheit öffnen");
    a11yToggle.focus();
  }

  if (a11yToggle) {
    a11yToggle.addEventListener("click", function () {
      if (a11yPanel.hidden) openA11y();
      else closeA11y();
    });
  }
  if (a11yClose) a11yClose.addEventListener("click", closeA11y);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && a11yPanel && !a11yPanel.hidden) closeA11y();
  });

  document.addEventListener("click", function (e) {
    if (!a11yWidget || a11yPanel.hidden) return;
    if (!a11yWidget.contains(e.target)) closeA11y();
  });

  a11yFontBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      a11ySettings.font = btn.getAttribute("data-a11y-font");
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      saveA11y(a11ySettings);
    });
  });

  function bindA11yToggle(el, key) {
    if (!el) return;
    el.addEventListener("click", function () {
      a11ySettings[key] = !a11ySettings[key];
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      saveA11y(a11ySettings);
    });
  }

  bindA11yToggle(a11yContrast, "contrast");
  bindA11yToggle(a11yUnderline, "underline");
  bindA11yToggle(a11yMotion, "motion");
  bindA11yToggle(a11yLineHeight, "lineHeight");

  if (a11yReset) {
    a11yReset.addEventListener("click", function () {
      a11ySettings = Object.assign({}, defaultA11y);
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      localStorage.removeItem(a11yKey);
    });
  }

  /* ---- Kontaktformular (mailto-Übergabe) ---- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var statusEl = document.getElementById("contactFormStatus");

    function setFieldInvalid(el, invalid) {
      if (!el) return;
      el.classList.toggle("is-invalid", !!invalid);
    }

    function showStatus(type, message) {
      if (!statusEl) return;
      statusEl.hidden = false;
      statusEl.className = "contact-form__status is-" + type;
      statusEl.textContent = message;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var first = document.getElementById("contactFirst");
      var last = document.getElementById("contactLast");
      var email = document.getElementById("contactEmail");
      var phone = document.getElementById("contactPhone");
      var topic = document.getElementById("contactTopic");
      var message = document.getElementById("contactMessage");
      var privacy = document.getElementById("contactPrivacy");

      var firstVal = (first && first.value || "").trim();
      var lastVal = (last && last.value || "").trim();
      var emailVal = (email && email.value || "").trim();
      var phoneVal = (phone && phone.value || "").trim();
      var topicVal = (topic && topic.value || "Allgemeine Beratung").trim();
      var messageVal = (message && message.value || "").trim();
      var privacyOk = privacy && privacy.checked;

      setFieldInvalid(first, !firstVal);
      setFieldInvalid(last, !lastVal);
      setFieldInvalid(email, !emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal));
      setFieldInvalid(message, !messageVal);
      setFieldInvalid(privacy, !privacyOk);

      if (!firstVal || !lastVal || !emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || !messageVal || !privacyOk) {
        showStatus("error", "Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie den Datenschutzhinweis.");
        return;
      }

      var body = [
        "Anliegen: " + topicVal,
        "Name: " + firstVal + " " + lastVal,
        "E-Mail: " + emailVal,
        "Telefon: " + (phoneVal || "–"),
        "",
        "Nachricht:",
        messageVal
      ].join("\n");

      var mailto =
        "mailto:info@bs-pflege-ka.de" +
        "?subject=" + encodeURIComponent("Kontaktanfrage: " + topicVal) +
        "&body=" + encodeURIComponent(body);

      showStatus(
        "success",
        "Vielen Dank. Ihr E-Mail-Programm öffnet sich mit der fertigen Nachricht. Senden Sie sie dort ab – wir melden uns zeitnah."
      );
      window.location.href = mailto;
    });
  }

  /* ---- Nach oben ---------- */
  (function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Nach oben scrollen");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    var visible = false;
    function update() {
      var show = window.scrollY > 420;
      if (show === visible) return;
      visible = show;
      btn.classList.toggle("is-visible", show);
    }

    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();


/* ---- Ergänzungen 29.09.2026 ---- */
(function () {
  "use strict";

  /* Bewerbungsformular Stellenanzeigen. In WordPress ersetzt WPForms dieses Formular (data-lw-wpforms="application");
     in der statischen Vorschau öffnet sich das Mailprogramm. */
  var form = document.getElementById("bewerbungForm");
  if (form) {
    var status = document.getElementById("bewerbungFormStatus");
    var auswahl = document.getElementById("bewStelle");
    var zeige = function (typ, text) {
      if (!status) return;
      status.hidden = false;
      status.className = "contact-form__status is-" + typ;
      status.textContent = text;
    };
    var markiere = function (el, falsch) { if (el) el.classList.toggle("is-invalid", !!falsch); };
    Array.prototype.forEach.call(document.querySelectorAll("[data-bewerbung-stelle]"), function (a) {
      a.addEventListener("click", function () {
        if (auswahl) auswahl.value = a.getAttribute("data-bewerbung-stelle");
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var feld = function (id) { var el = document.getElementById(id); return { el: el, wert: ((el && el.value) || "").trim() }; };
      var vor = feld("bewFirst"), nach = feld("bewLast"), mail = feld("bewEmail"), tel = feld("bewPhone"), text = feld("bewMessage");
      var ds = document.getElementById("bewPrivacy");
      var mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.wert);
      markiere(vor.el, !vor.wert);
      markiere(nach.el, !nach.wert);
      markiere(mail.el, !mailOk);
      markiere(tel.el, !tel.wert);
      markiere(ds, !(ds && ds.checked));
      if (!vor.wert || !nach.wert || !mailOk || !tel.wert || !(ds && ds.checked)) {
        zeige("error", "Bitte fülle alle Pflichtfelder aus und bestätige den Datenschutzhinweis.");
        return;
      }
      var stelle = auswahl ? auswahl.options[auswahl.selectedIndex].text : "Bewerbung";
      var inhalt = [
        "Stelle: " + stelle,
        "Name: " + vor.wert + " " + nach.wert,
        "E-Mail: " + mail.wert,
        "Telefon: " + tel.wert,
        "",
        "Nachricht:",
        text.wert,
        "",
        "Lebenslauf: bitte an diese Mail anhängen."
      ].join("\n");
      zeige("success", "Dein E-Mail-Programm öffnet sich mit Deiner Bewerbung. Bitte häng dort noch Deinen Lebenslauf an.");
      window.location.href = "mailto:info@bs-pflege-ka.de?subject=" + encodeURIComponent("Bewerbung: " + stelle) +
        "&body=" + encodeURIComponent(inhalt);
    });
  }

  /* WG-Check auf der Seite Pflegewohngemeinschaften: fünf Fragen, eine erste Orientierung. */
  var check = document.getElementById("wgCheck");
  if (check) {
    var ausgabe = document.getElementById("wgCheckResult");
    var pfeil = '<span class="btn__arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
    var antwort = function (name) {
      var r = check.querySelector('input[name="' + name + '"]:checked');
      return r ? r.value : "";
    };
    check.addEventListener("change", function (e) {
      var fs = e.target && e.target.closest ? e.target.closest(".wg-check__q") : null;
      if (fs) fs.classList.remove("is-missing");
    });
    check.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = { q1: antwort("q1"), q2: antwort("q2"), q3: antwort("q3"), q4: antwort("q4"), q5: antwort("q5") };
      var fehlt = false;
      ["q1", "q2", "q3", "q4", "q5"].forEach(function (q) {
        var fs = check.querySelector('input[name="' + q + '"]').closest(".wg-check__q");
        if (!a[q]) { fehlt = true; if (fs) fs.classList.add("is-missing"); }
      });
      ausgabe.hidden = false;
      if (fehlt) {
        ausgabe.className = "wg-check__result is-error";
        ausgabe.innerHTML = "<p>Bitte beantworten Sie alle fünf Fragen.</p>";
        return;
      }
      var titel, text, ziel, knopf;
      if (a.q4 === "nein") {
        titel = "Dann passt eher Unterstützung zu Hause.";
        text = "Mobile Pflege, Hilfe im Haushalt und 24-Stunden-Pflege kommen zu Ihnen, in die vertraute Umgebung.";
        ziel = "ambulante-leistungen.html";
        knopf = "Zu den ambulanten Leistungen";
      } else if (a.q1 === "ja" && (a.q2 === "ja" || a.q3 === "ja")) {
        titel = "Eine Pflege-WG kann gut zu Ihnen passen.";
        text = "Kleine Gemeinschaft, Präsenz rund um die Uhr und Pflege aus einer Hand. Am besten schauen Sie sich eine unserer Wohngemeinschaften einmal an.";
        ziel = "#aufnahme";
        knopf = "Besichtigung anfragen";
      } else {
        titel = "Lassen Sie uns gemeinsam schauen.";
        text = "Ihre Antworten ergeben noch kein eindeutiges Bild. In einem kurzen Gespräch finden wir heraus, welche Unterstützung wirklich passt.";
        ziel = "kontakt.html";
        knopf = "Beratung anfragen";
      }
      if (a.q5 !== "ja") text += " Beim Antrag auf einen Pflegegrad helfen wir Ihnen gern.";
      ausgabe.className = "wg-check__result";
      ausgabe.innerHTML = "<strong>" + titel + "</strong><p>" + text + '</p><a class="btn btn--primary" href="' + ziel + '">' + knopf + " " + pfeil + "</a>";
    });
  }
})();
