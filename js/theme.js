const Theme = {
    storageKey: 'portfolio-theme',
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    
    init() {
        // Obtener tema guardado, por defecto 'light'
        const saved = localStorage.getItem(this.storageKey);
        const theme = saved || 'light';
        
        this.apply(theme);
        this.setupToggle();
    },
    
    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
        this.updateToggleIcon(theme);
    },
    
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        this.apply(next);
    },
    
    setupToggle() {
        const btn = document.getElementById('theme-toggle');
        console.log('Buscando botón theme-toggle:', btn);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('Botón clickeado');
                this.toggle();
            });
        }
    },
    
    updateToggleIcon(theme) {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            const icon = btn.querySelector('svg');
            if (theme === 'dark') {
                // Mostrar icono de luna (está activo modo oscuro)
                icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            }
        }
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => Theme.init());