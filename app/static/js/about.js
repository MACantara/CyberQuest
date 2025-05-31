// About page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Animate mission cards on scroll
    const missionCards = document.querySelectorAll('.mission-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const missionObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
            }
        });
    }, observerOptions);
    
    missionCards.forEach(card => {
        missionObserver.observe(card);
    });
    
    // Add hover effects to mission cards
    missionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Counter animation for stats (if you add stats)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Image lazy loading with fade effect
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.style.opacity = '0';
        aboutImage.onload = function() {
            this.style.transition = 'opacity 0.5s ease-in-out';
            this.style.opacity = '1';
        };
    }
    
    // Progressive enhancement for better UX
    const progressiveElements = document.querySelectorAll('[data-progressive]');
    progressiveElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
});
