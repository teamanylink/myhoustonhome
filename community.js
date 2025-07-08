// Community page controller
class CommunityPage {
    constructor() {
        this.communityId = this.getCommunityIdFromUrl();
        this.community = null;
        this.init();
    }

    getCommunityIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    init() {
        if (!this.communityId) {
            window.location.href = 'index.html';
            return;
        }

        this.community = DataService.getCommunity(this.communityId);
        
        if (!this.community) {
            window.location.href = 'index.html';
            return;
        }

        this.applyTheme();
        this.renderContent();
        this.setupEventListeners();
    }

    applyTheme() {
        const root = document.documentElement;
        const theme = this.community.theme;
        
        // Apply theme colors and styles
        root.style.setProperty('--theme-primary', theme.primaryColor);
        root.style.setProperty('--theme-primary-dark', this.darkenColor(theme.primaryColor, 0.1));
        root.style.setProperty('--theme-border-radius', theme.borderRadius);
        root.style.setProperty('--theme-border-radius-large', theme.borderRadiusLarge);
        
        // Update page title
        document.title = `${this.community.name} - MyHoustonHome`;
    }

    darkenColor(color, factor) {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Darken the color
        const darkR = Math.floor(r * (1 - factor));
        const darkG = Math.floor(g * (1 - factor));
        const darkB = Math.floor(b * (1 - factor));
        
        // Convert back to hex
        const toHex = (value) => value.toString(16).padStart(2, '0');
        return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`;
    }

    renderContent() {
        this.renderHeroSection();
        this.renderAboutSection();
        this.renderHomesSection();
        this.renderBuildersSection();
        this.manageSectionVisibility();
    }

    renderHeroSection() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        
        if (this.community.sections.hero.title) {
            heroTitle.textContent = this.community.sections.hero.title;
        } else {
            heroTitle.textContent = `Welcome to ${this.community.name}`;
        }
        
        if (this.community.sections.hero.subtitle) {
            heroSubtitle.textContent = this.community.sections.hero.subtitle;
        } else {
            heroSubtitle.textContent = this.community.description;
        }
    }

    renderAboutSection() {
        const aboutText = document.getElementById('about-text');
        const amenitiesGrid = document.getElementById('amenities-grid');
        
        if (this.community.sections.about.content) {
            aboutText.innerHTML = `<p>${this.community.sections.about.content}</p>`;
        }
        
        // Render amenities
        amenitiesGrid.innerHTML = '';
        this.community.amenities.forEach(amenity => {
            const amenityItem = document.createElement('div');
            amenityItem.className = 'amenity-item';
            amenityItem.innerHTML = `
                <span class="material-icons">check_circle</span>
                <span>${amenity}</span>
            `;
            amenitiesGrid.appendChild(amenityItem);
        });
    }

    renderHomesSection() {
        const homesTitle = document.getElementById('homes-title');
        const homesGrid = document.getElementById('homes-grid');
        
        if (this.community.sections.homes.title) {
            homesTitle.textContent = this.community.sections.homes.title;
        }
        
        homesGrid.innerHTML = '';
        this.community.homes.forEach(home => {
            const homeCard = document.createElement('div');
            homeCard.className = 'home-card';
            homeCard.innerHTML = `
                <h3 class="card-title">${home.name}</h3>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <span class="material-icons">square_foot</span>
                        <span>${home.sqft.toLocaleString()} sqft</span>
                    </div>
                    <div class="card-meta-item">
                        <span class="material-icons">hotel</span>
                        <span>${home.bedrooms} bed</span>
                    </div>
                    <div class="card-meta-item">
                        <span class="material-icons">bathtub</span>
                        <span>${home.bathrooms} bath</span>
                    </div>
                </div>
                <div class="card-price">${UIUtils.formatPrice(home.price)}</div>
                <button class="btn btn-primary" onclick="this.contactBuilder('${home.name}')">
                    <span class="material-icons">contact_page</span>
                    Learn More
                </button>
            `;
            homesGrid.appendChild(homeCard);
        });
    }

    renderBuildersSection() {
        const buildersTitle = document.getElementById('builders-title');
        const buildersGrid = document.getElementById('builders-grid');
        
        if (this.community.sections.builders.title) {
            buildersTitle.textContent = this.community.sections.builders.title;
        }
        
        buildersGrid.innerHTML = '';
        this.community.builders.forEach(builder => {
            const builderCard = document.createElement('div');
            builderCard.className = 'builder-card';
            builderCard.innerHTML = `
                <h3 class="card-title">${builder.name}</h3>
                <p class="card-description">${builder.description}</p>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <span class="material-icons">phone</span>
                        <span>${builder.contact}</span>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="this.contactBuilder('${builder.name}')">
                    <span class="material-icons">contact_phone</span>
                    Contact Builder
                </button>
            `;
            buildersGrid.appendChild(builderCard);
        });
    }

    manageSectionVisibility() {
        const sections = this.community.sections;
        
        // Hero section
        const heroSection = document.getElementById('hero-section');
        if (!sections.hero.visible) {
            heroSection.classList.add('hidden');
        }
        
        // About section
        const aboutSection = document.getElementById('about-section');
        if (!sections.about.visible) {
            aboutSection.classList.add('hidden');
        }
        
        // Homes section
        const homesSection = document.getElementById('homes-section');
        if (!sections.homes.visible) {
            homesSection.classList.add('hidden');
        }
        
        // Builders section
        const buildersSection = document.getElementById('builders-section');
        if (!sections.builders.visible) {
            buildersSection.classList.add('hidden');
        }
    }

    contactBuilder(name) {
        UIUtils.showNotification(`Thank you for your interest in ${name}! A builder representative will contact you soon.`, 'success');
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

// Navigation helper
function scrollToSection(sectionId) {
    const element = document.getElementById(`${sectionId}-section`);
    if (element && !element.classList.contains('hidden')) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Additional CSS for community-specific styling
const communityStyles = `
    .about-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-xl);
        margin-top: var(--spacing-lg);
    }

    .about-text {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--text-secondary);
    }

    .amenities-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
    }

    .amenity-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        background-color: var(--surface-color);
        border-radius: var(--border-radius);
        box-shadow: var(--elevation-1);
    }

    .amenity-item .material-icons {
        color: var(--primary-color);
        font-size: 1.25rem;
    }

    .home-card .btn,
    .builder-card .btn {
        width: 100%;
        margin-top: var(--spacing-sm);
    }

    @media (max-width: 768px) {
        .about-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
        }
    }
`;

// Inject community-specific styles
const styleSheet = document.createElement('style');
styleSheet.textContent = communityStyles;
document.head.appendChild(styleSheet);

// Initialize community page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CommunityPage();
}); 