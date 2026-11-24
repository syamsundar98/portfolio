document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.querySelector('.back-to-top');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
    });

    // Back to Top Visibility
    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll Down Indicator - scroll to next section on click
    const scrollDown = document.querySelector('.scroll-down');

    scrollDown.addEventListener('click', () => {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentIndex = sections.findIndex(section => window.scrollY < section.offsetTop + section.offsetHeight);
        const nextSection = sections[currentIndex + 1];

        if (nextSection) {
            const headerOffset = 80;
            const offsetPosition = nextSection.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });

    // Show Scroll Down Indicator only on Home section
    const toggleScrollDown = () => {
        const hero = document.getElementById('home');
        if (window.scrollY < hero.offsetHeight - 100) {
            scrollDown.classList.add('visible');
        } else {
            scrollDown.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleScrollDown);
    toggleScrollDown();

    // Mobile Menu Toggle
    mobileBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        mobileNavBackdrop.classList.toggle('open', isOpen);
        mobileBtn.setAttribute('aria-expanded', isOpen);
        const icon = mobileBtn.querySelector('i');
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close Mobile Menu on Backdrop Click
    mobileNavBackdrop.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileNavBackdrop.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });

    // Smooth scrolling without updating URL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Close mobile menu if open
                if (mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    mobileNavBackdrop.classList.remove('open');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }

                // Scroll to section
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Active Navigation Link on Scroll (ScrollSpy)
    const sections = document.querySelectorAll('section');

    function highlightNavLink() {
        let scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; // Offset for header
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Featured Work Tabs (fixed tag list)
    const workTabs = document.getElementById('workTabs');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    if (workTabs && projectCards.length) {
        const normalize = (value) => value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/\s*\/\s*/g, '/');

        const workTabConfig = [
            { label: 'All', key: 'all', tags: [] },
            { label: 'Angular', key: 'angular', tags: ['angular', 'angular 5'] },
            { label: 'JavaScript', key: 'javascript', tags: ['javascript'] },
            { label: 'jQuery', key: 'jquery', tags: ['jquery'] },
            { label: 'REST API', key: 'rest-api', tags: ['rest api'] },
            { label: 'AJAX', key: 'ajax', tags: ['ajax'] },
            { label: 'OpenStreetMap', key: 'openstreetmap', tags: ['openstreet maps', 'openstreetmap'] },
            { label: 'Tailwind CSS', key: 'tailwind-css', tags: ['tailwind css'] }
        ];

        const tagsByKey = new Map(
            workTabConfig.map(tab => [tab.key, new Set(tab.tags)])
        );

        const createTab = (label, filterKey, isActive = false) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'work-tab' + (isActive ? ' active' : '');
            button.textContent = label;
            button.dataset.filter = filterKey;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            button.tabIndex = isActive ? 0 : -1;
            return button;
        };

        workTabConfig.forEach((tab, index) => {
            workTabs.appendChild(createTab(tab.label, tab.key, index === 0));
        });

        if (window.AOS) AOS.refresh();

        const applyFilter = (filterKey) => {
            const allowedTags = tagsByKey.get(filterKey);

            projectCards.forEach(card => {
                const matches = filterKey === 'all' ||
                    Array.from(card.querySelectorAll('.tech-tag'))
                        .some(tag => allowedTags.has(normalize(tag.textContent)));
                card.classList.toggle('is-hidden', !matches);
            });

            if (window.AOS) AOS.refresh();
        };

        const activateTab = (tab) => {
            workTabs.querySelectorAll('.work-tab').forEach(btn => {
                const isActive = btn === tab;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.tabIndex = isActive ? 0 : -1;
            });
            applyFilter(tab.dataset.filter);
        };

        workTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.work-tab');
            if (tab) activateTab(tab);
        });

        workTabs.addEventListener('keydown', (e) => {
            const tabs = Array.from(workTabs.querySelectorAll('.work-tab'));
            const currentIndex = tabs.indexOf(document.activeElement);
            if (currentIndex === -1) return;

            let nextIndex;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            } else if (e.key === 'Home') {
                nextIndex = 0;
            } else if (e.key === 'End') {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }

            e.preventDefault();
            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
        });
    }
});
