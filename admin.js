// Admin page controller
class AdminPanel {
    constructor() {
        this.currentEditingCommunity = null;
        this.currentEditingListing = null;
        this.builderCount = 0;
        this.homeCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAllContent();
        this.updateColorPreview();
    }

    setupEventListeners() {
        // Community form submission
        document.getElementById('community-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCommunity();
        });

        // Listing form submission
        document.getElementById('listing-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveListing();
        });

        // Color picker update
        document.getElementById('community-primary-color').addEventListener('input', () => {
            this.updateColorPreview();
        });
    }

    renderAllContent() {
        this.renderCommunities();
        this.renderListings();
        this.renderContacts();
        this.populateListingCommunities();
    }

    // Tab management
    showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Hide all tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');
    }

    // Community management
    renderCommunities() {
        const container = document.getElementById('communities-list');
        const communities = DataService.getCommunities();
        
        container.innerHTML = '';
        
        if (communities.length === 0) {
            container.innerHTML = '<p class="empty-state">No communities found. Add your first community to get started.</p>';
            return;
        }

        communities.forEach(community => {
            const communityCard = document.createElement('div');
            communityCard.className = 'admin-item-card';
            communityCard.innerHTML = `
                <div class="admin-item-header">
                    <h3>${community.name}</h3>
                    <div class="admin-item-actions">
                        <button class="btn btn-secondary" onclick="adminPanel.editCommunity('${community.id}')">
                            <span class="material-icons">edit</span>
                            Edit
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.viewCommunity('${community.id}')">
                            <span class="material-icons">visibility</span>
                            View
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.deleteCommunity('${community.id}')">
                            <span class="material-icons">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
                <div class="admin-item-details">
                    <p><strong>Location:</strong> ${community.location}</p>
                    <p><strong>Description:</strong> ${community.description}</p>
                    <p><strong>Price Range:</strong> ${community.priceRange}</p>
                    <p><strong>Amenities:</strong> ${community.amenities.length} items</p>
                    <p><strong>Builders:</strong> ${community.builders.length} builders</p>
                    <p><strong>Homes:</strong> ${community.homes.length} models</p>
                </div>
            `;
            container.appendChild(communityCard);
        });
    }

    showAddCommunityForm() {
        this.currentEditingCommunity = null;
        this.resetCommunityForm();
        document.getElementById('community-form-title').textContent = 'Add New Community';
        document.getElementById('community-form').style.display = 'block';
        document.getElementById('community-form').scrollIntoView({ behavior: 'smooth' });
    }

    hideCommunityForm() {
        document.getElementById('community-form').style.display = 'none';
        this.resetCommunityForm();
    }

    resetCommunityForm() {
        document.getElementById('community-form-element').reset();
        document.getElementById('community-primary-color').value = '#1976d2';
        document.getElementById('community-border-radius').value = '8px';
        document.getElementById('community-border-radius-large').value = '16px';
        document.getElementById('homes-title').value = 'Available Homes';
        document.getElementById('builders-title').value = 'Our Builders';
        
        // Reset checkboxes
        document.getElementById('hero-visible').checked = true;
        document.getElementById('about-visible').checked = true;
        document.getElementById('homes-visible').checked = true;
        document.getElementById('builders-visible').checked = true;
        
        // Clear dynamic sections
        document.getElementById('builders-container').innerHTML = '';
        document.getElementById('homes-container').innerHTML = '';
        this.builderCount = 0;
        this.homeCount = 0;
        
        this.updateColorPreview();
    }

    editCommunity(communityId) {
        const community = DataService.getCommunity(communityId);
        if (!community) return;
        
        this.currentEditingCommunity = community;
        this.populateCommunityForm(community);
        document.getElementById('community-form-title').textContent = 'Edit Community';
        document.getElementById('community-form').style.display = 'block';
        document.getElementById('community-form').scrollIntoView({ behavior: 'smooth' });
    }

    populateCommunityForm(community) {
        document.getElementById('community-name').value = community.name;
        document.getElementById('community-location').value = community.location;
        document.getElementById('community-description').value = community.description;
        document.getElementById('community-price-range').value = community.priceRange;
        document.getElementById('community-primary-color').value = community.theme.primaryColor;
        document.getElementById('community-border-radius').value = community.theme.borderRadius;
        document.getElementById('community-border-radius-large').value = community.theme.borderRadiusLarge;
        document.getElementById('community-amenities').value = community.amenities.join('\n');
        
        // Section visibility
        document.getElementById('hero-visible').checked = community.sections.hero.visible;
        document.getElementById('about-visible').checked = community.sections.about.visible;
        document.getElementById('homes-visible').checked = community.sections.homes.visible;
        document.getElementById('builders-visible').checked = community.sections.builders.visible;
        
        // Section content
        document.getElementById('hero-title').value = community.sections.hero.title || '';
        document.getElementById('hero-subtitle').value = community.sections.hero.subtitle || '';
        document.getElementById('about-content').value = community.sections.about.content || '';
        document.getElementById('homes-title').value = community.sections.homes.title || 'Available Homes';
        document.getElementById('builders-title').value = community.sections.builders.title || 'Our Builders';
        
        // Clear and populate builders
        this.builderCount = 0;
        document.getElementById('builders-container').innerHTML = '';
        community.builders.forEach(builder => {
            this.addBuilder(builder);
        });
        
        // Clear and populate homes
        this.homeCount = 0;
        document.getElementById('homes-container').innerHTML = '';
        community.homes.forEach(home => {
            this.addHome(home);
        });
        
        this.updateColorPreview();
    }

    addBuilder(builderData = null) {
        this.builderCount++;
        const container = document.getElementById('builders-container');
        const builderDiv = document.createElement('div');
        builderDiv.className = 'dynamic-item';
        builderDiv.innerHTML = `
            <div class="dynamic-item-header">
                <h4>Builder ${this.builderCount}</h4>
                <button type="button" class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-icons">delete</span>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Builder Name</label>
                    <input type="text" class="form-input builder-name" value="${builderData ? builderData.name : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contact</label>
                    <input type="text" class="form-input builder-contact" value="${builderData ? builderData.contact : ''}" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea builder-description" required>${builderData ? builderData.description : ''}</textarea>
            </div>
        `;
        container.appendChild(builderDiv);
    }

    addHome(homeData = null) {
        this.homeCount++;
        const container = document.getElementById('homes-container');
        const homeDiv = document.createElement('div');
        homeDiv.className = 'dynamic-item';
        homeDiv.innerHTML = `
            <div class="dynamic-item-header">
                <h4>Home Model ${this.homeCount}</h4>
                <button type="button" class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-icons">delete</span>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Model Name</label>
                    <input type="text" class="form-input home-name" value="${homeData ? homeData.name : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Price</label>
                    <input type="number" class="form-input home-price" value="${homeData ? homeData.price : ''}" min="0" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Square Feet</label>
                    <input type="number" class="form-input home-sqft" value="${homeData ? homeData.sqft : ''}" min="0" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Bedrooms</label>
                    <input type="number" class="form-input home-bedrooms" value="${homeData ? homeData.bedrooms : ''}" min="0" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Bathrooms</label>
                <input type="number" class="form-input home-bathrooms" value="${homeData ? homeData.bathrooms : ''}" min="0" step="0.5" required>
            </div>
        `;
        container.appendChild(homeDiv);
    }

    saveCommunity() {
        const formData = this.getCommunityFormData();
        if (!formData) return;
        
        let community;
        if (this.currentEditingCommunity) {
            community = new Community({
                ...this.currentEditingCommunity,
                ...formData
            });
        } else {
            community = new Community(formData);
        }
        
        DataService.saveCommunity(community);
        UIUtils.showNotification('Community saved successfully!', 'success');
        
        this.hideCommunityForm();
        this.renderCommunities();
        this.populateListingCommunities();
    }

    getCommunityFormData() {
        const name = document.getElementById('community-name').value.trim();
        const location = document.getElementById('community-location').value.trim();
        const description = document.getElementById('community-description').value.trim();
        
        if (!name || !location || !description) {
            UIUtils.showNotification('Please fill in all required fields.', 'error');
            return null;
        }
        
        // Get builders
        const builders = [];
        document.querySelectorAll('#builders-container .dynamic-item').forEach(item => {
            const name = item.querySelector('.builder-name').value.trim();
            const contact = item.querySelector('.builder-contact').value.trim();
            const description = item.querySelector('.builder-description').value.trim();
            
            if (name && contact && description) {
                builders.push({ name, contact, description });
            }
        });
        
        // Get homes
        const homes = [];
        document.querySelectorAll('#homes-container .dynamic-item').forEach(item => {
            const name = item.querySelector('.home-name').value.trim();
            const price = parseFloat(item.querySelector('.home-price').value);
            const sqft = parseInt(item.querySelector('.home-sqft').value);
            const bedrooms = parseInt(item.querySelector('.home-bedrooms').value);
            const bathrooms = parseFloat(item.querySelector('.home-bathrooms').value);
            
            if (name && price && sqft && bedrooms && bathrooms) {
                homes.push({ name, price, sqft, bedrooms, bathrooms });
            }
        });
        
        // Get amenities
        const amenities = document.getElementById('community-amenities').value
            .split('\n')
            .map(amenity => amenity.trim())
            .filter(amenity => amenity.length > 0);
        
        return {
            name,
            location,
            description,
            priceRange: document.getElementById('community-price-range').value.trim(),
            amenities,
            builders,
            homes,
            theme: {
                primaryColor: document.getElementById('community-primary-color').value,
                borderRadius: document.getElementById('community-border-radius').value,
                borderRadiusLarge: document.getElementById('community-border-radius-large').value
            },
            sections: {
                hero: {
                    visible: document.getElementById('hero-visible').checked,
                    title: document.getElementById('hero-title').value.trim(),
                    subtitle: document.getElementById('hero-subtitle').value.trim()
                },
                about: {
                    visible: document.getElementById('about-visible').checked,
                    content: document.getElementById('about-content').value.trim()
                },
                homes: {
                    visible: document.getElementById('homes-visible').checked,
                    title: document.getElementById('homes-title').value.trim()
                },
                builders: {
                    visible: document.getElementById('builders-visible').checked,
                    title: document.getElementById('builders-title').value.trim()
                }
            }
        };
    }

    viewCommunity(communityId) {
        window.open(`community.html?id=${communityId}`, '_blank');
    }

    deleteCommunity(communityId) {
        if (confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
            DataService.deleteCommunity(communityId);
            UIUtils.showNotification('Community deleted successfully!', 'success');
            this.renderCommunities();
            this.populateListingCommunities();
        }
    }

    updateColorPreview() {
        const color = document.getElementById('community-primary-color').value;
        document.getElementById('color-preview').style.backgroundColor = color;
    }

    // Listing management
    renderListings() {
        const container = document.getElementById('listings-list');
        const listings = DataService.getListings();
        
        container.innerHTML = '';
        
        if (listings.length === 0) {
            container.innerHTML = '<p class="empty-state">No listings found. Add your first listing to get started.</p>';
            return;
        }

        listings.forEach(listing => {
            const community = listing.communityId ? DataService.getCommunity(listing.communityId) : null;
            const listingCard = document.createElement('div');
            listingCard.className = 'admin-item-card';
            listingCard.innerHTML = `
                <div class="admin-item-header">
                    <h3>${listing.title}</h3>
                    <div class="admin-item-actions">
                        <button class="btn btn-secondary" onclick="adminPanel.editListing('${listing.id}')">
                            <span class="material-icons">edit</span>
                            Edit
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.viewListing('${listing.id}')">
                            <span class="material-icons">visibility</span>
                            View
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.deleteListing('${listing.id}')">
                            <span class="material-icons">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
                <div class="admin-item-details">
                    <p><strong>Address:</strong> ${listing.address}</p>
                    <p><strong>Price:</strong> ${UIUtils.formatPrice(listing.price)}</p>
                    <p><strong>Community:</strong> ${community ? community.name : 'None'}</p>
                    <p><strong>Bedrooms:</strong> ${listing.bedrooms} | <strong>Bathrooms:</strong> ${listing.bathrooms} | <strong>Sq Ft:</strong> ${listing.sqft.toLocaleString()}</p>
                    <p><strong>Type:</strong> ${listing.type} | <strong>Status:</strong> ${listing.status}</p>
                </div>
            `;
            container.appendChild(listingCard);
        });
    }

    showAddListingForm() {
        this.currentEditingListing = null;
        this.resetListingForm();
        document.getElementById('listing-form-title').textContent = 'Add New Listing';
        document.getElementById('listing-form').style.display = 'block';
        document.getElementById('listing-form').scrollIntoView({ behavior: 'smooth' });
    }

    hideListingForm() {
        document.getElementById('listing-form').style.display = 'none';
        this.resetListingForm();
    }

    resetListingForm() {
        document.getElementById('listing-form-element').reset();
    }

    editListing(listingId) {
        const listing = DataService.getListing(listingId);
        if (!listing) return;
        
        this.currentEditingListing = listing;
        this.populateListingForm(listing);
        document.getElementById('listing-form-title').textContent = 'Edit Listing';
        document.getElementById('listing-form').style.display = 'block';
        document.getElementById('listing-form').scrollIntoView({ behavior: 'smooth' });
    }

    populateListingForm(listing) {
        document.getElementById('listing-title').value = listing.title;
        document.getElementById('listing-address').value = listing.address;
        document.getElementById('listing-description').value = listing.description;
        document.getElementById('listing-price').value = listing.price;
        document.getElementById('listing-community').value = listing.communityId || '';
        document.getElementById('listing-bedrooms').value = listing.bedrooms;
        document.getElementById('listing-bathrooms').value = listing.bathrooms;
        document.getElementById('listing-sqft').value = listing.sqft;
        document.getElementById('listing-type').value = listing.type;
        document.getElementById('listing-status').value = listing.status;
    }

    saveListing() {
        const formData = this.getListingFormData();
        if (!formData) return;
        
        let listing;
        if (this.currentEditingListing) {
            listing = new Listing({
                ...this.currentEditingListing,
                ...formData
            });
        } else {
            listing = new Listing(formData);
        }
        
        DataService.saveListing(listing);
        UIUtils.showNotification('Listing saved successfully!', 'success');
        
        this.hideListingForm();
        this.renderListings();
    }

    getListingFormData() {
        const title = document.getElementById('listing-title').value.trim();
        const address = document.getElementById('listing-address').value.trim();
        const description = document.getElementById('listing-description').value.trim();
        const price = parseFloat(document.getElementById('listing-price').value);
        const bedrooms = parseInt(document.getElementById('listing-bedrooms').value);
        const bathrooms = parseFloat(document.getElementById('listing-bathrooms').value);
        const sqft = parseInt(document.getElementById('listing-sqft').value);
        
        if (!title || !address || !description || !price || !bedrooms || !bathrooms || !sqft) {
            UIUtils.showNotification('Please fill in all required fields.', 'error');
            return null;
        }
        
        return {
            title,
            address,
            description,
            price,
            bedrooms,
            bathrooms,
            sqft,
            communityId: document.getElementById('listing-community').value || null,
            type: document.getElementById('listing-type').value,
            status: document.getElementById('listing-status').value
        };
    }

    viewListing(listingId) {
        window.open(`listing.html?id=${listingId}`, '_blank');
    }

    deleteListing(listingId) {
        if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            DataService.deleteListing(listingId);
            UIUtils.showNotification('Listing deleted successfully!', 'success');
            this.renderListings();
        }
    }

    populateListingCommunities() {
        const select = document.getElementById('listing-community');
        const communities = DataService.getCommunities();
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        communities.forEach(community => {
            const option = document.createElement('option');
            option.value = community.id;
            option.textContent = community.name;
            select.appendChild(option);
        });
    }

    // Contact management
    renderContacts() {
        const container = document.getElementById('contacts-list');
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        
        container.innerHTML = '';
        
        if (contacts.length === 0) {
            container.innerHTML = '<p class="empty-state">No contact inquiries yet.</p>';
            return;
        }

        contacts.reverse().forEach((contact, index) => {
            const contactCard = document.createElement('div');
            contactCard.className = 'admin-item-card';
            contactCard.innerHTML = `
                <div class="admin-item-header">
                    <h3>${contact.name}</h3>
                    <div class="admin-item-actions">
                        <button class="btn btn-secondary" onclick="adminPanel.deleteContact(${contacts.length - 1 - index})">
                            <span class="material-icons">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
                <div class="admin-item-details">
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone}</p>
                    <p><strong>Property:</strong> ${contact.listingTitle}</p>
                    <p><strong>Date:</strong> ${UIUtils.formatDate(contact.timestamp)}</p>
                    <p><strong>Message:</strong></p>
                    <p class="contact-message">${contact.message}</p>
                </div>
            `;
            container.appendChild(contactCard);
        });
    }

    deleteContact(index) {
        if (confirm('Are you sure you want to delete this contact inquiry?')) {
            const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.splice(index, 1);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            this.renderContacts();
            UIUtils.showNotification('Contact inquiry deleted successfully!', 'success');
        }
    }

    clearAllContacts() {
        if (confirm('Are you sure you want to clear all contact inquiries? This action cannot be undone.')) {
            localStorage.removeItem('contacts');
            this.renderContacts();
            UIUtils.showNotification('All contact inquiries cleared!', 'success');
        }
    }
}

