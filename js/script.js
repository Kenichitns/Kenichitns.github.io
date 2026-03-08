// ================================================
// PORTFOLIO MOHAMED KHARRAZ — JS AMÉLIORÉ v2.0
// ================================================
// Modules :
//   1. Config
//   2. Utils
//   3. Navigation (burger, scroll, smooth, activeNav)
//   4. Barre de progression défilement
//   5. Thème sombre / clair (dark mode)
//   6. Typewriter
//   7. Animations d'intersection (skills, fade-in)
//   8. Filtre projets
//   9. Accordéon
//   10. Formulaire de contact
//   11. Initialisation
// ================================================

(function () {
  'use strict';

  // ================================================
  // 1. CONFIG
  // ================================================
  const CONFIG = {
    typewriter: {
      texts: [
        'Développeur Web',
        'Technicien Réseau',
        'Passionné de cybersécurité',
        'Étudiant BTS SIO SLAM'
      ],
      typeSpeed:   90,
      deleteSpeed: 45,
      pauseTime:   1800,
      startDelay:  1200
    },
    animation: {
      scrollThreshold: 80,
      skillThreshold:  0.2,
      sectionThreshold: 0.08
    },
    form: {
      scriptURL: 'https://script.google.com/macros/s/AKfycbwV4dumTE8jLQUVvokT1ks49h6YoHAKP4n4u5pw5doA-kkQ7DEkqVWQjScBERPA5V9vLg/exec'
    }
  };

  // ================================================
  // 2. UTILS
  // ================================================
  const Utils = {
    /** Limite la fréquence d'appel d'une fonction */
    throttle(fn, wait) {
      let last = 0;
      return function (...args) {
        const now = Date.now();
        if (now - last >= wait) { last = now; fn.apply(this, args); }
      };
    },

    /** Délai d'exécution après inactivité */
    debounce(fn, wait) {
      let id;
      return function (...args) {
        clearTimeout(id);
        id = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    /** Préférence de réduction de mouvement */
    prefersReducedMotion() {
      return typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /** Alias querySelector */
    $(sel)  { return document.querySelector(sel); },
    $$(sel) { return document.querySelectorAll(sel); },

    /** Helpers classes */
    add   (el, cls) { if (el) el.classList.add(cls); },
    remove(el, cls) { if (el) el.classList.remove(cls); },
    toggle(el, cls) { if (el) el.classList.toggle(cls); },
    has   (el, cls) { return el ? el.classList.contains(cls) : false; }
  };

  // ================================================
  // 3. NAVIGATION
  // ================================================
  const Nav = {
    init() {
      this.navbar    = Utils.$('.navbar');
      this.toggle    = Utils.$('#nav-toggle');
      this.links     = Utils.$('#nav-links');
      this.scrollTop = Utils.$('#scroll-top');

      if (this.toggle) this._setupBurger();
      this._setupScroll();
      this._setupSmoothScroll();
      this._setupActiveNav();
    },

    _setupBurger() {
      const close = () => {
        Utils.remove(this.navbar, 'active');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };
      const open = () => {
        Utils.add(this.navbar, 'active');
        this.toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      this.toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        Utils.has(this.navbar, 'active') ? close() : open();
      });

      /* Fermer sur clic d'un lien */
      this.links?.addEventListener('click', (e) => {
        if (e.target.closest('a')) close();
      });

      /* Fermer sur clic extérieur */
      document.addEventListener('click', (e) => {
        if (
          Utils.has(this.navbar, 'active') &&
          !this.toggle.contains(e.target) &&
          !this.links?.contains(e.target)
        ) close();
      });

      /* Fermer sur Échap */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && Utils.has(this.navbar, 'active')) {
          close();
          this.toggle.focus();
        }
      });
    },

    _setupScroll() {
      const onScroll = Utils.throttle(() => {
        const y = window.scrollY;

        /* Fond navbar au scroll */
        y > CONFIG.animation.scrollThreshold
          ? Utils.add(this.navbar, 'scrolled')
          : Utils.remove(this.navbar, 'scrolled');

        /* Bouton retour en haut */
        y > 500
          ? Utils.add(this.scrollTop, 'show')
          : Utils.remove(this.scrollTop, 'show');
      }, 80);

      window.addEventListener('scroll', onScroll, { passive: true });

      this.scrollTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth' });
      });
    },

    _setupSmoothScroll() {
      Utils.$$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const hash = link.getAttribute('href');
          if (!hash || hash === '#') return;
          const target = Utils.$(hash);
          if (!target) return;

          e.preventDefault();
          const offset = this.navbar?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({ top: Math.max(0, top), behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth' });

          /* Focus accessible */
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          setTimeout(() => target.removeAttribute('tabindex'), 800);
        });
      });
    },

    _setupActiveNav() {
      const sections  = Utils.$$('section[id]');
      const navLinks  = Utils.$$('.nav-links a[href^="#"]');
      if (!sections.length || !navLinks.length) return;

      if (typeof IntersectionObserver === 'undefined') {
        navLinks[0]?.setAttribute('aria-current', 'page');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            Utils.$(`a[href="#${id}"]`)?.setAttribute('aria-current', 'page');
          });
        },
        { rootMargin: '0px 0px -60% 0px', threshold: 0.15 }
      );
      sections.forEach(s => observer.observe(s));
    }
  };

  // ================================================
  // 4. BARRE DE PROGRESSION DÉFILEMENT
  // ================================================
  const ProgressBar = {
    init() {
      this.bar = Utils.$('#scroll-progress');
      if (!this.bar) return;

      const update = Utils.throttle(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const pct = scrollHeight - clientHeight > 0
          ? (scrollTop / (scrollHeight - clientHeight)) * 100
          : 0;
        this.bar.style.width = `${pct.toFixed(1)}%`;
      }, 30);

      window.addEventListener('scroll', update, { passive: true });
    }
  };

  // ================================================
  // 5. THÈME SOMBRE / CLAIR
  // ================================================
  const Theme = {
    STORAGE_KEY: 'mk-portfolio-theme',

    init() {
      this.btn = Utils.$('#theme-toggle');

      /* Applique le thème sauvegardé OU la préférence système */
      const saved  = localStorage.getItem(this.STORAGE_KEY);
      const system = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      const current = saved || system;

      this._apply(current);

      this.btn?.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        this._apply(next);
        localStorage.setItem(this.STORAGE_KEY, next);
      });
    },

    _apply(theme) {
      document.documentElement.dataset.theme = theme;
      const icon = this.btn?.querySelector('i');
      if (!icon) return;

      if (theme === 'light') {
        icon.className = 'fa-solid fa-moon';
        this.btn?.setAttribute('aria-label', 'Passer en mode sombre');
        this.btn?.setAttribute('title', 'Mode sombre');
      } else {
        icon.className = 'fa-solid fa-sun';
        this.btn?.setAttribute('aria-label', 'Passer en mode clair');
        this.btn?.setAttribute('title', 'Mode clair');
      }
    }
  };

  // ================================================
  // 6. TYPEWRITER
  // ================================================
  class Typewriter {
    constructor(el, opts = {}) {
      this.el          = el;
      this.texts       = opts.texts       || CONFIG.typewriter.texts;
      this.typeSpeed   = opts.typeSpeed   || CONFIG.typewriter.typeSpeed;
      this.deleteSpeed = opts.deleteSpeed || CONFIG.typewriter.deleteSpeed;
      this.pauseTime   = opts.pauseTime   || CONFIG.typewriter.pauseTime;
      this.startDelay  = opts.startDelay  || CONFIG.typewriter.startDelay;
      this.idx         = 0;
      this.charIdx     = 0;
      this.deleting    = false;

      if (!this.el) return;

      if (Utils.prefersReducedMotion()) {
        /* Affiche statiquement le premier texte */
        this.el.textContent = this.texts[0] || '';
        return;
      }
      setTimeout(() => this._tick(), this.startDelay);
    }

    _tick() {
      if (!this.el) return;
      const current = this.texts[this.idx] || '';

      if (this.deleting) {
        this.charIdx = Math.max(0, this.charIdx - 1);
        this.el.textContent = current.slice(0, this.charIdx);

        if (this.charIdx === 0) {
          this.deleting = false;
          this.idx = (this.idx + 1) % this.texts.length;
          setTimeout(() => this._tick(), 450);
        } else {
          setTimeout(() => this._tick(), this.deleteSpeed);
        }
      } else {
        this.charIdx = Math.min(current.length, this.charIdx + 1);
        this.el.textContent = current.slice(0, this.charIdx);

        if (this.charIdx === current.length) {
          this.deleting = true;
          setTimeout(() => this._tick(), this.pauseTime);
        } else {
          setTimeout(() => this._tick(), this.typeSpeed);
        }
      }
    }
  }

  // ================================================
  // 7. ANIMATIONS D'INTERSECTION
  // ================================================
  const Anim = {
    init() {
      this._animateSkills();
      this._animateFadeIns();
    },

    _animateSkills() {
      const bars = Utils.$$('.skill-progress');
      if (!bars.length) return;

      const apply = (bar) => {
        const v = bar.getAttribute('data-progress') || '0';
        bar.style.setProperty('--progress', `${v}%`);
        bar.classList.add('animated');

        /* Affiche le pourcentage dans l'élément .skill-percent si présent */
        const pct = bar.closest('.skill-item')?.querySelector('.skill-percent');
        if (pct) pct.textContent = `${v}%`;
      };

      if (typeof IntersectionObserver === 'undefined') {
        bars.forEach(apply); return;
      }

      const obs = new IntersectionObserver(
        (entries, o) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            apply(entry.target);
            o.unobserve(entry.target);
          });
        },
        { threshold: CONFIG.animation.skillThreshold, rootMargin: '0px 0px -40px 0px' }
      );
      bars.forEach(b => obs.observe(b));
    },

    _animateFadeIns() {
      const els = Utils.$$('.section, .competence-category, .timeline-card, .formation-card, .project-card');
      if (!els.length) return;

      if (typeof IntersectionObserver === 'undefined') {
        els.forEach(el => el.classList.add('fade-in-visible')); return;
      }

      const obs = new IntersectionObserver(
        (entries, o) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('fade-in-visible');
            o.unobserve(entry.target);
          });
        },
        { threshold: CONFIG.animation.sectionThreshold, rootMargin: '0px 0px -40px 0px' }
      );

      els.forEach((el, i) => {
        el.classList.add('fade-in');
        /* Délai en cascade pour les cards */
        if (el.matches('.project-card, .timeline-card, .formation-card, .competence-category')) {
          el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        }
        obs.observe(el);
      });
    }
  };

  // ================================================
  // 8. FILTRE PROJETS
  // ================================================
  const Filter = {
    init() {
      this.btns  = Utils.$$('.filter-btn');
      this.cards = Utils.$$('.project-card');
      if (!this.btns.length || !this.cards.length) return;

      this.btns.forEach(btn => {
        btn.addEventListener('click', () => this._apply(btn));
      });
    },

    _apply(activeBtn) {
      /* Met à jour les boutons */
      this.btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');

      const filter = activeBtn.dataset.filter || 'all';

      /* Affiche / masque les cartes */
      this.cards.forEach(card => {
        const cats = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.removeAttribute('hidden');
          card.classList.remove('hidden');
        } else {
          card.setAttribute('hidden', '');
          card.classList.add('hidden');
        }
      });
    }
  };

  // ================================================
  // 9. ACCORDÉON
  // ================================================
  const Accordion = {
    init() {
      const toggles = Utils.$$('.accordion-toggle');
      if (!toggles.length) return;

      toggles.forEach(toggle => {
        const id    = toggle.getAttribute('aria-controls');
        const panel = id ? Utils.$(`#${id}`) : toggle.nextElementSibling;
        if (!panel) return;

        const close = () => { toggle.setAttribute('aria-expanded', 'false'); panel.hidden = true; };
        const open  = () => { toggle.setAttribute('aria-expanded', 'true');  panel.hidden = false; };

        toggle.addEventListener('click', () => {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';

          /* Fermer les autres panneaux du même accordéon parent */
          const parent = toggle.closest('.accordion-group');
          if (parent) {
            parent.querySelectorAll('.accordion-toggle[aria-expanded="true"]').forEach(other => {
              if (other !== toggle) {
                const otherId    = other.getAttribute('aria-controls');
                const otherPanel = otherId ? Utils.$(`#${otherId}`) : other.nextElementSibling;
                if (otherPanel) {
                  other.setAttribute('aria-expanded', 'false');
                  otherPanel.hidden = true;
                }
              }
            });
          }

          expanded ? close() : open();
        });

        /* Accessibilité clavier */
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
        });
      });
    }
  };

  // ================================================
  // 10. FORMULAIRE DE CONTACT
  // ================================================
  const Form = {
    init() {
      this.form = Utils.$('#contact-form') || document.forms['submit-to-google-sheet'];
      this.msg  = Utils.$('#msg');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this._handleSubmit(e));
    },

    async _handleSubmit(e) {
      e.preventDefault();

      /* Validation HTML5 native */
      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }

      const btn      = this.form.querySelector('.btn-submit');
      const btnText  = btn?.querySelector('.btn-text');
      const origText = btnText?.textContent || 'Envoyer';

      if (btnText)  btnText.textContent = 'Envoi en cours…';
      if (btn)      btn.disabled = true;

      try {
        await fetch(CONFIG.form.scriptURL, {
          method: 'POST',
          body:   new FormData(this.form)
        });
        this._showMsg('✅ Message envoyé avec succès !', 'success');
        this.form.reset();
      } catch {
        this._showMsg('❌ Erreur lors de l\'envoi. Réessayez.', 'error');
      } finally {
        if (btnText)  btnText.textContent = origText;
        if (btn)      btn.disabled = false;
        setTimeout(() => {
          if (this.msg) { this.msg.textContent = ''; this.msg.className = ''; }
        }, 5000);
      }
    },

    _showMsg(text, type) {
      if (!this.msg) return;
      this.msg.textContent = text;
      this.msg.className   = type;
    }
  };

  // ================================================
  // 11. INITIALISATION
  // ================================================
  const App = {
    init() {
      Nav.init();
      ProgressBar.init();
      Theme.init();

      /* Typewriter */
      const typedEl = Utils.$('#typed-text');
      if (typedEl) {
        const raw  = typedEl.getAttribute('data-typed-texts');
        const opts = {};
        if (raw) {
          opts.texts = raw.split('|').map(t => t.trim()).filter(Boolean);
        }
        new Typewriter(typedEl, opts);
      }

      Anim.init();
      Filter.init();
      Accordion.init();
      Form.init();

      /* Année automatique dans le footer */
      const yearEl = Utils.$('#footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      console.log('✅ Portfolio MK initialisé avec succès');
    }
  };

  /* Lancement après chargement du DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();
