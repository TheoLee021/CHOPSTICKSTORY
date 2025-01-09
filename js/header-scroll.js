document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // 스크롤 방향에 따라 헤더 표시/숨김 처리
    const updateHeader = () => {
        const currentScrollY = window.scrollY;

        // 스크롤 방향 확인
        if (currentScrollY > lastScrollY) {
            // 아래로 스크롤
            header.classList.add('header--hidden');
        } else {
            // 위로 스크롤
            header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    // 스크롤 이벤트 최적화
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader();
            });
            ticking = true;
        }
    });
}); 