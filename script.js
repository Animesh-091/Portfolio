    // ── LOADER + NINJA ANIMATION ──
    (function () {
      function init() {
        var loader   = document.getElementById('loader');
        var mainWrap = document.getElementById('main-content');
        var pctEl    = document.getElementById('loaderPercent');

        /* safety: if DOM elements missing, just show site */
        if (!loader || !mainWrap || !pctEl) {
          if (mainWrap) { mainWrap.style.opacity = '1'; mainWrap.classList.add('visible'); }
          if (loader)   { loader.style.display = 'none'; }
          unlockScroll();
          return;
        }

        lockScroll();

        var pct  = 0;
        var done = false;

        /* ── tick: count 0 → 100 ── */
        function tick() {
          if (done) return;
          var step = pct < 55 ? 2.8 : pct < 80 ? 1.4 : 0.6;
          pct = Math.min(100, pct + step);
          pctEl.textContent = Math.floor(pct) + '%';
          if (pct < 100) {
            setTimeout(tick, 32);
          } else {
            pctEl.textContent = '100%';
            setTimeout(triggerNinja, 300);
          }
        }

        /* ── ninja entrance & cut sequence ── */
        function triggerNinja() {
          if (done) return;
          done = true;

          /* Build the full-screen split panels */
          var top   = mk('div', 'ninja-cut-top');
          var bot   = mk('div', 'ninja-cut-bot');
          var slash = mk('div', 'ninja-slash-line');
          var flash = mk('div', 'ninja-flash');

          /* Ninja SVG character */
          var wrap  = mk('div', 'ninja-wrap');
          wrap.id   = 'ninja-wrap';
          wrap.innerHTML = buildNinjaSVG();

          document.body.appendChild(top);
          document.body.appendChild(bot);
          document.body.appendChild(slash);
          document.body.appendChild(flash);
          document.body.appendChild(wrap);

          /* Hide original loader (panels cover it) */
          loader.style.visibility = 'hidden';

          /* frame gap so elements are painted before we animate */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {

              /* 1 — ninja runs in from left */
              wrap.classList.add('run-in');

              /* 2 — at screen center: do the slash */
              setTimeout(function () {
                wrap.classList.remove('run-in');
                wrap.classList.add('slash-pose');
                slash.classList.add('slash');

                /* brief white flash + sparks at slash */
                setTimeout(function () {
                  flash.classList.add('flash');
                  spawnSparks();
                }, 60);

                /* 3 — panels fall apart, ninja dashes out */
                setTimeout(function () {
                  top.classList.add('fall');
                  bot.classList.add('fall');

                  wrap.classList.remove('slash-pose');
                  wrap.classList.add('run-out');

                  /* reveal portfolio */
                  mainWrap.classList.add('visible');
                  mainWrap.style.opacity = '1';
                  unlockScroll();

                  /* clean up DOM */
                  setTimeout(function () {
                    [top, bot, slash, flash, wrap].forEach(function (el) { el.remove(); });
                    loader.style.display = 'none';
                  }, 1100);
                }, 340);

              }, 700); /* time for run-in animation (650ms) + small pause */
            });
          });
        }

        /* ── helpers ── */
        function mk(tag, id) {
          var el = document.createElement(tag);
          el.id = id;
          document.body.appendChild(el);
          document.body.removeChild(el); /* will be re-appended in order */
          var el2 = document.createElement(tag);
          el2.id = id;
          return el2;
        }

        function spawnSparks() {
          var cols = ['#7c3aed','#ffffff','#7c3aed','#7c3aed','#ffffff','#a78bfa'];
          for (var i = 0; i < 14; i++) {
            (function (i) {
              var sp  = document.createElement('div');
              sp.className = 'nj-spark';
              var ang  = (i / 14) * Math.PI * 2;
              var dist = 40 + Math.random() * 80;
              sp.style.setProperty('--sx', '0px');
              sp.style.setProperty('--sy', '0px');
              sp.style.setProperty('--ex', (Math.cos(ang) * dist).toFixed(1) + 'px');
              sp.style.setProperty('--ey', (Math.sin(ang) * dist).toFixed(1) + 'px');
              sp.style.background   = cols[i % cols.length];
              sp.style.boxShadow    = '0 0 7px ' + cols[i % cols.length];
              document.body.appendChild(sp);
              requestAnimationFrame(function () { sp.classList.add('pop'); });
              setTimeout(function () { sp.remove(); }, 550);
            })(i);
          }
        }

        function buildNinjaSVG() {
          return '<svg id="nj-svg" viewBox="0 0 100 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">'
          /* ── scarf tails (behind body) ── */
          + '<path d="M30 32 Q10 55 5 80 Q18 65 28 55" fill="#7c3aed" opacity="0.75"/>'
          + '<path d="M50 30 Q72 20 90 25 Q78 28 68 38" fill="#6d28d9" opacity="0.75"/>'
          /* ── running legs ── */
          + '<g class="nj-legs">'
          + '<rect x="34" y="78" width="12" height="26" rx="6" fill="#111827" transform="rotate(-18 40 78)"/>'
          + '<rect x="50" y="78" width="12" height="26" rx="6" fill="#0f0f1a" transform="rotate(14 56 78)"/>'
          /* feet */
          + '<ellipse cx="30" cy="101" rx="9" ry="5" fill="#1e1b4b" transform="rotate(-10 30 101)"/>'
          + '<ellipse cx="60" cy="100" rx="9" ry="5" fill="#1e1b4b" transform="rotate(8 60 100)"/>'
          + '</g>'
          /* ── torso ── */
          + '<rect x="26" y="44" width="42" height="38" rx="8" fill="#111827"/>'
          + '<path d="M26 55 Q47 62 68 55" stroke="#1e1b4b" stroke-width="2.5" fill="none"/>'
          /* ── sword arm (raised for slash) ── */
          + '<line x1="62" y1="50" x2="90" y2="22" stroke="#111827" stroke-width="11" stroke-linecap="round"/>'
          /* katana handle */
          + '<rect x="83" y="15" width="8" height="14" rx="3" fill="#92400e" transform="rotate(-45 87 22)"/>'
          /* katana blade */
          + '<line x1="88" y1="18" x2="48" y2="-15" stroke="#e2e8f0" stroke-width="3.5" stroke-linecap="round"/>'
          + '<line x1="87" y1="16" x2="47" y2="-17" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round"/>'
          /* blade gleam */
          + '<circle cx="68" cy="2" r="3" fill="white" opacity="0.85"/>'
          /* ── off-arm ── */
          + '<line x1="30" y1="52" x2="10" y2="68" stroke="#111827" stroke-width="11" stroke-linecap="round"/>'
          + '<circle cx="9" cy="70" r="6" fill="#0f0f1a"/>'
          /* ── head ── */
          + '<circle cx="47" cy="28" r="20" fill="#111827"/>'
          /* mask band */
          + '<path d="M27 24 Q47 16 67 24 L67 34 Q47 42 27 34 Z" fill="#6d28d9"/>'
          /* eyes */
          + '<ellipse cx="38" cy="24" rx="6" ry="4" fill="white"/>'
          + '<ellipse cx="56" cy="22" rx="6" ry="4" fill="white"/>'
          + '<circle cx="40" cy="24" r="2.8" fill="#0a0a0a"/>'
          + '<circle cx="58" cy="22" r="2.8" fill="#0a0a0a"/>'
          + '<circle cx="41" cy="23" r="1" fill="white"/>'
          + '<circle cx="59" cy="21" r="1" fill="white"/>'
          /* brow lines (determined expression) */
          + '<line x1="32" y1="19" x2="44" y2="21" stroke="#0a0a0a" stroke-width="2.2" stroke-linecap="round"/>'
          + '<line x1="50" y1="17" x2="62" y2="19" stroke="#0a0a0a" stroke-width="2.2" stroke-linecap="round"/>'
          /* headband knot */
          + '<path d="M27 24 Q18 15 12 20 Q20 18 24 26" fill="#6d28d9" opacity="0.9"/>'
          /* speed lines */
          + '<line x1="-5" y1="45" x2="20" y2="44" stroke="rgba(109,40,217,0.35)" stroke-width="2" stroke-linecap="round"/>'
          + '<line x1="-10" y1="56" x2="18" y2="55" stroke="rgba(109,40,217,0.25)" stroke-width="1.5" stroke-linecap="round"/>'
          + '<line x1="-8" y1="66" x2="17" y2="65" stroke="rgba(109,40,217,0.18)" stroke-width="1" stroke-linecap="round"/>'
          + '</svg>';
        }

        /* start counting after a short delay */
        setTimeout(tick, 120);
        /* absolute failsafe — open after 7 s regardless */
        setTimeout(function () { if (!done) triggerNinja(); }, 7000);
      }

      /* run after DOM ready */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();

    // ── SCROLL LOCK HELPER (prevents layout jump when hiding scrollbar) ──
    function lockScroll() {
      const sb = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = sb + 'px';
      document.body.style.overflow = 'hidden';
    }
    function unlockScroll() {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Custom cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    const charEl = document.getElementById('cursor-char');
    const bubble = document.getElementById('charBubble');
    const pupilL = document.getElementById('pupilL');
    const pupilR = document.getElementById('pupilR');

    let mx = 0, my = 0, rx = 0, ry = 0;
    let cx = 200, cy = 200;
    let prevX = 0;
    let talkTimeout;

    // ── EYE TRACKING ──
    function trackEye(pupil, eyeEl) {
      const rect = eyeEl.getBoundingClientRect();
      const eyeCX = rect.left + rect.width / 2;
      const eyeCY = rect.top + rect.height / 2;
      const angle = Math.atan2(my - eyeCY, mx - eyeCX);
      const dist = Math.min(2.5, Math.hypot(mx - eyeCX, my - eyeCY) * 0.15);
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      pupil.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
    }

    // Throttled mousemove
    document.addEventListener('mousemove', e => {
      prevX = mx;
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      if (mx < prevX) charEl.classList.add('flip');
      else charEl.classList.remove('flip');
    });

    // Animate ring + character + eyes
    function animLoop() {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

      cx += (mx - cx) * 0.07; cy += (my - cy) * 0.07;
      charEl.style.left = cx + 'px'; charEl.style.top = cy + 'px';

      // eye tracking
      if (pupilL && pupilR) {
        trackEye(pupilL, document.getElementById('eyeL'));
        trackEye(pupilR, document.getElementById('eyeR'));
      }

      requestAnimationFrame(animLoop);
    }
    animLoop();

    // Bubble messages
    const bubbleMsgs = [
      'Hi there! 👋', 'Nice to meet you!', 'Explore my work ✨',
      'I build AI stuff 🤖', 'Hire Animesh?', 'Let\'s connect! 💎',
      'Cool scroll 😎', 'Click something!', 'AI + Web = 🔥'
    ];
    let msgIdx = 0;

    // Interactive hover: bubble only
    document.querySelectorAll('a, button, .skill-card, .project-card, .contact-item, .about-tag').forEach(el => {
      el.addEventListener('mouseenter', e => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.5)';

        bubble.textContent = bubbleMsgs[msgIdx % bubbleMsgs.length];
        msgIdx++;
        charEl.classList.add('talking');
        clearTimeout(talkTimeout);
        talkTimeout = setTimeout(() => charEl.classList.remove('talking'), 2000);
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });

    // Random idle bubble
    setInterval(() => {
      if (!charEl.classList.contains('talking')) {
        bubble.textContent = bubbleMsgs[Math.floor(Math.random() * bubbleMsgs.length)];
        charEl.classList.add('talking');
        setTimeout(() => charEl.classList.remove('talking'), 2500);
      }
    }, 8000);

    // Typed effect
    const words = ['AI Engineer', 'Web Developer', 'ML Specialist', 'Python Expert'];
    let wi = 0, ci = 0, del = false;
    const el = document.getElementById('typed');
    function type() {
      const w = words[wi];
      el.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
      if (!del && ci > w.length) { del = true; setTimeout(type, 1500); return; }
      if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; }
      setTimeout(type, del ? 60 : 90);
    }
    type();

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let cur = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
      navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : ''; });
    });

    // Form feedback
    document.querySelectorAll('.contact-submit').forEach(btn => {
      btn.addEventListener('click', function() {
        this.textContent = '✓ Message Sent!';
        this.style.background = '#00c49f';
        setTimeout(() => { this.textContent = 'Send Message →'; this.style.background = ''; }, 2500);
      });
    });

    // ── BACKGROUND PARTICLE NETWORK ──
    (function() {
      const canvas = document.getElementById('crystal-bg');
      const ctx = canvas.getContext('2d');
      let W, H;

      function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', () => { resize(); init(); });

      // Mouse tracking for interactive connections
      let mx = W / 2, my = H / 2, mouseActive = false;
      window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; mouseActive = true; });

      // Particle class
      class Particle {
        constructor(init) {
          this.reset(init);
        }
        reset(init) {
          this.x      = Math.random() * W;
          this.y      = init ? Math.random() * H : -5;
          this.depth  = 0.2 + Math.random() * 0.8;          // 0=far, 1=close
          this.r      = this.depth * 2.2 + 0.5;
          this.speed  = (0.15 + Math.random() * 0.5) * this.depth;
          this.angle  = Math.random() * Math.PI * 2;
          this.turn   = (Math.random() - 0.5) * 0.018;
          this.pulse  = Math.random() * Math.PI * 2;
          this.dpulse = 0.008 + Math.random() * 0.02;
          this.baseAlpha = 0.25 + this.depth * 0.55;
          // colour: purple shades + white nodes
          const roll = Math.random();
          if      (roll < 0.45) this.hue = [124, 58, 237];   // accent purple
          else if (roll < 0.70) this.hue = [167, 139, 250];  // lavender
          else if (roll < 0.85) this.hue = [196, 181, 253];  // light purple
          else                  this.hue = [255, 255, 255];  // white node
          this.isNode = roll > 0.88;   // bright "node" dots
        }
        update() {
          this.angle  += this.turn;
          this.turn   += (Math.random() - 0.5) * 0.002;
          this.turn    = Math.max(-0.035, Math.min(0.035, this.turn));
          this.x      += Math.cos(this.angle) * this.speed;
          this.y      += Math.sin(this.angle) * this.speed;
          this.pulse  += this.dpulse;
          if (this.x < -8)  this.x = W + 8;
          if (this.x > W+8) this.x = -8;
          if (this.y < -8)  this.y = H + 8;
          if (this.y > H+8) this.y = -8;
        }
        get alpha() {
          return this.baseAlpha * (0.55 + 0.45 * Math.abs(Math.sin(this.pulse)));
        }
        draw() {
          const [r,g,b] = this.hue;
          const a = this.alpha;
          if (this.isNode) {
            // glowing node
            const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3.5);
            grd.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
            grd.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.5})`);
            grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
            // solid center
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a * 1.4, 1)})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx.fill();
          }
        }
      }

      const N = Math.min(200, Math.floor(W * H / 6000));
      let particles = [];
      function init() {
        particles = Array.from({ length: N }, () => new Particle(true));
      }
      init();

      const LINE_DIST  = 140;   // max connection distance
      const MOUSE_DIST = 180;   // mouse repel/attract radius

      function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
          const pi = particles[i];

          // particle–particle connections
          for (let j = i + 1; j < particles.length; j++) {
            const pj = particles[j];
            const dx = pi.x - pj.x, dy = pi.y - pj.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < LINE_DIST) {
              const t    = 1 - dist / LINE_DIST;
              const depthFactor = (pi.depth + pj.depth) * 0.5;
              const a    = t * t * 0.22 * depthFactor;
              // gradient line from purple to lavender
              const grad = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
              grad.addColorStop(0, `rgba(124,58,237,${a})`);
              grad.addColorStop(1, `rgba(167,139,250,${a * 0.6})`);
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.strokeStyle = grad;
              ctx.lineWidth = t * 1.2 * depthFactor;
              ctx.stroke();
            }
          }

          // mouse–particle connections (interactive web)
          if (mouseActive) {
            const dx = pi.x - mx, dy = pi.y - my;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < MOUSE_DIST) {
              const t = 1 - dist / MOUSE_DIST;
              const a = t * t * 0.45;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(mx, my);
              ctx.strokeStyle = `rgba(196,181,253,${a})`;
              ctx.lineWidth = t * 1.5;
              ctx.stroke();
            }
          }
        }

        // mouse cursor dot
        if (mouseActive) {
          const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 18);
          mg.addColorStop(0,   'rgba(196,181,253,0.35)');
          mg.addColorStop(0.5, 'rgba(124,58,237,0.12)');
          mg.addColorStop(1,   'rgba(124,58,237,0)');
          ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI*2);
          ctx.fillStyle = mg; ctx.fill();
        }
      }

      function bgLoop() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(bgLoop);
      }
      bgLoop();
    })();

    // ── DM PANEL CONTROLS ──
    function openDM() {
      document.getElementById('dm-panel').classList.add('open');
      document.getElementById('dm-overlay').classList.add('active');
      lockScroll();
      setTimeout(() => document.getElementById('dmInput').focus(), 400);
    }
    function closeDM() {
      document.getElementById('dm-panel').classList.remove('open');
      document.getElementById('dm-overlay').classList.remove('active');
      unlockScroll();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDM(); });

    // ── AI AGENT DIRECT MESSAGE ──
    (function() {
      const messagesEl = document.getElementById('dmMessages');
      const inputEl    = document.getElementById('dmInput');
      const sendBtn    = document.getElementById('dmSend');
      const typingEl   = document.getElementById('dmTyping');

      const SYSTEM_PROMPT = `You are Animesh Kumar Sharma's AI assistant on his personal portfolio website. You represent him authentically and professionally.

