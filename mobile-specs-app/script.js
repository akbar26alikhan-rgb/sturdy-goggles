// ===== Configuration =====
const CONFIG = {
    API_BASE_URL: 'https://api.api-ninjas.com/v1',
    API_KEY: 'YOUR_API_KEY_HERE', // Will be replaced with actual key or environment variable
    DEBOUNCE_DELAY: 300,
    TIMEOUT_DURATION: 10000,
    MAX_RECENT_SEARCHES: 5,
    STORAGE_KEYS: {
        THEME: 'mobile-specs-theme',
        RECENT_SEARCHES: 'mobile-specs-recent',
        CACHE: 'mobile-specs-cache'
    }
};

// ===== State Management =====
const state = {
    brands: [],
    selectedBrand: null,
    selectedModel: null,
    currentSpecs: null,
    isLoading: false
};

// ===== DOM Elements =====
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    searchForm: document.getElementById('searchForm'),
    brandInput: document.getElementById('brandInput'),
    modelInput: document.getElementById('modelInput'),
    brandDropdown: document.getElementById('brandDropdown'),
    modelDropdown: document.getElementById('modelDropdown'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    recentSearches: document.getElementById('recentSearches'),
    recentList: document.getElementById('recentList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    resultsSection: document.getElementById('resultsSection'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    retryBtn: document.getElementById('retryBtn'),
    specsContainer: document.getElementById('specsContainer'),
    specsHeader: document.getElementById('specsHeader'),
    specsGrid: document.getElementById('specsGrid')
};

// ===== Utility Functions =====
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const fetchWithTimeout = async (url, options, timeout = CONFIG.TIMEOUT_DURATION) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

const formatStorage = (storage) => {
    if (!storage) return 'N/A';
    return storage;
};

const formatBattery = (battery) => {
    if (!battery) return 'N/A';
    return battery;
};

const formatDimensions = (dimensions) => {
    if (!dimensions) return 'N/A';
    return dimensions;
};

// ===== Local Storage Functions =====
const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// ===== Session Storage Functions =====
const getFromSessionStorage = (key) => {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return null;
    }
};

const saveToSessionStorage = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
};

