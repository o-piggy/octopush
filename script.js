/* ============================================================
   script.js — octocode portfolio
   Features:
     1. Mobile nav toggle
     2. Theme switching
     3. Smooth scroll + header scroll effects
     4. Music sidebar + lazy player load
     5. Scroll-hide music toggle
     6. Sidebar scroll indicator
     7. Auto-close sidebar on scroll-down
     8. [NEW] Custom cursor
     9. [NEW] Hero canvas — mouse-reactive node network
    10. [NEW] Hero title character reveal
    11. [NEW] Scroll-triggered section reveals
    12. [NEW] 3D tilt project cards with sheen
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check if required libraries are loaded
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.warn('React or ReactDOM not loaded. Music player will not work.');
    }
    if (typeof Babel === 'undefined') {
        console.warn('Babel not loaded. Music player JSX transformation will fail.');
    }

    /* ------------------------------------------------------------------
       1. Mobile navigation toggle
       ------------------------------------------------------------------ */
    const hamburger = document.querySelector('.hamburger');
    const nav       = document.querySelector('.nav');
    const navLinks  = document.querySelectorAll('.nav__link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (!nav) return;
            const isOpen = nav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
        hamburger.addEventListener('mouseenter', () => {
            if (nav && !nav.classList.contains('open')) {
                nav.classList.add('open');
                hamburger.setAttribute('aria-expanded', 'true');
            }
        });
        hamburger.addEventListener('mouseleave', () => {
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                hamburger && hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ------------------------------------------------------------------
       2. Theme switching
       ------------------------------------------------------------------ */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body           = document.body;
    const icon           = themeToggleBtn ? themeToggleBtn.querySelector('.icon') : null;

    const applyTheme = (dark) => {
        if (dark) {
            body.classList.add('dark-theme');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            body.classList.remove('dark-theme');
            if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
    };
    applyTheme(localStorage.getItem('theme') === 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-theme');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    /* ------------------------------------------------------------------
       3. Smooth scroll + header effects
       ------------------------------------------------------------------ */
    const header        = document.querySelector('.header');
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    const handleScroll = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    internalLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const el = document.getElementById(link.getAttribute('href').slice(1));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                hamburger && hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ------------------------------------------------------------------
       4. Music sidebar + lazy player load
       ------------------------------------------------------------------ */
    const musicToggle = document.getElementById('music-toggle');
    const musicSidebar = document.getElementById('music-sidebar');
    let playerScriptLoaded = false;

    async function loadMusicPlayer() {
        if (playerScriptLoaded) return;
        
        // Check if Babel is loaded
        if (typeof Babel === 'undefined') {
            console.error('Babel not loaded! Music player requires Babel for JSX transformation.');
            return;
        }
        
        try {
            const res = await fetch('music-player.js');
            if (!res.ok) throw new Error(`Failed to fetch music-player.js: ${res.status}`);
            
            const code = await res.text();
            const transformed = Babel.transform(code, { presets: ['react'] }).code;
            const script = document.createElement('script');
            script.textContent = transformed;
            document.body.appendChild(script);
            playerScriptLoaded = true;
            console.log('Music player loaded successfully!');
        } catch (err) { 
            console.error('Failed to load music player:', err);
            // Show user-friendly error in sidebar
            const root = document.getElementById('music-player-root');
            if (root) {
                root.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: var(--text-muted);">
                        <p>Failed to load music player.</p>
                        <p style="font-size: 12px; margin-top: 10px;">Check console for details.</p>
                    </div>
                `;
            }
        }
    }

    if (musicToggle && musicSidebar) {
        musicToggle.addEventListener('click', () => {
            const isOpen = musicSidebar.classList.toggle('open');
            musicSidebar.setAttribute('aria-hidden', !isOpen);
            musicToggle.classList.toggle('shifted', isOpen);
            body.classList.toggle('sidebar-open', isOpen);
            if (isOpen) loadMusicPlayer();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && musicSidebar.classList.contains('open')) {
                musicSidebar.classList.remove('open');
                musicSidebar.setAttribute('aria-hidden', 'true');
                musicToggle.classList.remove('shifted');
                body.classList.remove('sidebar-open');
            }
        });
    }

    /* ------------------------------------------------------------------
       5. Hide music toggle while scrolling
       ------------------------------------------------------------------ */
    (function () {
        if (!musicToggle) return;
        let t = null;
        const hide = () => {
            if (musicSidebar && musicSidebar.classList.contains('open')) return;
            musicToggle.classList.add('hidden-on-scroll');
            clearTimeout(t);
            t = setTimeout(() => musicToggle.classList.remove('hidden-on-scroll'), 600);
        };
        window.addEventListener('scroll',    hide, { passive: true });
        window.addEventListener('wheel',     hide, { passive: true });
        window.addEventListener('touchmove', hide, { passive: true });
    })();

    /* ------------------------------------------------------------------
       6. Sidebar scroll indicator
       ------------------------------------------------------------------ */
    (function () {
        if (!musicSidebar) return;
        let indicator = musicSidebar.querySelector('.scroll-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            const bar = document.createElement('div');
            bar.className = 'scroll-indicator__bar';
            indicator.appendChild(bar);
            musicSidebar.appendChild(indicator);
        }
        const barEl = indicator.querySelector('.scroll-indicator__bar');
        const update = () => {
            const max = musicSidebar.scrollHeight - musicSidebar.clientHeight;
            if (max <= 0) { barEl.style.width = '0%'; indicator.style.opacity = '0'; return; }
            barEl.style.width = Math.max(0, Math.min(100, (musicSidebar.scrollTop / max) * 100)) + '%';
            indicator.style.opacity = musicSidebar.classList.contains('open') ? '1' : '0.9';
        };
        musicSidebar.addEventListener('scroll', update, { passive: true });
        new MutationObserver(update).observe(musicSidebar, { attributes: true, attributeFilter: ['class'] });
        window.addEventListener('resize', update);
        update();
    })();

    /* ------------------------------------------------------------------
       7. Auto-close sidebar on downward scroll
       ------------------------------------------------------------------ */
    (function () {
        if (!musicSidebar) return;
        let lastY = window.scrollY, ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y - lastY > 30 && musicSidebar.classList.contains('open')) {
                    musicSidebar.classList.remove('open');
                    musicSidebar.setAttribute('aria-hidden', 'true');
                    musicToggle && musicToggle.classList.remove('shifted');
                    body.classList.remove('sidebar-open');
                }
                lastY = y;
                ticking = false;
            });
        }, { passive: true });
    })();

    /* ==================================================================
       8. CUSTOM CURSOR
       ================================================================== */
    (function () {
        if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

        const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
        const ring = document.createElement('div'); ring.id = 'cursor-ring';
        document.body.append(dot, ring);

        let mx = -100, my = -100, rx = -100, ry = -100;

        function animateCursor() {
            // Ring lazily follows dot
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
            ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        const HOVER_SEL = 'a, button, [role="button"], label, .project-card, .tag, .social-link';
        const TEXT_SEL  = 'input, textarea';

        document.addEventListener('mouseover', e => {
            if (e.target.closest(TEXT_SEL)) {
                body.classList.add('cursor-text');
                body.classList.remove('cursor-hover');
            } else if (e.target.closest(HOVER_SEL)) {
                body.classList.add('cursor-hover');
                body.classList.remove('cursor-text');
            }
        });
        document.addEventListener('mouseout', e => {
            if (!e.relatedTarget || !e.relatedTarget.closest(HOVER_SEL + ',' + TEXT_SEL)) {
                body.classList.remove('cursor-hover', 'cursor-text');
            }
        });
        document.addEventListener('mousedown', () => body.classList.add('cursor-click'));
        document.addEventListener('mouseup',   () => body.classList.remove('cursor-click'));
        document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
    })();

    /* ==================================================================
       9. HERO CANVAS — mouse-reactive node network
       ================================================================== */
    (function () {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        hero.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let W, H, nodes;
        const mouse      = { x: -9999, y: -9999 };
        const NODE_COUNT = 72;
        const MAX_DIST   = 155;
        const MOUSE_DIST = 210;

        function resize() {
            W = canvas.width  = hero.offsetWidth;
            H = canvas.height = hero.offsetHeight;
            buildNodes();
        }

        function buildNodes() {
            const rand = (a, b) => a + Math.random() * (b - a);
            nodes = Array.from({ length: NODE_COUNT }, () => ({
                x:     rand(0, W),
                y:     rand(0, H),
                vx:    rand(-0.22, 0.22),
                vy:    rand(-0.22, 0.22),
                r:     rand(1.2, 2.6),
                depth: rand(0.3, 1.0),
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            const dark = body.classList.contains('dark-theme');

            // Parallax mouse offset
            const ox = ((mouse.x / W) - 0.5) * 28;
            const oy = ((mouse.y / H) - 0.5) * 28;

            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
                if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
            });

            for (let i = 0; i < nodes.length; i++) {
                const a  = nodes[i];
                const ax = a.x + ox * a.depth;
                const ay = a.y + oy * a.depth;

                // Mouse connection line (gold)
                const dmx = ax - mouse.x;
                const dmy = ay - mouse.y;
                const dm  = Math.hypot(dmx, dmy);
                if (dm < MOUSE_DIST) {
                    const alpha = (1 - dm / MOUSE_DIST) * 0.4;
                    ctx.strokeStyle = `rgba(197,160,89,${alpha})`;
                    ctx.lineWidth   = 0.9;
                    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }

                for (let j = i + 1; j < nodes.length; j++) {
                    const b  = nodes[j];
                    const bx = b.x + ox * b.depth;
                    const by = b.y + oy * b.depth;
                    const d  = Math.hypot(ax - bx, ay - by);
                    if (d < MAX_DIST) {
                        const alpha = (1 - d / MAX_DIST) * 0.16 * ((a.depth + b.depth) / 2);
                        const col = dark ? `rgba(197,160,89,${alpha})` : `rgba(33,40,66,${alpha})`;
                        ctx.strokeStyle = col;
                        ctx.lineWidth   = 0.55;
                        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
                    }
                }
            }

            nodes.forEach(n => {
                const nx = n.x + ox * n.depth;
                const ny = n.y + oy * n.depth;
                const dm = Math.hypot(nx - mouse.x, ny - mouse.y);
                const nearMouse = dm < MOUSE_DIST * 0.55;
                ctx.beginPath();
                ctx.arc(nx, ny, n.r * n.depth * (nearMouse ? 1.6 : 1), 0, Math.PI * 2);
                ctx.fillStyle = nearMouse
                    ? `rgba(197,160,89,${0.75 * n.depth})`
                    : dark
                        ? `rgba(197,160,89,${0.3 * n.depth})`
                        : `rgba(33,40,66,${0.32 * n.depth})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

        window.addEventListener('resize', resize);
        resize();
        draw();
    })();

    /* ==================================================================
       10. HERO TITLE — staggered character reveal
       ================================================================== */
    (function () {
        const title = document.querySelector('.hero__title');
        if (!title) return;

        let charOffset = 0;
        const newTitle = document.createElement('h1');
        newTitle.className = title.className;

        title.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                // Split on spaces, preserve spaces as text nodes
                text.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        newTitle.appendChild(document.createTextNode(part));
                    } else {
                        const word = document.createElement('span');
                        word.className = 'word';
                        part.split('').forEach(ch => {
                            const span = document.createElement('span');
                            span.className = 'char';
                            span.textContent = ch;
                            span.style.animationDelay = `${0.35 + charOffset * 0.042}s`;
                            charOffset++;
                            word.appendChild(span);
                        });
                        newTitle.appendChild(word);
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // e.g. <span class="text-highlight">Carel</span>
                const wrapper = document.createElement(node.tagName.toLowerCase());
                wrapper.className = node.className;
                const innerWord = document.createElement('span');
                innerWord.className = 'word';
                node.textContent.split('').forEach(ch => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = ch;
                    span.style.animationDelay = `${0.35 + charOffset * 0.042}s`;
                    charOffset++;
                    innerWord.appendChild(span);
                });
                wrapper.appendChild(innerWord);
                newTitle.appendChild(wrapper);
            }
        });

        title.replaceWith(newTitle);

        // Stagger subtitle and actions after all chars
        const totalDelay = 0.35 + charOffset * 0.042;
        const subtitle = document.querySelector('.hero__subtitle');
        const actions  = document.querySelector('.hero__actions');
        if (subtitle) subtitle.style.animationDelay = `${totalDelay + 0.15}s`;
        if (actions)  actions.style.animationDelay  = `${totalDelay + 0.38}s`;
    })();

    /* ==================================================================
       11. SCROLL-TRIGGERED REVEALS
       ================================================================== */
    (function () {
        // Assign reveal classes to sections and their children
        const singleReveals = [
            ...document.querySelectorAll('.section-title'),
            document.querySelector('.contact__header'),
        ].filter(Boolean);

        const groupReveals = [
            document.querySelector('.about__grid'),
            document.querySelector('.projects-grid'),
            document.querySelector('.contact-form'),
            document.querySelector('.footer__container'),
        ].filter(Boolean);

        singleReveals.forEach(el => el.classList.add('reveal'));
        groupReveals.forEach(el => el.classList.add('reveal-group'));

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal, .reveal-group').forEach(el => io.observe(el));
    })();

    /* ==================================================================
       12. 3D TILT PROJECT CARDS WITH SPECULAR SHEEN
       ================================================================== */
    (function () {
        const cards    = document.querySelectorAll('.project-card');
        const MAX_TILT = 11;

        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const rx   =  (e.clientY - cy) / (rect.height / 2) * MAX_TILT;
                const ry   = -(e.clientX - cx) / (rect.width  / 2) * MAX_TILT;
                const mx   = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
                const my   = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);

                card.style.transition = 'box-shadow 0.4s ease';
                card.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
                card.style.setProperty('--mx', `${mx}%`);
                card.style.setProperty('--my', `${my}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease';
                card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            });
        });
    })();

}); // end DOMContentLoaded