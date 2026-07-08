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
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile navigation ---- */
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
    trigger.addEventListener("click", activate);
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

  /* ---- Active nav link via scroll spy ---- */
  var sections = ["leistungen", "team", "karriere", "faq", "kontakt"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll(".nav__link");

  function setActive() {
    var pos = window.scrollY + 140;
    var current = "top";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.classList.toggle("active", href === "#" + current);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

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

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
