document.addEventListener('DOMContentLoaded', () => {
    // Handle if URL contains hash
    if (window.location.hash) {
        const headerHeight = getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')
            .trim();
        
        setTimeout(() => {
            const element = document.querySelector(window.location.hash);
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - parseInt(headerHeight);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 100);
    }
}); 