About Animesh:
- Name: Animesh Kumar Sharma
- Roles: AI Engineer & Web Developer
- Skills: Python, Machine Learning, LLMs, LangChain, LlamaIndex, FastAPI, Django, React, Next.js, TypeScript, TensorFlow, PyTorch, Hugging Face, Docker, AWS, GCP, PostgreSQL, Pandas, Deep Learning, RAG pipelines, AI Agents, Prompt Engineering
- Experience: 3+ years, 20+ projects shipped, 15+ happy clients
- Open to: freelance projects, full-time roles, consulting, collaborations
- Availability: Currently open to work
- Personality: Friendly, passionate about AI, concise but thorough

Reply rules:
- Be warm, direct, and conversational — like a real person chatting
- Keep replies concise (2-4 sentences max unless detail is clearly needed)
- Show enthusiasm for AI and tech topics
- If asked about pricing/rates, say you would love to discuss — suggest they leave their contact using the notify form below
- If asked something you do not know, admit it naturally and suggest they leave their contact so Animesh can follow up
- Never break character — you ARE Animesh's voice
- Use occasional emojis naturally`;

      const history = [];

      function getTime() {
        return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      }

      function addMessage(text, fromMe) {
        const wrap = document.createElement('div');
        wrap.className = 'dm-msg ' + (fromMe ? 'from-me' : 'from-animesh');

        const avatar = document.createElement('div');
        avatar.className = 'dm-msg-avatar';
        avatar.textContent = fromMe ? '👤' : '🤖';

        const inner = document.createElement('div');
        const bubble = document.createElement('div');
        bubble.className = 'dm-bubble';
        bubble.textContent = text;

        const time = document.createElement('div');
        time.className = 'dm-time';
        time.textContent = getTime();

        inner.appendChild(bubble);
        inner.appendChild(time);
        wrap.appendChild(avatar);
        wrap.appendChild(inner);
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
      // expose for notify system
      window._dmAddMessage = (text, fromMe) => addMessage(text, fromMe);

      function setTyping(on) {
        typingEl.classList.toggle('active', on);
        if (on) messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        inputEl.value = '';
        sendBtn.disabled = true;
        addMessage(text, true);
        history.push({ role: 'user', content: text });
        setTyping(true);
        if (window._dmAutoNotifyHook) window._dmAutoNotifyHook();

        try {
          const response = await fetch(window.AI_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1000,
              system: SYSTEM_PROMPT,
              messages: history
            })
          });

          const data = await response.json();
          const reply = data.content?.[0]?.text || "Sorry, having a moment — please try again shortly! 😅";

          history.push({ role: 'assistant', content: reply });
          setTyping(false);
          addMessage(reply, false);
        } catch (err) {
          setTyping(false);
          addMessage("Connection hiccup! 😅 Please try again in a moment.", false);
        }

                sendBtn.disabled = false;
      }

      sendBtn.addEventListener('click', sendMessage);
      inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
    })();


    // ── MOBILE HAMBURGER NAV ──
    (function() {
      var btn  = document.getElementById('navMenuBtn');
      var menu = document.getElementById('navMobileMenu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        if (isOpen) lockScroll(); else unlockScroll();
      });
      document.querySelectorAll('.nav-ml').forEach(function(a) {
        a.addEventListener('click', function() {
          menu.classList.remove('open');
          btn.classList.remove('open');
          unlockScroll();
        });
      });
      document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('open');
          btn.classList.remove('open');
          unlockScroll();
        }
      });
    })();



    (function() {
      const bulb   = document.getElementById('bulb-toggle');
      const svg    = document.getElementById('bulb-svg');
      const thread = document.getElementById('bulb-thread');
      const ring   = document.getElementById('bulb-ring');
      if (!bulb || !svg || !thread || !ring) return;

      let dark = false;

      // ── Stretch constants ──
      // SVG resting layout: thread from y=0→12, ring at cy=17, bulb glass 34–66
      const BASE_THREAD_Y1 = 0;    // thread start (top) — this moves UP (negative) on stretch
      const BASE_THREAD_Y2 = 12;   // thread end = top of ring
      const BASE_RING_CY   = 17;   // ring center Y — FIXED, never moves
      const BASE_SVG_H     = 100;  // SVG height (resting)
      const VIEWBOX_W      = 44;
      const BASE_VIEWBOX_H = 100;
      const BASE_VIEWBOX_Y = 0;    // viewBox top Y — goes negative on stretch
      const TRIGGER_PX     = 60;
      const MAX_STRETCH_PX = 110;

      function svgScale() { return svg.getBoundingClientRect().height / BASE_VIEWBOX_H; }

      // Stretch: only grow thread upward. Ring + bulb stay exactly where they are.
      function applyStretch(extraPx) {
        const scale    = svgScale();
        const extraSVG = extraPx / scale;

        // Thread top moves UP (negative), bottom stays at y=12 (ring top)
        const newThreadY1 = BASE_THREAD_Y1 - extraSVG;
        // ViewBox origin moves up to reveal the extra thread
        const newViewboxY = BASE_VIEWBOX_Y - extraSVG;
        const newViewboxH = BASE_VIEWBOX_H + extraSVG;
        const newSvgH     = BASE_SVG_H + extraPx;

        thread.setAttribute('y1', newThreadY1);
        // y2, ring cy, everything else stays untouched
        svg.setAttribute('viewBox', `0 ${newViewboxY} ${VIEWBOX_W} ${newViewboxH}`);
        svg.setAttribute('height', newSvgH);

        // Tension colour cue
        const t = Math.min(extraPx / MAX_STRETCH_PX, 1);
        const threadColor = dark
          ? `rgb(${Math.round(124+t*131)},${Math.round(58+t*100)},${Math.round(237-t*190)})`
          : `rgb(${Math.round(167+t*88)},${Math.round(139-t*60)},${Math.round(250-t*200)})`;
        thread.setAttribute('stroke', threadColor);
        thread.setAttribute('stroke-width', 1.5 + t * 2.5);

        bulb.title = extraPx >= TRIGGER_PX
          ? (dark ? '🌞 Release to turn OFF!' : '🌙 Release to turn ON!')
          : 'Drag down to pull the thread!';
      }

      function snapBack(triggered) {
        thread.setAttribute('y1', BASE_THREAD_Y1);
        thread.setAttribute('y2', BASE_THREAD_Y2);
        ring.setAttribute('cy',   BASE_RING_CY);
        svg.setAttribute('viewBox', `0 ${BASE_VIEWBOX_Y} ${VIEWBOX_W} ${BASE_VIEWBOX_H}`);
        svg.setAttribute('height', BASE_SVG_H);
        thread.setAttribute('stroke', dark ? '#7c3aed' : '#a78bfa');
        thread.setAttribute('stroke-width', 1.5);
        ring.setAttribute('stroke', dark ? '#7c3aed' : '#a78bfa');
        ring.setAttribute('stroke-width', 1.5);
        bulb.title = dark ? 'Drag to turn lights off' : 'Drag to turn lights on';

        bulb.classList.remove('pulling');
        void bulb.offsetWidth;
        bulb.classList.add('pulling');
        setTimeout(() => bulb.classList.remove('pulling'), 520);

        if (triggered) {
          dark = !dark;
          document.body.classList.toggle('dark-mode', dark);
        }
      }

      // ── Pointer drag handling ──
      let dragging = false;
      let startY = 0;
      let currentStretch = 0;

      function onPointerDown(e) {
        dragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        currentStretch = 0;
        e.preventDefault();
      }

      function onPointerMove(e) {
        if (!dragging) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const delta   = Math.max(0, clientY - startY); // only downward
        currentStretch = Math.min(delta, MAX_STRETCH_PX);
        applyStretch(currentStretch);
        e.preventDefault();
      }

      function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        const triggered = currentStretch >= TRIGGER_PX;
        snapBack(triggered);
        currentStretch = 0;
        e.preventDefault();
      }

      // Mouse events
      bulb.addEventListener('mousedown',  onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup',   onPointerUp);

      // Touch events
      bulb.addEventListener('touchstart',  onPointerDown, { passive: false });
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend',  onPointerUp,   { passive: false });

      // Also support a plain click (short tap) as toggle
      let wasDrag = false;
      bulb.addEventListener('mousedown',  () => { wasDrag = false; });
      bulb.addEventListener('mousemove',  () => { wasDrag = true; });
      bulb.addEventListener('click', function(e) {
        if (wasDrag) return; // already handled by mouseup
        snapBack(true);
      });
    })();

    // ── PROJECT FILTER ──
    (function() {
      const filterBtns = document.querySelectorAll('.pf-btn');
      const cards = document.querySelectorAll('.project-card[data-type]');
      filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          cards.forEach(function(card) {
            if (filter === 'all' || card.dataset.type === filter) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    })();


  

    // ═══════════════════════════════════════════════
    // EMAILJS CONFIG — fill these 3 values in:
    // 1. Go to https://emailjs.com → sign up free
    // 2. Add Gmail service → copy Service ID
    // 3. Create email template → copy Template ID
    // 4. Account → copy Public Key
    // ═══════════════════════════════════════════════
    const EMAILJS_PUBLIC_KEY  = '67i7JSLWzf1qhOiY3';
    const EMAILJS_SERVICE_ID  = 'service_bys1tdl';
    const EMAILJS_TEMPLATE_ID = 'template_fqskkxk';
    const OWNER_EMAIL         = 'rahulkit450@gmail.com';

    window.AI_PROXY_URL = 'YOUR_PROXY_URL_HERE'; // Optional

    // ── NOTIFY SYSTEM ──
    function toggleNotifyCard() {
      const card = document.getElementById('dmNotifyCard');
      card.style.display = card.style.display === 'none' ? 'block' : 'none';
    }

    function switchNotifyTab(tab, btn) {
      document.querySelectorAll('.dm-ntab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('dmNotifyEmail').style.display    = tab === 'email'    ? 'flex' : 'none';
      document.getElementById('dmNotifyWhatsApp').style.display = tab === 'whatsapp' ? 'flex' : 'none';
    }

    function getChatContext() {
      return Array.from(document.querySelectorAll('#dmMessages .dm-bubble'))
        .slice(-6).map(b => b.textContent).join(' → ');
    }

    function saveLead(data) {
      try {
        const leads = JSON.parse(localStorage.getItem('portfolio_leads') || '[]');
        leads.push({ ...data, ts: new Date().toISOString() });
        localStorage.setItem('portfolio_leads', JSON.stringify(leads));
      } catch(e) {}
    }

    // Send email via EmailJS REST API (no SDK needed)
    async function sendEmailJS(from_name, contact, contact_type, chat_context) {
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id:  EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id:     EMAILJS_PUBLIC_KEY,
            template_params: {
              from_name:    from_name,
              to_name:      'Animesh',
              reply_to:     contact,
              message:      '\ud83d\udd14 New Portfolio Lead!\n\nName: ' + from_name + '\n' + contact_type + ': ' + contact + '\nChat context: ' + (chat_context || 'General enquiry'),
              subject:      'New Lead: ' + from_name + ' via ' + contact_type
            }
          })
        });
        if (res.ok) {
          console.log('EmailJS sent \u2705');
          return true;
        } else {
          const err = await res.text();
          console.error('EmailJS error:', res.status, err);
          return false;
        }
      } catch(e) {
        console.error('EmailJS fetch error:', e);
        return false;
      }
    }

    async function agentNotifyConfirm(name, contact, contactType, chatContext) {
      if (!window._dmAddMessage) return;
      try {
        const res = await fetch(window.AI_PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 150,
            messages: [{ role: 'user', content: `A visitor named "${name}" just left their ${contactType} contact (${contact}) on Animesh's portfolio. Write a warm, short 2-3 sentence confirmation that their details were saved and Animesh will personally reach out soon. Be friendly and end with an emoji.` }]
          })
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text;
        if (reply) window._dmAddMessage(reply, false);
      } catch(e) {
        window._dmAddMessage(`Got it! I've saved your details and Animesh will reach out to you via ${contactType} soon 👋`, false);
      }
    }

    async function submitNotify(type) {
      const success = document.getElementById('dmNotifySuccess');
      const chatContext = getChatContext();

      if (type === 'email') {
        const name  = document.getElementById('notifyName').value.trim();
        const email = document.getElementById('notifyEmail').value.trim();
        if (!name || !email || !email.includes('@')) {
          alert('Please enter your name and a valid email address.');
          return;
        }
        const btn = document.querySelector('#dmNotifyEmail .dm-notify-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        saveLead({ type: 'email', name, contact: email, context: chatContext });
        const sent = await sendEmailJS(name, email, 'Email', chatContext);

        document.getElementById('dmNotifyEmail').style.display = 'none';
        success.style.display = 'block';
        success.textContent = '✅ Sent! Animesh will reply to ' + email + ' soon.';
        await agentNotifyConfirm(name, email, 'Email', chatContext);
        if (btn) btn.textContent = 'Sent ✓';

      } else {
        const name  = document.getElementById('notifyNameWA').value.trim();
        const phone = document.getElementById('notifyPhone').value.trim().replace(/\s+/g, '');
        if (!name || phone.length < 7) {
          alert('Please enter your name and a valid phone number.');
          return;
        }
        const btn = document.querySelector('#dmNotifyWhatsApp .dm-notify-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        saveLead({ type: 'whatsapp', name, contact: phone, context: chatContext });
        const sent = await sendEmailJS(name, phone, 'WhatsApp', chatContext);

        document.getElementById('dmNotifyWhatsApp').style.display = 'none';
        success.style.display = 'block';
        success.textContent = '✅ Sent! Animesh will WhatsApp you at ' + phone + ' soon.';
        await agentNotifyConfirm(name, phone, 'WhatsApp', chatContext);
        if (btn) btn.textContent = 'Sent ✓';
      }
    }

    // Auto-show notify card after visitor sends 2 messages
    window._dmMessageCount = 0;
    window._dmAutoNotifyShown = false;
    window._dmAutoNotifyHook = function() {
      window._dmMessageCount++;
      if (window._dmMessageCount === 2 && !window._dmAutoNotifyShown) {
        window._dmAutoNotifyShown = true;
        setTimeout(() => {
          const card = document.getElementById('dmNotifyCard');
          if (card) card.style.display = 'block';
          if (window._dmAddMessage) {
            window._dmAddMessage("By the way — if you'd like Animesh to follow up personally, drop your email or WhatsApp below 👇", false);
          }
        }, 800);
      }
    };

    (function() {
      const timeline = document.querySelector('.stl-timeline');
      const orb      = document.getElementById('stlOrb');
      const trail    = document.getElementById('stlTrail');
      if (!timeline || !orb || !trail) return;

      function update() {
        const rect   = timeline.getBoundingClientRect();
        const totalH = timeline.offsetHeight;
        const winH   = window.innerHeight;

        // Start when timeline top reaches center of viewport, end at bottom
        const start   = winH * 0.5 - rect.top;
        const clamped = Math.min(Math.max(start, 0), totalH);
        const pct     = totalH > 0 ? clamped / totalH : 0;

        // Move orb and grow trail
        orb.style.top      = (pct * 100) + '%';
        trail.style.height = (pct * 100) + '%';
      }
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      update();
    })();
