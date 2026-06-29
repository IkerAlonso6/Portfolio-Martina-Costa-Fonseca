const ProjectLoader = {
    projects: [],
    
    async init() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('No se pudo cargar proyectos');
            this.projects = (await response.json()).projects;
            console.log('Proyectos cargados:', this.projects);
            return true;
        } catch (error) {
            console.error('Error cargando proyectos:', error);
            return false;
        }
    },
    
    getAll() {
        return this.projects;
    },
    
    getById(id) {
        return this.projects.find(p => p.id === id);
    },
    
    getByIndex(index) {
        return this.projects[index];
    }
};

// Renderizar portfolio en HTML
const PortfolioRenderer = {
    currentIndex: 0,
    projects: [],
    
    render() {
        this.projects = ProjectLoader.getAll();
        if (this.projects.length === 0) {
            console.warn('No hay proyectos para renderizar');
            return;
        }

        const portfolioPage = document.getElementById('portfolio-page');
        
        const html = `
            <div class="container portfolio-container">
                <button class="portfolio-back" data-nav="back">
                    ← Volver a inicio
                </button>
                
                <!-- Theme Toggle Button -->
                <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
                
                <section class="portfolio-carousel">
                    <!-- Imagen y contenido -->
                    <div class="carousel-main">
                        <!-- Imagen -->
                        <div class="carousel-image-wrapper">
                            <img 
                                id="carousel-image" 
                                src="${this.projects[0].thumbnail}" 
                                alt="${this.projects[0].title}"
                                class="carousel-image">
                        </div>
                        
                        <!-- Contenido -->
                        <div class="carousel-content">
                            <div class="carousel-number">
                                <span id="carousel-number">01</span>
                            </div>
                            
                            <div class="carousel-info">
                                <span class="carousel-year" id="carousel-year">${this.projects[0].year}</span>
                                <h2 id="carousel-title" class="carousel-title">${this.projects[0].title}</h2>
                                <p class="carousel-location" id="carousel-location">${this.projects[0].location}</p>
                                <p class="carousel-description" id="carousel-description">${this.projects[0].description}</p>
                                
                                <button class="carousel-cta" id="carousel-btn">
                                    Ver proyecto completo →
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navegación -->
                    <div class="carousel-nav">
                        <button class="carousel-btn-prev" id="carousel-prev">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        
                        <div class="carousel-dots">
                            ${this.projects.map((_, i) => `
                                <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
                            `).join('')}
                        </div>
                        
                        <button class="carousel-btn-next" id="carousel-next">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        `;

        portfolioPage.innerHTML = html;
        this.setupEventListeners();
    },

    setupEventListeners() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dots = document.querySelectorAll('.carousel-dot');
        const cta = document.getElementById('carousel-btn');
        
        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                this.goToIndex(parseInt(e.target.dataset.index));
            });
        });
        
        cta.addEventListener('click', () => {
            const project = this.projects[this.currentIndex];
            ProjectDetail.render(project.id);
            window.scrollTo(0, 0);
        });
    },
    
    prev() {
        this.currentIndex = this.currentIndex === 0 ? this.projects.length - 1 : this.currentIndex - 1;
        this.updateCarousel();
    },
    
    next() {
        this.currentIndex = this.currentIndex === this.projects.length - 1 ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    },
    
    goToIndex(index) {
        this.currentIndex = index;
        this.updateCarousel();
    },
    
    updateCarousel() {
        const project = this.projects[this.currentIndex];
        
        // Actualizar imagen
        const image = document.getElementById('carousel-image');
        image.style.opacity = '0';
        
        setTimeout(() => {
            image.src = project.thumbnail;
            image.style.opacity = '1';
        }, 300);
        
        // Actualizar número
        const number = document.getElementById('carousel-number');
        number.textContent = String(this.currentIndex + 1).padStart(2, '0');
        
        // Actualizar info
        document.getElementById('carousel-year').textContent = project.year;
        document.getElementById('carousel-title').textContent = project.title;
        document.getElementById('carousel-location').textContent = project.location;
        document.getElementById('carousel-description').textContent = project.description;
        
        // Actualizar dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            if (i === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
};

// Exportar para acceso global
window.PortfolioRenderer = PortfolioRenderer;

// Cargar proyectos y renderizar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Iniciando carga de proyectos...');
    const loaded = await ProjectLoader.init();
    console.log('📊 Proyectos cargados:', loaded, ProjectLoader.projects.length);
    
    if (loaded) {
        console.log('🎨 Renderizando portfolio...');
        PortfolioRenderer.render();
        console.log('✅ Portfolio renderizado');
    } else {
        console.error('❌ Error al cargar proyectos');
    }
});