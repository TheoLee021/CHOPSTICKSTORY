const chopsticks = document.querySelector('.chopsticks');
const nav = document.querySelector('nav');
const overlay = document.querySelector('.overlay');

function toggleMenu() {
    chopsticks.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

chopsticks.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close menu when clicking a nav link
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

// Slider Navigation
const sliderContainer = document.querySelector('.slider-container');
const bars = document.querySelectorAll('.slider-bar');
let currentSlide = 1;

// Clone first and last slides dynamically
function setupInfiniteSlider() {
    const slides = Array.from(sliderContainer.children);
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[slides.length - 1].cloneNode(true);
    
    firstSlideClone.id = 'slide1-clone';
    lastSlideClone.id = 'slide5-clone';
    
    sliderContainer.appendChild(firstSlideClone);
    sliderContainer.insertBefore(lastSlideClone, slides[0]);
    
    // Initialize slider position to first real slide
    const slideWidth = sliderContainer.clientWidth;
    sliderContainer.scrollLeft = slideWidth;
}

// Initialize infinite slider after page load
window.addEventListener('load', setupInfiniteSlider);

// Handle infinite scroll
sliderContainer.addEventListener('scroll', () => {
    const slideWidth = sliderContainer.clientWidth;
    const maxScroll = sliderContainer.scrollWidth - slideWidth;
    
    // If we're at the clone of the last slide (beginning)
    if (sliderContainer.scrollLeft === 0) {
        // Disable smooth scrolling temporarily
        sliderContainer.style.scrollBehavior = 'auto';
        // Jump to the real last slide
        sliderContainer.scrollLeft = maxScroll - slideWidth;
        // Re-enable smooth scrolling
        setTimeout(() => {
            sliderContainer.style.scrollBehavior = 'smooth';
        }, 10);
        currentSlide = 5;
    }
    // If we're at the clone of the first slide (end)
    else if (sliderContainer.scrollLeft === maxScroll) {
        // Disable smooth scrolling temporarily
        sliderContainer.style.scrollBehavior = 'auto';
        // Jump to the real first slide
        sliderContainer.scrollLeft = slideWidth;
        // Re-enable smooth scrolling
        setTimeout(() => {
            sliderContainer.style.scrollBehavior = 'smooth';
        }, 10);
        currentSlide = 1;
    }
    // Update current slide based on scroll position
    else {
        currentSlide = Math.round(sliderContainer.scrollLeft / slideWidth);
    }
    updatebars();
});

// Handle bar clicks with infinite loop
bars.forEach(bar => {
    bar.addEventListener('click', () => {
        const slideNumber = parseInt(bar.getAttribute('data-slide'));
        const slideWidth = sliderContainer.clientWidth;
        
        // Add 1 to account for the cloned slide at the beginning
        sliderContainer.scrollTo({
            left: slideWidth * slideNumber,
            behavior: 'smooth'
        });
        
        // Update current slide
        currentSlide = slideNumber;
        updatebars();
        
        // Stop and restart auto slide
        stopAutoSlide();
        setTimeout(startAutoSlide, 0);
    });
});

function updatebars() {
    bars.forEach((bar, index) => {
        if (index + 1 === currentSlide) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}

// Auto slide variables
let autoSlideInterval;
const AUTO_SLIDE_INTERVAL = 3000; // Change slide every 3 seconds

// Start auto slide function
function startAutoSlide() {
    // Clear any existing interval first
    stopAutoSlide();
    
    // Start new interval
    autoSlideInterval = setInterval(() => {
        const slideWidth = sliderContainer.clientWidth;
        const maxScroll = sliderContainer.scrollWidth - slideWidth;
        
        if (sliderContainer.scrollLeft >= maxScroll) {
            sliderContainer.scrollTo({
                left: slideWidth,
                behavior: 'smooth'
            });
            currentSlide = 1;
        } else {
            // Move to next slide
            sliderContainer.scrollTo({
                left: sliderContainer.scrollLeft + slideWidth,
                behavior: 'smooth'
            });
            currentSlide++;
        }
        updatebars();
    }, AUTO_SLIDE_INTERVAL);
}

// Stop auto slide function
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Stop auto slide when mouse enters slider
sliderContainer.addEventListener('mouseenter', stopAutoSlide);

// Restart auto slide when mouse leaves slider
sliderContainer.addEventListener('mouseleave', () => {
    setTimeout(startAutoSlide, 0);
});

// Start auto slide when page loads
startAutoSlide();

// Handle touch events
sliderContainer.addEventListener('touchstart', stopAutoSlide);
sliderContainer.addEventListener('touchend', startAutoSlide);