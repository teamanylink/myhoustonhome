// Listing page controller
class ListingPage {
    constructor() {
        this.listingId = this.getListingIdFromUrl();
        this.listing = null;
        this.community = null;
        this.init();
    }

    getListingIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    init() {
        if (!this.listingId) {
            window.location.href = 'index.html';
            return;
        }

        this.listing = DataService.getListing(this.listingId);
        
        if (!this.listing) {
            window.location.href = 'index.html';
            return;
        }

        // Get community information if available
        if (this.listing.communityId) {
            this.community = DataService.getCommunity(this.listing.communityId);
        }

        this.renderContent();
        this.setupEventListeners();
    }

    renderContent() {
        // Update page title
        document.title = `${this.listing.title} - MyHoustonHome`;

        // Render listing information
        this.renderListingHeader();
        this.renderListingDetails();
        this.renderCommunitySection();
    }

    renderListingHeader() {
        const titleElement = document.getElementById('listing-title');
        const addressElement = document.getElementById('listing-address');
        const priceElement = document.getElementById('listing-price');

        titleElement.textContent = this.listing.title;
        addressElement.querySelector('span:last-child').textContent = this.listing.address;
        priceElement.textContent = UIUtils.formatPrice(this.listing.price);
    }

    renderListingDetails() {
        // Update detail values
        document.getElementById('bedrooms').textContent = this.listing.bedrooms;
        document.getElementById('bathrooms').textContent = this.listing.bathrooms;
        document.getElementById('sqft').textContent = this.listing.sqft.toLocaleString();
        document.getElementById('property-type').textContent = this.capitalizeFirst(this.listing.type);
        document.getElementById('status').textContent = this.capitalizeFirst(this.listing.status);
        
        // Update description
        document.getElementById('description').textContent = this.listing.description || 'No description available.';
    }

    renderCommunitySection() {
        const communitySection = document.getElementById('community-section');
        const communityCard = document.getElementById('community-card');

        if (!this.community) {
            communitySection.style.display = 'none';
            return;
        }

        communityCard.innerHTML = `
            <div class="community-info">
                <h3 class="community-name">${this.community.name}</h3>
                <p class="community-location">${this.community.location}</p>
                <p class="community-description">${this.community.description}</p>
                <div class="community-features">
                    <div class="feature-item">
                        <span class="material-icons">home</span>
                        <span>Price Range: ${this.community.priceRange}</span>
                    </div>
                    <div class="feature-item">
                        <span class="material-icons">pool</span>
                        <span>${this.community.amenities.length} amenities</span>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="this.viewCommunity()">
                    <span class="material-icons">visibility</span>
                    View Community
                </button>
            </div>
        `;
    }

    viewCommunity() {
        window.open(`community.html?id=${this.community.id}`, '_blank');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupEventListeners() {
        // Set up contact form
        this.setupContactForm();
    }

    setupContactForm() {
        const contactMessage = document.getElementById('contact-message');
        
        // Pre-populate message with property information
        const defaultMessage = `Hi! I'm interested in the property "${this.listing.title}" located at ${this.listing.address}. Could you please provide more information?`;
        contactMessage.value = defaultMessage;
    }

    validateContactForm() {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !phone || !message) {
            UIUtils.showNotification('Please fill in all required fields.', 'error');
            return false;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            UIUtils.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    submitContact() {
        if (!this.validateContactForm()) {
            return;
        }

        const contactData = {
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            message: document.getElementById('contact-message').value.trim(),
            listingId: this.listingId,
            listingTitle: this.listing.title,
            timestamp: new Date().toISOString()
        };

        // Save to local storage (in a real app, this would be sent to a server)
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Show success message
        UIUtils.showNotification('Thank you for your interest! We will contact you soon.', 'success');

        // Clear form
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-phone').value = '';
        this.setupContactForm(); // Reset message to default
    }
}

// Global function for contact form submission
function submitContact() {
    if (window.listingPage) {
        window.listingPage.submitContact();
    }
}

// Additional CSS for listing-specific styling
const listingStyles = `
    .listing-header {
        margin: var(--spacing-lg) 0;
    }

    .listing-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--spacing-xl);
        margin-bottom: var(--spacing-xxl);
    }

    .listing-hero {
        background-color: var(--surface-color);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-large);
        box-shadow: var(--elevation-1);
        margin-bottom: var(--spacing-lg);
    }

    .listing-title {
        font-size: 2.5rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
    }

    .listing-address {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
        font-size: 1.125rem;
    }

    .listing-price {
        font-size: 2rem;
        font-weight: 600;
        color: var(--primary-color);
    }

    .listing-details,
    .listing-description,
    .listing-community {
        background-color: var(--surface-color);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-large);
        box-shadow: var(--elevation-1);
        margin-bottom: var(--spacing-lg);
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--background-color);
        border-radius: var(--border-radius);
    }

    .detail-item .material-icons {
        color: var(--primary-color);
        font-size: 1.5rem;
    }

    .detail-label {
        display: block;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .detail-value {
        display: block;
        font-weight: 500;
        color: var(--text-primary);
    }

    .listing-sidebar {
        position: sticky;
        top: calc(var(--spacing-xxl) + 60px);
        height: fit-content;
    }

    .contact-card {
        background-color: var(--surface-color);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-large);
        box-shadow: var(--elevation-2);
    }

    .contact-card h3 {
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
    }

    .community-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .community-name {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .community-location {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .community-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .community-features {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        margin: var(--spacing-sm) 0;
    }

    .feature-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .feature-item .material-icons {
        font-size: 1rem;
        color: var(--primary-color);
    }

    @media (max-width: 768px) {
        .listing-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
        }
        
        .listing-sidebar {
            position: static;
        }
        
        .listing-title {
            font-size: 2rem;
        }
        
        .details-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject listing-specific styles
const styleSheet = document.createElement('style');
styleSheet.textContent = listingStyles;
document.head.appendChild(styleSheet);

// Initialize listing page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.listingPage = new ListingPage();
}); 