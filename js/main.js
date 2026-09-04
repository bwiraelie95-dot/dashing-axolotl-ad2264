/* ============================================================
   AFRICA COMMUNITY VILLAGE — site interactions
   Mobile nav, scroll reveals, animated stat counters,
   accordions, back-to-top, and front-end-only form feedback.
   ============================================================ */
(function(){
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if(toggle && nav){
    toggle.addEventListener("click", function(){
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  document.querySelectorAll(".has-dropdown > a.nav-link").forEach(function(link){
    link.addEventListener("click", function(e){
      if(window.innerWidth <= 980){
        e.preventDefault();
        link.parentElement.classList.toggle("is-expanded");
      }
    });
  });

  /* Close mobile nav when a real link is followed */
  document.querySelectorAll(".main-nav a:not(.has-dropdown > a)").forEach(function(link){
    link.addEventListener("click", function(){
      if(window.innerWidth <= 980 && nav){
        nav.classList.remove("is-open");
        toggle && toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12, rootMargin:"0px 0px -40px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters (the ledger stats) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  if("IntersectionObserver" in window && counters.length){
    var ioCount = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold:0.4 });
    counters.forEach(function(el){ ioCount.observe(el); });
  }

  /* ---------- Accordions ---------- */
  document.querySelectorAll(".accordion-trigger").forEach(function(trigger){
    trigger.addEventListener("click", function(){
      var item = trigger.closest(".accordion-item");
      var panel = item.querySelector(".accordion-panel");
      var isOpen = item.classList.contains("is-open");

      item.parentElement.querySelectorAll(".accordion-item.is-open").forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove("is-open");
          openItem.querySelector(".accordion-panel").style.maxHeight = null;
          openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded","false");
        }
      });

      if(isOpen){
        item.classList.remove("is-open");
        panel.style.maxHeight = null;
        trigger.setAttribute("aria-expanded","false");
      } else {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded","true");
      }
    });
  });

  /* Open the first accordion item by default, if present */
  var firstAccordion = document.querySelector(".accordion-item");
  if(firstAccordion){
    firstAccordion.querySelector(".accordion-trigger").click();
  }

  /* ---------- Back to top ---------- */
  var backBtn = document.querySelector(".back-to-top");
  if(backBtn){
    window.addEventListener("scroll", function(){
      backBtn.classList.toggle("is-shown", window.scrollY > 600);
    });
    backBtn.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  }

  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector(".site-header");
  if(header){
    window.addEventListener("scroll", function(){
      header.style.boxShadow = window.scrollY > 8 ? "0 4px 18px rgba(20,18,10,0.08)" : "none";
    });
  }

  /* ---------- Contact form (front-end demo only) ---------- */
  var contactForm = document.querySelector("#contact-form");
  if(contactForm){
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      var success = document.querySelector("#contact-success");
      if(success){
        success.classList.add("is-shown");
        success.setAttribute("role","status");
      }
      contactForm.reset();
      if(success){ success.scrollIntoView({ behavior:"smooth", block:"center" }); }
    });
  }

  /* ---------- Newsletter form (front-end demo only) ---------- */
  document.querySelectorAll(".newsletter-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var btn = form.querySelector("button");
      var original = btn.textContent;
      btn.textContent = "Subscribed ✓";
      form.querySelector("input").value = "";
      setTimeout(function(){ btn.textContent = original; }, 2600);
    });
  });

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

})();
