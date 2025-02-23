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

// Dropdown Menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    // Make all dropdowns active by default
    dropdowns.forEach(dropdown => {
        dropdown.classList.add('active');
        
        const trigger = dropdown.querySelector('.dropdown-trigger');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
});

// Slider code should only run if slider exists
if (document.querySelector('.slider-container')) {
    // Slider Navigation
    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
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
            sliderContainer.style.scrollBehavior = 'auto';
            sliderContainer.scrollLeft = maxScroll - slideWidth;
            setTimeout(() => {
                sliderContainer.style.scrollBehavior = 'smooth';
            }, 10);
            currentSlide = 5;
        }
        // If we're at the clone of the first slide (end)
        else if (sliderContainer.scrollLeft === maxScroll) {
            sliderContainer.style.scrollBehavior = 'auto';
            sliderContainer.scrollLeft = slideWidth;
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
            
            sliderContainer.scrollTo({
                left: slideWidth * slideNumber,
                behavior: 'smooth'
            });
            
            currentSlide = slideNumber;
            updatebars();
            
            stopAutoSlide();
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
    const AUTO_SLIDE_INTERVAL = 3000;

    function startAutoSlide() {
        stopAutoSlide();
        
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
                sliderContainer.scrollTo({
                    left: sliderContainer.scrollLeft + slideWidth,
                    behavior: 'smooth'
                });
                currentSlide++;
            }
            updatebars();
        }, AUTO_SLIDE_INTERVAL);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Stop auto slide when mouse enters slider wrapper
    sliderWrapper.addEventListener('mouseenter', stopAutoSlide);

    // Restart auto slide when mouse leaves slider wrapper
    sliderWrapper.addEventListener('mouseleave', () => {
        setTimeout(startAutoSlide, 0);
    });

    // Handle touch events
    sliderWrapper.addEventListener('touchstart', stopAutoSlide);
    sliderWrapper.addEventListener('touchend', () => {
        setTimeout(startAutoSlide, 0);
    });

    // Start auto slide when page loads
    startAutoSlide();
}

// Instagram Feed
async function loadInstagramFeed() {
    const accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN'; // Instagram Access Token을 여기에 입력하세요
    const userId = 'YOUR_INSTAGRAM_USER_ID'; // Instagram User ID를 여기에 입력하세요
    const limit = 6; // 표시할 게시물 수

    try {
        const response = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}&limit=${limit}`);
        const data = await response.json();
        
        const instagramGrid = document.getElementById('instagram-grid');
        instagramGrid.innerHTML = '';

        data.data.forEach(post => {
            const mediaUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const postElement = document.createElement('a');
            postElement.href = post.permalink;
            postElement.target = '_blank';
            postElement.className = 'instagram-post';
            postElement.innerHTML = `
                <img src="${mediaUrl}" alt="${post.caption ? post.caption.slice(0, 100) : 'Instagram post'}" loading="lazy">
            `;
            instagramGrid.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading Instagram feed:', error);
        // 에러 발생 시 대체 콘텐츠 표시
        const instagramGrid = document.getElementById('instagram-grid');
        instagramGrid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
                <p>There was a problem loading your Instagram feed.</p>
                <a href="https://www.instagram.com/chopstickstory/" target="_blank">View directly on Instagram</a>
            </div>
        `;
    }
}

// Instagram 피드 로드
if (document.getElementById('instagram-grid')) {
    loadInstagramFeed();
}