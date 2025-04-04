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

// Behold Instagram Feed
async function loadBeholdFeed() {
    // Behold에서 제공한 JSON Feed URL
    const BEHOLD_FEED_URL = 'https://feeds.behold.so/QmrH8sxjg7rmJixicWYy';
    
    try {
        const response = await fetch(BEHOLD_FEED_URL);
        const data = await response.json();
        
        const instagramGrid = document.getElementById('instagram-grid');
        instagramGrid.innerHTML = '';

        // behold.json 구조에 맞게 데이터 추출
        // posts 배열에 최대 6개 포스트만 표시
        const posts = data.posts?.slice(0, 6) || [];
        
        posts.forEach(post => {
            // 미디어 URL 결정 (sizes.medium 또는 대체 이미지)
            let mediaUrl;
            if (post.mediaType === 'VIDEO' && post.thumbnailUrl) {
                // 비디오인 경우 썸네일 사용
                mediaUrl = post.thumbnailUrl;
            } else if (post.sizes && post.sizes.medium) {
                // medium 사이즈 이미지 사용
                mediaUrl = post.sizes.medium.mediaUrl;
            } else {
                // 기본 미디어 URL 사용
                mediaUrl = post.mediaUrl;
            }
            
            // 캡션 정리 (짧은 버전 사용)
            const caption = post.prunedCaption || post.caption || '';
            
            // 포스트 타입에 따른 아이콘 추가
            const isVideo = post.mediaType === 'VIDEO' || post.isReel;
            const icon = isVideo ? '<i class="fa-solid fa-play post-icon"></i>' : '';
            
            const postElement = document.createElement('a');
            postElement.href = post.permalink;
            postElement.target = '_blank';
            postElement.rel = 'noopener';
            postElement.className = `instagram-post ${isVideo ? 'video-post' : ''}`;
            postElement.innerHTML = `
                <img src="${mediaUrl}" alt="${caption ? caption.slice(0, 100) : 'Instagram post'}" loading="lazy">
                ${icon}
                <div class="post-overlay">
                    <span class="post-likes">
                        <i class="fa-solid fa-heart"></i>
                    </span>
                </div>
            `;
            instagramGrid.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading Behold Instagram feed:', error);
        // 에러 발생 시 대체 콘텐츠 표시
        const instagramGrid = document.getElementById('instagram-grid');
        instagramGrid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
                <p>Instagram 피드를 불러오는 중 문제가 발생했습니다.</p>
                <a href="https://www.instagram.com/chopstickstory/" target="_blank">Instagram에서 직접 보기</a>
            </div>
        `;
    }
}

// Instagram 피드 로드
if (document.getElementById('instagram-grid')) {
    loadBeholdFeed();
}