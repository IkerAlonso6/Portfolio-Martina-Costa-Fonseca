const ProjectDetail = {
    currentProject: null,
    currentChapterIndex: 0,
    
    render(projectId) {
        const project = ProjectLoader.getById(projectId);
        if (!project) {
            console.error('Proyecto no encontrado:', projectId);
            return;
        }
        
        this.currentProject = project;
        this.currentChapterIndex = 0;
        
        const portfolioPage = document.getElementById('portfolio-content');
        
        // Determinar proyecto anterior y siguiente
        const prevProject = projectId > 1 ? ProjectLoader.getById(projectId - 1) : null;
        const nextProject = projectId < ProjectLoader.getAll().length ? ProjectLoader.getById(projectId + 1) : null;
        
        const html = `
            <div class="container project-detail-container">
                <!-- Back button -->
                <button class="project-back" onclick="ProjectDetail.backToProjects()">
                    ← Volver a proyectos
                </button>
                
                <!-- Header del proyecto -->
                <header class="project-detail-header">
                    <h1>${project.title}</h1>
                    <div class="project-meta">
                        <span class="meta-item">${project.year}</span>
                        <span class="meta-divider">•</span>
                        <span class="meta-item">${project.location}</span>
                        <span class="meta-divider">•</span>
                        <span class="meta-item">${project.category}</span>
                    </div>
                    <p class="project-detail-description">${project.description}</p>
                </header>
                
                <!-- Tabs de capítulos -->
                <nav class="chapters-nav">
                    <div class="chapters-list">
                        ${project.chapters.map((chapter, index) => `
                            <button 
                                class="chapter-btn ${index === 0 ? 'active' : ''}"
                                data-chapter-index="${index}">
                                ${chapter.title}
                            </button>
                        `).join('')}
                    </div>
                </nav>
                
                <!-- Contenido del capítulo -->
                <section class="chapter-content" id="chapter-content">
                    <!-- Se llena dinámicamente -->
                </section>
                
                <!-- Navegación entre proyectos -->
                <nav class="projects-navigation">
                    ${prevProject ? `
                        <button class="nav-project-btn prev-project" data-project-id="${prevProject.id}">
                            <span class="nav-arrow">←</span>
                            <div>
                                <span class="nav-label">Proyecto anterior</span>
                                <span class="nav-title">${prevProject.title}</span>
                            </div>
                        </button>
                    ` : '<div></div>'}
                    
                    ${nextProject ? `
                        <button class="nav-project-btn next-project" data-project-id="${nextProject.id}">
                            <div>
                                <span class="nav-label">Siguiente proyecto</span>
                                <span class="nav-title">${nextProject.title}</span>
                            </div>
                            <span class="nav-arrow">→</span>
                        </button>
                    ` : '<div></div>'}
                </nav>
            </div>
        `;
        
        portfolioPage.innerHTML = html;
        this.renderChapter(0);
        this.setupEventListeners();
    },
    
    renderChapter(index) {
        if (!this.currentProject) return;
        
        const chapter = this.currentProject.chapters[index];
        if (!chapter) return;
        
        this.currentChapterIndex = index;
        
        const html = `
            <div class="chapter-wrapper">
                <h2>${chapter.title}</h2>
                <p class="chapter-description">${chapter.description}</p>
                
                <div class="chapter-gallery">
                    ${chapter.images.map((image, i) => `
                        <figure class="gallery-item">
                            <img 
                                src="${image}" 
                                alt="${chapter.title} - Imagen ${i + 1}"
                                class="gallery-image"
                                loading="lazy">
                        </figure>
                    `).join('')}
                </div>
            </div>
        `;
        
        const container = document.getElementById('chapter-content');
        container.innerHTML = html;
        container.classList.add('project-enter');
        
        // Actualizar botón activo
        document.querySelectorAll('.chapter-btn').forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    setupEventListeners() {
        // Clicks en tabs de capítulos
        document.querySelectorAll('.chapter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.chapterIndex);
                this.renderChapter(index);
            });
        });
        
        // Clicks en navegación entre proyectos
        document.querySelectorAll('.nav-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = parseInt(e.currentTarget.dataset.projectId);
                this.render(projectId);
                window.scrollTo(0, 0);
            });
        });
    },

    backToProjects() {
        PortfolioRenderer.render();
        window.scrollTo(0, 0);
    }
};

// Exportar para que Router pueda usarlo
window.ProjectDetail = ProjectDetail;