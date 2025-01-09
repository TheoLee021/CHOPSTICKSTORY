document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtns = document.querySelectorAll('.program-dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.nextElementSibling;
            const isActive = details.classList.contains('active');
            
            // Toggle only the clicked dropdown
            if (isActive) {
                details.classList.remove('active');
                btn.classList.remove('active');
            } else {
                details.classList.add('active');
                btn.classList.add('active');
            }
        });
    });
}); 