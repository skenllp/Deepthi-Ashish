/* ==========================================================================
   Ashish & Deepthi — app.js
   Countdown engine · Invitation cover · Letter animation · Floating audio
   GSAP reveals (fade + blur) · RSVP · Lightbox
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 0. Letter-split animation for couple names                         */
  /* ------------------------------------------------------------------ */
  function splitIntoLetters(el) {
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
  }

  document.querySelectorAll('.hero .couple-names span:not(.amp)').forEach(function (nameSpan) {
    splitIntoLetters(nameSpan);
  });

  /* ------------------------------------------------------------------ */
  /* 1. Live Countdown Engine — Muhurtham: 23 Aug 2026, 11:45 AM IST     */
  /* ------------------------------------------------------------------ */
  var WEDDING_DATE = new Date('2026-08-23T11:45:00+05:30').getTime();
  var heroTimeline;

  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins = document.getElementById('cd-mins');
  var elSecs = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    var diff = WEDDING_DATE - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      clearInterval(countdownTimer);
      return;
    }
    elDays.textContent = pad(Math.floor(diff / 86400000));
    elHours.textContent = pad(Math.floor((diff / 3600000) % 24));
    elMins.textContent = pad(Math.floor((diff / 60000) % 60));
    elSecs.textContent = pad(Math.floor((diff / 1000) % 60));
  }

  updateCountdown();
  var countdownTimer = setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------ */
  /* 2. Floating Audio Player                                          */
  /* ------------------------------------------------------------------ */
  var audioToggle = document.getElementById('audioToggle');
  var bgAudio = document.getElementById('bgAudio');
  var isPlaying = false;
  var fadeInterval = null;
  var TARGET_VOLUME = 0.6;

  bgAudio.volume = 0;

  function clearFade() {
    if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
  }

  function fadeAudio(direction) {
    clearFade();
    var step = 0.05;
    fadeInterval = setInterval(function () {
      if (direction === 'in') {
        bgAudio.volume = Math.min(TARGET_VOLUME, bgAudio.volume + step);
        if (bgAudio.volume >= TARGET_VOLUME) clearFade();
      } else {
        bgAudio.volume = Math.max(0, bgAudio.volume - step);
        if (bgAudio.volume <= 0) { bgAudio.pause(); clearFade(); }
      }
    }, 80);
  }

  audioToggle.addEventListener('click', function () {
    var hasSource = bgAudio.querySelector('source[src]');
    if (!hasSource) {
      audioToggle.setAttribute('title', 'Add your own music file in index.html to enable playback');
      return;
    }
    if (!isPlaying) {
      bgAudio.play().catch(function () {});
      fadeAudio('in');
      audioToggle.classList.add('playing');
      audioToggle.setAttribute('aria-pressed', 'true');
      audioToggle.setAttribute('aria-label', 'Pause wedding music');
      audioToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
      isPlaying = true;
    } else {
      fadeAudio('out');
      audioToggle.classList.remove('playing');
      audioToggle.setAttribute('aria-pressed', 'false');
      audioToggle.setAttribute('aria-label', 'Play wedding music');
      audioToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
      isPlaying = false;
    }
  });

  /* ------------------------------------------------------------------ */
  /* 3. Invitation Cover Overlay                                        */
  /* ------------------------------------------------------------------ */
  var btnOpenInvitation = document.getElementById('btnOpenInvitation');
  var invitationCover = document.getElementById('invitationCover');

  if (invitationCover) {
    document.body.style.overflow = 'hidden';
  }

  function openInvitation() {
    if (!invitationCover) return;

    invitationCover.style.opacity = '0';
    invitationCover.style.pointerEvents = 'none';
    document.body.style.overflow = '';

    if (heroTimeline) heroTimeline.play();

    var hasSource = bgAudio.querySelector('source[src]');
    if (!isPlaying && hasSource) {
      bgAudio.play().catch(function () {});
      fadeAudio('in');
      audioToggle.classList.add('playing');
      audioToggle.setAttribute('aria-pressed', 'true');
      audioToggle.setAttribute('aria-label', 'Pause wedding music');
      audioToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
      isPlaying = true;
    }

    setTimeout(function () { invitationCover.remove(); }, 800);
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener('click', openInvitation);
  }

  /* ------------------------------------------------------------------ */
  /* 4. RSVP Form                                                       */
  /* ------------------------------------------------------------------ */
  var rsvpForm = document.getElementById('rsvpForm');
  var rsvpThanks = document.getElementById('rsvpThanks');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (rsvpThanks) rsvpThanks.classList.add('show');
      rsvpForm.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Lightbox for Gallery                                            */
  /* ------------------------------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(function (frame) {
    frame.addEventListener('click', function () {
      if (!lightbox || !lightboxContent) return;
      lightboxContent.innerHTML = frame.querySelector('.frame-inner').innerHTML;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() { if (lightbox) lightbox.classList.remove('open'); }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  /* ------------------------------------------------------------------ */
  /* 6. GSAP ScrollTrigger Reveal Sequences — fade + blur + letters      */
  /* ------------------------------------------------------------------ */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.9 } })
      .to('.hero [data-reveal]', { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.15 }, 0)
      .to('.hero .couple-names .letter', { y: 0, opacity: 1, stagger: 0.045, duration: 0.6, ease: 'power2.out' }, 0.25);

    if (!document.getElementById('invitationCover')) {
      heroTimeline.play();
    }

    gsap.utils.toArray('main [data-reveal], .ashirwad [data-reveal]').forEach(function (el) {
      gsap.to(el, {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    var staggerGroups = {};
    gsap.utils.toArray('[data-reveal-stagger]').forEach(function (el) {
      var parent = el.closest('section');
      var key = parent ? (parent.id || parent.className) : 'default';
      if (!staggerGroups[key]) staggerGroups[key] = [];
      staggerGroups[key].push(el);
    });

    Object.keys(staggerGroups).forEach(function (key) {
      var items = staggerGroups[key];
      gsap.to(items, {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: items[0], start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
  } else {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    document.querySelectorAll('.couple-names .letter').forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
})();
