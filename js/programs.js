document.addEventListener('DOMContentLoaded', () => {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        const toggleDetails = (event) => {
            // Prevent click from bubbling if clicking the button directly
            if (event.target.closest('.program-dropdown-btn')) {
                return;
            }

            const btn = card.querySelector('.program-dropdown-btn');
            const details = card.querySelector('.program-details');
            
            const isActive = details.classList.contains('active');
            
            if (isActive) {
                details.classList.remove('active');
                btn.classList.remove('active');
            } else {
                details.classList.add('active');
                btn.classList.add('active');
            }
        };

        // Handle click events
        card.addEventListener('click', toggleDetails);

        // Handle keyboard events
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDetails(event);
            }
        });
    });
}); 