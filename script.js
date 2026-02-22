document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------------------------
       Mobile navigation toggle
       ------------------------------------------------------------------ */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ------------------------------------------------------------------
       Theme switching (light/dark)
       ------------------------------------------------------------------ */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('.icon') : null;

    // applyTheme receives `dark` boolean; when true apply dark-mode class and
    // show sun icon (the action user will take if they click it).
    const applyTheme = (dark) => {
        if (dark) {
            body.classList.add('dark-theme');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            body.classList.remove('dark-theme');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    };

    const storedTheme = localStorage.getItem('theme');
    applyTheme(storedTheme === 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-theme');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    /* ------------------------------------------------------------------
       Smooth scrolling & header scroll effects
       ------------------------------------------------------------------ */
    const header = document.querySelector('.header');
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run once on load

    internalLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }

            // close mobile nav if open
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
});