// Global functions for HTML onclick handlers
function showTab(tabName) {
    adminPanel.showTab(tabName);
}

function showAddCommunityForm() {
    adminPanel.showAddCommunityForm();
}

function hideCommunityForm() {
    adminPanel.hideCommunityForm();
}

function showAddListingForm() {
    adminPanel.showAddListingForm();
}

function hideListingForm() {
    adminPanel.hideListingForm();
}

function addBuilder() {
    adminPanel.addBuilder();
}

function addHome() {
    adminPanel.addHome();
}

function clearAllContacts() {
    adminPanel.clearAllContacts();
}

// Additional CSS for admin-specific styling
const adminStyles = `
    .admin-header {
        text-align: center;
        margin-bottom: var(--spacing-xl);
    }

    .admin-header h1 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
    }

    .admin-header p {
        color: var(--text-secondary);
        font-size: 1.125rem;
    }

    .admin-tabs {
        display: flex;
        background-color: var(--surface-color);
        border-radius: var(--border-radius-large);
        box-shadow: var(--elevation-1);
        margin-bottom: var(--spacing-lg);
        overflow: hidden;
    }

    .tab-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-md);
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
    }

    .tab-button:hover {
        background-color: rgba(25, 118, 210, 0.04);
        color: var(--primary-color);
    }

    .tab-button.active {
        background-color: var(--primary-color);
        color: white;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
    }

    .section-header h2 {
        color: var(--text-primary);
        margin-bottom: 0;
    }

    .admin-item-card {
        background-color: var(--surface-color);
        border-radius: var(--border-radius-large);
        box-shadow: var(--elevation-1);
        padding: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
    }

    .admin-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .admin-item-header h3 {
        color: var(--text-primary);
        margin-bottom: 0;
    }

    .admin-item-actions {
        display: flex;
        gap: var(--spacing-xs);
    }

    .admin-item-actions .btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: 0.875rem;
    }

    .admin-item-details {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .admin-item-details p {
        margin-bottom: var(--spacing-xs);
    }

    .contact-message {
        background-color: var(--background-color);
        padding: var(--spacing-sm);
        border-radius: var(--border-radius);
        margin-top: var(--spacing-xs);
        font-style: italic;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
    }

    .form-section {
        margin-bottom: var(--spacing-lg);
        padding: var(--spacing-lg);
        background-color: var(--background-color);
        border-radius: var(--border-radius);
    }

    .form-section h3 {
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
    }

    .form-actions {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: flex-end;
        margin-top: var(--spacing-lg);
    }

    .dynamic-item {
        background-color: var(--surface-color);
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-md);
        box-shadow: var(--elevation-1);
    }

    .dynamic-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .dynamic-item-header h4 {
        color: var(--text-primary);
        margin-bottom: 0;
    }

    .empty-state {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        padding: var(--spacing-xl);
    }

    @media (max-width: 768px) {
        .admin-tabs {
            flex-direction: column;
        }
        
        .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
        
        .admin-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
        
        .admin-item-actions {
            width: 100%;
            justify-content: flex-start;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .form-actions {
            flex-direction: column;
        }
    }
`;

// Inject admin-specific styles
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
}); 