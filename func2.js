// Safe wiring: only add handlers when elements exist
document.addEventListener('DOMContentLoaded', function () {
    const redirectBtn = document.getElementById('redirectButton1');
    if (redirectBtn) {
        redirectBtn.addEventListener('click', function () {
            window.location.href = 'https://www.google.com'; // Replace with your desired URL
        });
    }

    const navToggle = document.getElementById('navToggle');
    const navbarList = document.getElementById('navbarList');
    const MOBILE_BREAKPOINT = 820; // px - when nav switches to mobile behaviour

    if (navToggle && navbarList) {
        function setAria(open) {
            navToggle.setAttribute('aria-expanded', String(Boolean(open)));
            if (open) {
                navbarList.classList.add('open');
                navToggle.setAttribute('aria-label', 'Close navigation');
            } else {
                navbarList.classList.remove('open');
                navToggle.setAttribute('aria-label', 'Open navigation');
            }
        }

        navToggle.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpen = navbarList.classList.contains('open');
            setAria(!isOpen);
        });

        // Close when clicking outside (mobile overlay)
        document.addEventListener('click', function (e) {
            if (!navbarList.classList.contains('open')) return;
            // if click is inside the nav or on the toggle, ignore
            if (navbarList.contains(e.target) || navToggle.contains(e.target)) return;
            setAria(false);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navbarList.classList.contains('open')) {
                setAria(false);
            }
        });

        // If window is resized above breakpoint, ensure nav is visible in desktop mode and remove mobile 'open' state
        window.addEventListener('resize', function () {
            if (window.innerWidth > MOBILE_BREAKPOINT && navbarList.classList.contains('open')) {
                setAria(false);
            }
        });
    }
});