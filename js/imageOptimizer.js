const ImageOptimizer = {
    init() {
        // Lazy loading nativo
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.src = entry.target.dataset.src || entry.target.src;
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(img);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => ImageOptimizer.init());