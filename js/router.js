const Router = {
    currentPage: 'landing',
    
    init() {
        console.log('🔀 Router initialized');
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        console.log('👂 Escuchando clicks...');
        
        document.addEventListener('click', (e) => {
            console.log('🖱️ Click detectado en:', e.target);
            
            // Si el elemento o su padre tiene data-nav
            const navElement = e.target.closest('[data-nav]');
            
            if (navElement) {
                const nav = navElement.dataset.nav;
                console.log('✅ [data-nav] encontrado:', nav);
                
                e.preventDefault();
                e.stopPropagation();
                
                let targetPage = nav;
                if (targetPage === 'back') targetPage = 'landing';
                
                this.goTo(targetPage);
            } else {
                console.log('❌ [data-nav] NO encontrado');
            }
        });
    },
    
    goTo(page) {
        console.log(`🎬 goTo(${page}) - página actual: ${this.currentPage}`);
        
        const current = document.getElementById(`${this.currentPage}-page`);
        const next = document.getElementById(`${page}-page`);
        
        if (!current) {
            console.error('❌ Página actual no encontrada:', this.currentPage);
            return;
        }
        
        if (!next) {
            console.error('❌ Página siguiente no encontrada:', page);
            return;
        }
        
        console.log('✅ Iniciando transición...');
        
        // Fade out página actual
        current.classList.add('page-exit');
        current.classList.remove('active');
        
        setTimeout(() => {
            current.classList.add('hidden');
            current.classList.remove('page-exit');
            
            // Fade in página siguiente
            next.classList.remove('hidden');
            next.classList.add('fade-in', 'active');
            
            window.scrollTo(0, 0);
            this.currentPage = page;
            
            console.log('✅ Transición completada. Página actual:', this.currentPage);
        }, 300);
    }
};

// Iniciar router
document.addEventListener('DOMContentLoaded', () => Router.init());