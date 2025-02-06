document.addEventListener('DOMContentLoaded', function() {
    // Debounce function
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    // Elements
    const elements = {
        menuToggle: document.querySelector('.header__toggle'),
        nav: document.querySelector('.header__nav'),
        overlay: document.querySelector('.background'),
        header: document.querySelector('.header'),
        toggleButton: document.getElementById("service-table-toggle"),
        table: document.querySelector(".service-table"),
        glideElement: document.querySelector('.glide'),
        loadMoreBtn: document.querySelector('.load-more-testimonials'),
        testimonialsContainer: document.querySelector('.testimonials-container')
    };

    const MenuState = {
        isDesktop: window.matchMedia('(min-width: 1024px)').matches,
        isOpen: false,
        isAnimating: false
    };

    // GSAP Menu Animations
    gsap.set(elements.nav, { x: '100%', visibility: 'hidden' });

    const openMenu = () => {
        if (MenuState.isAnimating || MenuState.isOpen) return;
        MenuState.isAnimating = true;
        MenuState.isOpen = true;
        elements.nav.style.willChange = 'transform';
        elements.nav.style.visibility = 'visible';
        elements.overlay.style.visibility = 'visible';

        gsap.to(elements.nav, {
            x: 0, duration: 0.3, ease: "power2.out",
            onStart: () => {
                elements.menuToggle.classList.add('header__toggle--active');
                elements.overlay.classList.add('show');
                document.body.classList.add('overflow-hidden');
                elements.menuToggle.setAttribute('aria-expanded', 'true');
            },
            onComplete: () => MenuState.isAnimating = false
        });
    };

    const closeMenu = () => {
        if (MenuState.isAnimating || !MenuState.isOpen) return;
        MenuState.isAnimating = true;
        MenuState.isOpen = false;

        gsap.to(elements.nav, {
            x: '100%', duration: 0.3, ease: "power2.in",
            onStart: () => {
                elements.menuToggle.classList.remove('header__toggle--active');
                elements.overlay.classList.remove('show');
                document.body.classList.remove('overflow-hidden');
                elements.menuToggle.setAttribute('aria-expanded', 'false');
            },
            onComplete: () => {
                elements.nav.style.visibility = 'hidden';
                elements.overlay.style.visibility = 'hidden';
                elements.nav.style.willChange = 'auto';
                MenuState.isAnimating = false;
            }
        });
    };

    const toggleMenu = (e) => {
        e?.preventDefault();
        if (MenuState.isDesktop) return;
        MenuState.isOpen ? closeMenu() : openMenu();
    };

    const handleResize = debounce(() => {
        MenuState.isDesktop = window.matchMedia('(min-width: 1110px)').matches;
        if (MenuState.isDesktop) {
            gsap.set(elements.nav, { clearProps: 'all' });
            elements.nav.style.visibility = 'visible';
            elements.overlay.classList.remove('show');
            elements.menuToggle.classList.remove('header__toggle--active');
            elements.menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('overflow-hidden');
            MenuState.isOpen = false;
            MenuState.isAnimating = false;
        } else if (!MenuState.isOpen) {
            gsap.set(elements.nav, { x: '100%', visibility: 'hidden' });
        }
    }, 150);

    const handleClick = (e) => {
        if (MenuState.isOpen &&
            !elements.nav.contains(e.target) &&
            !elements.menuToggle.contains(e.target)) {
            closeMenu();
        }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape' && MenuState.isOpen) closeMenu();
    };

    // Attach menu event listeners
    elements.menuToggle?.addEventListener('click', toggleMenu, { passive: false });
    elements.overlay?.addEventListener('click', closeMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', handleResize);

    // Service table toggle
    if (elements.toggleButton && elements.table) {
        elements.toggleButton.addEventListener("click", () => {
            const isExpanded = elements.toggleButton.getAttribute("aria-expanded") === "true";
            elements.toggleButton.setAttribute("aria-expanded", !isExpanded);
            elements.table.hidden = isExpanded;
        });

        elements.toggleButton.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                elements.toggleButton.click();
            }
        });
    }

// Load more testimonials
if (elements.loadMoreBtn && elements.testimonialsContainer) {
    const visibleContainer = elements.testimonialsContainer.querySelector('.testimonials-visible');
    const hiddenContainer = elements.testimonialsContainer.querySelector('.testimonials-hidden');

    elements.loadMoreBtn.addEventListener('click', () => {
        if (!hiddenContainer) return;

        const fragment = document.createDocumentFragment();
        while (hiddenContainer.children.length > 0) {
            fragment.appendChild(hiddenContainer.children[0]);
        }

        visibleContainer.appendChild(fragment);
        elements.loadMoreBtn.style.display = 'none';
        hiddenContainer.remove();
    });
}



    
    // Glide Carousel
    const breakpoint = window.matchMedia('(min-width: 768px)');
    let glide = null;

    function initCarousel() {
        if (elements.glideElement && !breakpoint.matches && !glide) {
            glide = new Glide('.glide', {
                type: 'carousel',
                perView: 1,
                gap: 0,
                keyboard: true,
                touchRatio: 1,
                dragThreshold: 60,
                autoplay: 2500,
                hoverpause: true,
                arrows: false,
                dots: false
            }).mount();
        }
    }

    function destroyCarousel() {
        if (glide) {
            glide.destroy();
            glide = null;
        }
    }

    if (elements.glideElement) {
        breakpoint.matches ? destroyCarousel() : initCarousel();
        window.addEventListener('resize', () => {
            breakpoint.matches ? destroyCarousel() : initCarousel();
        });
    }

    // Initial resize check
    handleResize();
});
