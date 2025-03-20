document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelector('nav .menu-links');
    
    // Check if ResizeObserver is supported
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            checkMenuHeight();
        });
        
        // Observe the menu links section for size changes
        resizeObserver.observe(menuLinks);
    } else {
        // Fallback for browsers without ResizeObserver
        // Initial check and resize listener will still work
        console.log('ResizeObserver not supported, using fallback');
    }
    
    // Check if menu content exceeds viewport height
    function checkMenuHeight() {
        const menuHeight = menuLinks.scrollHeight;
        const windowHeight = window.innerHeight;
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
        const availableHeight = windowHeight - headerHeight;
        
        // Add a class when menu needs scrolling
        if (menuHeight > availableHeight) {
            menuLinks.classList.add('scrollable');
            menuLinks.style.maxHeight = `${availableHeight - 100}px`; // Leave space for social links and external links
        } else {
            menuLinks.classList.remove('scrollable');
            menuLinks.style.maxHeight = '';
        }
    }
    
    // Check initial size
    checkMenuHeight();
    
    // Also check on window resize
    window.addEventListener('resize', checkMenuHeight);
    
    // Listen for dropdown toggles and recalculate menu height
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            // Wait for the dropdown animation to complete
            setTimeout(checkMenuHeight, 300);
        });
    });
    
    // Scroll to active menu item if needed
    const currentPage = document.querySelector('a[aria-current="page"]');
    if (currentPage && menuLinks.classList.contains('scrollable')) {
        setTimeout(() => {
            currentPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}); 