// ===== Theme Functions =====
const initTheme = () => {
    const savedTheme = getFromStorage(CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    saveToStorage(CONFIG.STORAGE_KEYS.THEME, newTheme);
};

// ===== API Functions =====
const searchPhone = async (model) => {
    try {
        const cacheKey = `${CONFIG.STORAGE_KEYS.CACHE}-${model.toLowerCase()}`;
        const cached = getFromSessionStorage(cacheKey);
        
        if (cached) {
            return cached;
        }

        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE_URL}/phonespecs?model=${encodeURIComponent(model)}`,
            {
                headers: {
                    'X-Api-Key': CONFIG.API_KEY
                }
            }
        );

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            }
            throw new Error('Failed to fetch phone specifications.');
        }

        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error('No specifications found for this phone model.');
        }

        saveToSessionStorage(cacheKey, data[0]);
        return data[0];
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
    }
};

// ===== Mock Data for Brands and Models (for demonstration) =====
const MOCK_BRANDS = [
    'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 
    'Realme', 'Nokia', 'Motorola', 'Sony', 'Asus', 'Huawei', 'Honor', 
    'Nothing', 'Poco', 'Redmi', 'LG', 'HTC'
];

const MOCK_MODELS = {
    'Apple': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro', 'iPhone SE'],
    'Samsung': ['Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54'],
    'Google': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6a'],
    'OnePlus': ['OnePlus 11', 'OnePlus 11R', 'OnePlus 10 Pro', 'OnePlus Nord 3'],
    'Xiaomi': ['Xiaomi 13 Pro', 'Xiaomi 13', 'Xiaomi 12 Pro', 'Redmi Note 12 Pro'],
    'Oppo': ['Oppo Find X6 Pro', 'Oppo Reno 10 Pro', 'Oppo Find N3'],
    'Vivo': ['Vivo X90 Pro', 'Vivo V29 Pro', 'Vivo Y100'],
    'Realme': ['Realme GT 3', 'Realme 11 Pro+', 'Realme Narzo 60 Pro'],
    'Nokia': ['Nokia XR21', 'Nokia G60', 'Nokia G22'],
    'Motorola': ['Motorola Edge 40 Pro', 'Motorola Razr 40 Ultra', 'Moto G84'],
    'Sony': ['Sony Xperia 1 V', 'Sony Xperia 5 V', 'Sony Xperia 10 V'],
    'Asus': ['Asus ROG Phone 7', 'Asus Zenfone 10'],
    'Huawei': ['Huawei P60 Pro', 'Huawei Mate 60 Pro'],
    'Honor': ['Honor Magic 5 Pro', 'Honor 90'],
    'Nothing': ['Nothing Phone 2', 'Nothing Phone 1'],
    'Poco': ['Poco F5 Pro', 'Poco X5 Pro'],
    'Redmi': ['Redmi Note 13 Pro+', 'Redmi K60'],
    'LG': ['LG Wing', 'LG V60'],
    'HTC': ['HTC U20', 'HTC Desire 22']
};

const getBrands = async () => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_BRANDS);
        }, 100);
    });
};

const getModels = async (brand) => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_MODELS[brand] || []);
        }, 100);
    });
};

// ===== Autocomplete Functions =====
const showDropdown = (dropdown, items, onSelect) => {
    dropdown.innerHTML = '';
    
    if (items.length === 0) {
        dropdown.innerHTML = '<div class="autocomplete-item loading">No results found</div>';
        dropdown.classList.add('active');
        return;
    }
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = item;
        div.addEventListener('click', () => {
            onSelect(item);
            dropdown.classList.remove('active');
        });
        dropdown.appendChild(div);
    });
    
    dropdown.classList.add('active');
};

const hideDropdown = (dropdown) => {
    dropdown.classList.remove('active');
};

const filterBrands = debounce(async (value) => {
    if (!value.trim()) {
        hideDropdown(elements.brandDropdown);
        return;
    }
    
    if (state.brands.length === 0) {
        state.brands = await getBrands();
    }
    
    const filtered = state.brands.filter(brand => 
        brand.toLowerCase().includes(value.toLowerCase())
    );
    
    showDropdown(elements.brandDropdown, filtered, (brand) => {
        elements.brandInput.value = brand;
        state.selectedBrand = brand;
        enableModelInput();
    });
}, CONFIG.DEBOUNCE_DELAY);

const filterModels = debounce(async (value) => {
    if (!state.selectedBrand) {
        return;
    }
    
    const models = await getModels(state.selectedBrand);
    
    const filtered = value.trim() 
        ? models.filter(model => model.toLowerCase().includes(value.toLowerCase()))
        : models;
    
    showDropdown(elements.modelDropdown, filtered, (model) => {
        elements.modelInput.value = model;
        state.selectedModel = model;
    });
}, CONFIG.DEBOUNCE_DELAY);

const enableModelInput = () => {
    elements.modelInput.disabled = false;
    elements.modelInput.placeholder = 'Start typing model name...';
    elements.modelInput.focus();
};

// ===== Recent Searches Functions =====
const loadRecentSearches = () => {
    const recent = getFromStorage(CONFIG.STORAGE_KEYS.RECENT_SEARCHES) || [];
    
    if (recent.length === 0) {
        elements.recentSearches.classList.add('hidden');
        return;
    }
    
    elements.recentSearches.classList.remove('hidden');
    elements.recentList.innerHTML = '';
    
    recent.forEach(search => {
        const li = document.createElement('li');
        li.className = 'recent-item';
        li.textContent = search;
        li.addEventListener('click', () => {
            const [brand, model] = search.split(' - ');
            elements.brandInput.value = brand;
            state.selectedBrand = brand;
            elements.modelInput.value = model;
            state.selectedModel = model;
            enableModelInput();
            handleSearch(new Event('submit'));
        });
        elements.recentList.appendChild(li);
    });
};

const addToRecentSearches = (brand, model) => {
    const searchString = `${brand} - ${model}`;
    let recent = getFromStorage(CONFIG.STORAGE_KEYS.RECENT_SEARCHES) || [];
    
    recent = recent.filter(item => item !== searchString);
    recent.unshift(searchString);
    recent = recent.slice(0, CONFIG.MAX_RECENT_SEARCHES);
    
    saveToStorage(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, recent);
    loadRecentSearches();
};

const clearRecentSearches = () => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.RECENT_SEARCHES);
    loadRecentSearches();
};

// ===== UI State Functions =====
const showLoading = () => {
    elements.loadingSpinner.classList.add('active');
    elements.errorMessage.classList.remove('active');
    elements.specsContainer.classList.remove('active');
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const showError = (message) => {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.add('active');
    elements.loadingSpinner.classList.remove('active');
    elements.specsContainer.classList.remove('active');
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const showSpecs = (specs) => {
    elements.specsContainer.classList.add('active');
    elements.loadingSpinner.classList.remove('active');
    elements.errorMessage.classList.remove('active');
    renderSpecs(specs);
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ===== Specs Rendering =====
const renderSpecs = (specs) => {
    // Render header
    elements.specsHeader.innerHTML = `
        <h2 class="specs-device-name">${specs.model || 'Unknown Model'}</h2>
        <p class="specs-device-info">${specs.brand || ''}</p>
    `;
    
    // Render specs grid
    elements.specsGrid.innerHTML = '';
    
    const specSections = [
        {
            title: 'Display',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>`,
            items: [
                { label: 'Size', value: specs.display?.size },
                { label: 'Resolution', value: specs.display?.resolution },
                { label: 'Technology', value: specs.display?.technology },
                { label: 'Refresh Rate', value: specs.display?.refresh_rate },
                { label: 'Protection', value: specs.display?.protection }
            ]
        },
        {
            title: 'Performance',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>`,
            items: [
                { label: 'Chipset', value: specs.hardware?.cpu },
                { label: 'GPU', value: specs.hardware?.gpu },
                { label: 'RAM', value: formatStorage(specs.hardware?.ram) },
                { label: 'Storage', value: formatStorage(specs.hardware?.storage) }
            ]
        },
        {
            title: 'Camera',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
            </svg>`,
            items: [
                { label: 'Rear Camera', value: specs.camera?.rear },
                { label: 'Front Camera', value: specs.camera?.front },
                { label: 'Video', value: specs.camera?.video },
                { label: 'Features', value: specs.camera?.features }
            ]
        },
        {
            title: 'Battery',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                <line x1="23" y1="13" x2="23" y2="11"></line>
            </svg>`,
            items: [
                { label: 'Capacity', value: formatBattery(specs.battery?.capacity) },
                { label: 'Charging', value: specs.battery?.charging },
                { label: 'Type', value: specs.battery?.type }
            ]
        },
        {
            title: 'Physical',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>`,
            items: [
                { label: 'Dimensions', value: formatDimensions(specs.dimensions) },
                { label: 'Weight', value: specs.weight },
                { label: 'Build', value: specs.build },
                { label: 'SIM', value: specs.sim }
            ]
        },
        {
            title: 'Connectivity',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>`,
            items: [
                { label: 'Network', value: specs.network },
                { label: 'WLAN', value: specs.wlan },
                { label: 'Bluetooth', value: specs.bluetooth },
                { label: 'NFC', value: specs.nfc },
                { label: 'USB', value: specs.usb }
            ]
        }
    ];
    
    specSections.forEach(section => {
        const hasData = section.items.some(item => item.value && item.value !== 'N/A');
        
        if (hasData) {
            const card = document.createElement('div');
            card.className = 'spec-card';
            
            const itemsHTML = section.items
                .filter(item => item.value && item.value !== 'N/A')
                .map(item => `
                    <div class="spec-item">
                        <span class="spec-label">${item.label}</span>
                        <span class="spec-value">${item.value}</span>
                    </div>
                `).join('');
            
            card.innerHTML = `
                <div class="spec-card-header">
                    <div class="spec-card-icon">${section.icon}</div>
                    <h3 class="spec-card-title">${section.title}</h3>
                </div>
                <div class="spec-list">
                    ${itemsHTML}
                </div>
            `;
            
            elements.specsGrid.appendChild(card);
        }
    });
};

// ===== Event Handlers =====
const handleSearch = async (e) => {
    e.preventDefault();
    
    const brand = elements.brandInput.value.trim();
    const model = elements.modelInput.value.trim();
    
    if (!brand || !model) {
        showError('Please select both brand and model.');
        return;
    }
    
    state.isLoading = true;
    showLoading();
    
    try {
        const specs = await searchPhone(model);
        state.currentSpecs = specs;
        addToRecentSearches(brand, model);
        showSpecs(specs);
    } catch (error) {
        showError(error.message || 'Unable to fetch specifications. Please try again.');
    } finally {
        state.isLoading = false;
    }
};

const handleClear = () => {
    elements.brandInput.value = '';
    elements.modelInput.value = '';
    elements.modelInput.disabled = true;
    elements.modelInput.placeholder = 'Select brand first';
    state.selectedBrand = null;
    state.selectedModel = null;
    state.currentSpecs = null;
    hideDropdown(elements.brandDropdown);
    hideDropdown(elements.modelDropdown);
    elements.specsContainer.classList.remove('active');
    elements.errorMessage.classList.remove('active');
};

// ===== Event Listeners =====
const initEventListeners = () => {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Search form
    elements.searchForm.addEventListener('submit', handleSearch);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.retryBtn.addEventListener('click', () => {
        if (state.selectedBrand && state.selectedModel) {
            handleSearch(new Event('submit'));
        }
    });
    
    // Brand input
    elements.brandInput.addEventListener('input', (e) => {
        filterBrands(e.target.value);
    });
    
    elements.brandInput.addEventListener('focus', async () => {
        if (state.brands.length === 0) {
            state.brands = await getBrands();
        }
        if (elements.brandInput.value) {
            filterBrands(elements.brandInput.value);
        } else {
            showDropdown(elements.brandDropdown, state.brands, (brand) => {
                elements.brandInput.value = brand;
                state.selectedBrand = brand;
                enableModelInput();
            });
        }
    });
    
    // Model input
    elements.modelInput.addEventListener('input', (e) => {
        filterModels(e.target.value);
    });
    
    elements.modelInput.addEventListener('focus', () => {
        if (state.selectedBrand) {
            filterModels(elements.modelInput.value);
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-wrapper')) {
            hideDropdown(elements.brandDropdown);
            hideDropdown(elements.modelDropdown);
        }
    });
    
    // Recent searches
    elements.clearHistoryBtn.addEventListener('click', clearRecentSearches);
    
    // Keyboard navigation
    elements.brandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && elements.brandDropdown.classList.contains('active')) {
            e.preventDefault();
            const firstItem = elements.brandDropdown.querySelector('.autocomplete-item');
            if (firstItem) firstItem.click();
        }
    });
    
    elements.modelInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && elements.modelDropdown.classList.contains('active')) {
            e.preventDefault();
            const firstItem = elements.modelDropdown.querySelector('.autocomplete-item');
            if (firstItem) firstItem.click();
        }
    });
};

// ===== Initialization =====
const init = () => {
    initTheme();
    initEventListeners();
    loadRecentSearches();
    
    // Load brands on page load
    getBrands().then(brands => {
        state.brands = brands;
    });
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
