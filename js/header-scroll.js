document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Handle header visibility based on scroll direction
    const updateHeader = () => {
        const currentScrollY = window.scrollY;

        // Check scroll direction
        if (currentScrollY > lastScrollY) {
            // Scrolling down
            header.classList.add('header--hidden');
        } else {
            // Scrolling up
            header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    // Optimize scroll event
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader();
            });
            ticking = true;
        }
    });
}); 