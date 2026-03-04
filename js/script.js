// ===========================
// PORTFOLIO - JS OPTIMISÉ
// ===========================

(function() {
  'use strict';

  // ===== CONFIG =====
  const CONFIG = {
    typewriter: {
      texts: [
        "Développeur Web",
        "Technicien Réseau",
        "Passionné de cybersécurité",
        "Étudiant BTS SIO SLAM"
      ],
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
      startDelay: 1500
    },
    animation: {
      scrollThreshold: 100,
      skillThreshold: 0.2,
      sectionThreshold: 0.1
    },
    form: {
      scriptURL: 'https://script.google.com/macros/s/AKfycbwV4dumTE8jLQUVvokT1ks49h6YoHAKP4n4u5pw5doA-kkQ7DEkqVWQjScBERPA5V9vLg/exec'
    }
  };

  // ===== UTILS =====
  const Utils = {
    throttle(fn, wait) {
      let lastTime = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
          lastTime = now;
          fn.apply(this, args);
        }
      };
    },

    debounce(fn, wait) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    prefersReducedMotion() {
      return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    $(selector) {
      return document.querySelector(selector);
    },

    $$(selector) {
      return document.querySelectorAll(selector);
    },

    on(element, event, handler) {
      if (element) element.addEventListener(event, handler);
    },

    removeClass(element, className) {
      if (element) element.classList.remove(className);
    },

    addClass(element, className) {
      if (element) element.classList.add(className);
    },

    toggleClass(element, className) {
      if (element) element.classList.toggle(className);
    }
  };

  // ===== NAVIGATION =====
  const Nav = {
    init() {
      this.navbar = Utils.$('.navbar');
      this.toggle = Utils.$('#nav-toggle');
      this.links = Utils.$('#nav-links');
      this.scrollTop = Utils.$('#scroll-top');

      this.toggle && this.setupBurger();
      this.setupScroll();
      this.setupSmoothScroll();
      this.setupActiveNav();
    },

    setupBurger() {
      this.toggle.addEventListener('click', () => {
        const isActive = this.navbar.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
      });

      if (this.links) {
        this.links.addEventListener('click', (e) => {
          if (e.target.closest('a')) {
            Utils.removeClass(this.navbar, 'active');
            this.toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navbar.classList.contains('active')) {
          Utils.removeClass(this.navbar, 'active');
          this.toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    },

    setupScroll()

        if (this.scrollTop) {
          scrollY > 500 
            ? Utils.addClass(this.scrollTop, 'show') 
            : Utils.removeClass(this.scrollTop, 'show');
        }
      }, 100);

      window.addEventListener('scroll', handleScroll, { passive: true });

      if (this.scrollTop) {
        this.scrollTop.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth'
          });
        });
      }
    },

    setupSmoothScroll() {
      Utils.$$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const hash = link.getAttribute('href');
          if (!hash || hash === '#') return;

          const target = Utils.$(hash);
          if (!target) return;

          e.preventDefault();

          const navbar = Utils.$('.navbar');
          const offset = navbar?.offsetHeight || 0;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top: Math.max(0, targetPos),
            behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth'
          });

          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          setTimeout(() => target.removeAttribute('tabindex'), 800);
        });
      });
    },

    setupActiveNav() {
      const sections = Utils.$$('section[id]');
      const navLinks = Utils.$$('.nav-links a[href^="#"]');

      if (!sections.length || !navLinks.length) return;

      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => l.removeAttribute('aria-current'));
                const activeLink = Utils.$(`a[href="#${id}"]`);
                if (activeLink) activeLink.setAttribute('aria-current', 'page');
              }
            });
          },
          { rootMargin: '0px 0px -60% 0px', threshold: 0.2 }
        );

        sections.forEach(section => observer.observe(section));
      } else {
        // Fallback: mark first nav link if IntersectionObserver not supported
        const first = navLinks[0];
        if (first) first.setAttribute('aria-current', 'page');
      }
    }
  };

  // ===== TYPEWRITER =====
  class Typewriter {
    constructor(element, options = {}) {
      this.element = element;
      this.texts = options.texts || CONFIG.typewriter.texts;
      this.typeSpeed = options.typeSpeed || CONFIG.typewriter.typeSpeed;
      this.deleteSpeed = options.deleteSpeed || CONFIG.typewriter.deleteSpeed;
      this.pauseTime = options.pauseTime || CONFIG.typewriter.pauseTime;
      this.startDelay = options.startDelay || CONFIG.typewriter.startDelay;
      
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;

      if (this.element && !Utils.prefersReducedMotion()) {
        setTimeout(() => this.type(), this.startDelay);
      } else if (this.element) {
        this.element.textContent = this.texts[0];
      }
    }

    type() {
      if (!this.element) return;

      const currentText = this.texts[this.textIndex] || '';

      if (this.isDeleting) {
        this.charIndex = Math.max(0, this.charIndex - 1);
        this.element.textContent = currentText.substring(0, this.charIndex);

        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.textIndex = (this.textIndex + 1) % this.texts.length;
          setTimeout(() => this.type(), 500);
        } else {
          setTimeout(() => this.type(), this.deleteSpeed);
        }
      } else {
        this.charIndex = Math.min(currentText.length, this.charIndex + 1);
        this.element.textContent = currentText.substring(0, this.charIndex);

        if (this.charIndex === currentText.length) {
          this.isDeleting = true;
          setTimeout(() => this.type(), this.pauseTime);
        } else {
          setTimeout(() => this.type(), this.typeSpeed);
        }
      }
    }
  }

  // ===== ANIMATIONS =====
  const Anim = {
    init() {
      this.setupSkills();
      this.setupFadeIns();
    },

    setupSkills() {
      const bars = Utils.$$('.skill-progress');
      if (!bars.length) return;
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress') || '0';
                entry.target.style.setProperty('--progress', `${progress}%`);
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: CONFIG.animation.skillThreshold, rootMargin: '0px 0px -50px 0px' }
        );

        bars.forEach(bar => observer.observe(bar));
      } else {
        // Fallback: immediately apply progress
        bars.forEach(bar => {
          const progress = bar.getAttribute('data-progress') || '0';
          bar.style.setProperty('--progress', `${progress}%`);
          bar.classList.add('animated');
        });
      }
    },

    setupFadeIns() {
      const elements = Utils.$$('.section, .competence-category, .timeline-card');
      if (!elements.length) return;

      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: CONFIG.animation.sectionThreshold, rootMargin: '0px 0px -50px 0px' }
        );

        elements.forEach(el => {
          el.classList.add('fade-in');
          observer.observe(el);
        });
      } else {
        elements.forEach(el => el.classList.add('fade-in-visible'));
      }

      Utils.$$('.timeline-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.15}s`;
      });
    }
  };

  // ===== ACCORDION =====
  const Accordion = {
    init() {
      const toggles = Utils.$$('.accordion-toggle');
      if (!toggles.length) return;

      toggles.forEach(toggle => {
        const controlsId = toggle.getAttribute('aria-controls');
        const panel = controlsId ? Utils.$(`#${controlsId}`) : toggle.nextElementSibling;
        if (!panel) return;

        const close = () => {
          toggle.setAttribute('aria-expanded', 'false');
          panel.hidden = true;
        };

        const open = () => {
          toggle.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        };

        toggle.addEventListener('click', () => {
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

          // Fermer les autres accordions si plusieurs sont présents
          Utils.$$('.accordion-toggle[aria-expanded="true"]').forEach(other => {
            if (other !== toggle) {
              const otherId = other.getAttribute('aria-controls');
              const otherPanel = otherId ? Utils.$(`#${otherId}`) : other.nextElementSibling;
              if (otherPanel) {
                other.setAttribute('aria-expanded', 'false');
                otherPanel.hidden = true;
              }
            }
          });

          isExpanded ? close() : open();
        });

        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
          }
        });
      });
    }
  };

  // ===== FORM =====
  const Form = {
    init() {
      this.form = Utils.$('#contact-form') || document.forms['submit-to-google-sheet'];
      this.msg = Utils.$('#msg');

      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async handleSubmit(e) {
      e.preventDefault();

      const submitBtn = this.form.querySelector('.btn-submit');
      const btnText = submitBtn?.querySelector('.btn-text');
      const originalText = btnText?.textContent || 'Envoyer le message';

      if (btnText) btnText.textContent = 'Envoi...';
      if (submitBtn) submitBtn.disabled = true;

      try {
        await fetch(CONFIG.form.scriptURL, {
          method: 'POST',
          body: new FormData(this.form)
        });

        this.showMessage('Message envoyé avec succès !', 'success');
        this.form.reset();
      } catch (error) {
        this.showMessage("Erreur lors de l'envoi du message.", 'error');
        console.error('Erreur:', error);
      } finally {
        if (this.msg) {
          setTimeout(() => {
            this.msg.textContent = '';
            this.msg.classList.remove('fade-message');
          }, 4000);
        }

        if (btnText) btnText.textContent = originalText;
        if (submitBtn) submitBtn.disabled = false;
      }
    },

    showMessage(text, type) {
      if (!this.msg) return;
      this.msg.textContent = text;
      this.msg.className = `fade-message ${type}`;
    }
  };

  // ===== INIT =====
  const App = {
    init() {
      Nav.init();

      const typedEl = Utils.$('#typed-text');
      if (typedEl) {
        const dataTexts = typedEl.getAttribute('data-typed-texts');
        const options = {};
        if (dataTexts) {
          options.texts = dataTexts
            .split('|')
            .map(text => text.trim())
            .filter(Boolean);
        }
        new Typewriter(typedEl, options);
      }

      Anim.init();
      Accordion.init();
      Form.init();

      console.log('✅ Portfolio initialisé');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();
