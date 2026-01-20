# 🤝 Contributing to Mobile Specs Finder

Thank you for considering contributing to Mobile Specs Finder! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Browser and OS** information
- **Console errors** (open DevTools → Console)

**Example:**
```markdown
## Bug: Dark mode not persisting on iOS Safari

**Steps to Reproduce:**
1. Open app in iOS Safari
2. Toggle dark mode on
3. Close the browser
4. Reopen the app

**Expected:** Dark mode should be active
**Actual:** App returns to light mode

**Environment:**
- Browser: Safari 14.1
- OS: iOS 15.2
- Device: iPhone 12

**Console Errors:**
```
localStorage is not available in private browsing mode
```
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear description** of the feature
- **Use case** - why is it useful?
- **Mockups or examples** if applicable
- **Technical considerations** if any

**Example:**
```markdown
## Feature: Phone Comparison Tool

**Description:**
Allow users to compare specifications of 2-3 phones side-by-side.

**Use Case:**
Users often need to compare phones before making a purchase decision.

**Mockup:**
[Attach screenshot or wireframe]

**Technical Notes:**
- Could use CSS Grid for side-by-side layout
- Store comparison list in localStorage
- Add "Add to Compare" button on each search
```

### Contributing Code

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Git
- Python 3 or Node.js (for local server)
- API Ninjas account (free)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/mobile-specs-app.git
   cd mobile-specs-app
   ```

2. **Get API key:**
   - Visit https://api-ninjas.com/register
   - Create account and get API key

3. **Configure API key:**
   - Open `script.js`
   - Replace `YOUR_API_KEY_HERE` with your key

4. **Start local server:**
   ```bash
   python3 -m http.server 8080
   ```

5. **Open in browser:**
   ```
   http://localhost:8080
   ```

### Project Structure

```
mobile-specs-app/
├── index.html          # HTML structure
├── styles.css          # All styling
├── script.js           # Application logic
├── .env.example        # API key template
├── netlify.toml        # Netlify config
├── vercel.json         # Vercel config
└── *.md                # Documentation
```

## 🎨 Code Style Guidelines

### HTML

- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Use lowercase for tags and attributes
- Self-close void elements: `<img />`, `<input />`
- Indent with 4 spaces

**Example:**
```html
<section class="search-section" aria-label="Phone search form">
    <form id="searchForm" class="search-form">
        <input 
            type="text" 
            id="brandInput" 
            aria-label="Phone brand"
            required
        />
    </form>
</section>
```

### CSS

- Use CSS custom properties for theme values
- Mobile-first responsive design
- BEM-like naming: `.component-element--modifier`
- Group related properties
- Indent with 4 spaces

**Example:**
```css
.spec-card {
    background-color: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    transition: all var(--transition-normal);
}

.spec-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.spec-card--featured {
    border: 2px solid var(--accent-primary);
}
```

### JavaScript

- Use ES6+ features (arrow functions, async/await, etc.)
- Follow functional programming principles
- Use meaningful variable names
- Add comments for complex logic
- Handle errors gracefully
- Indent with 4 spaces

**Example:**
```javascript
// Good: Clear function name and purpose
const searchPhone = async (model) => {
    try {
        // Check cache first
        const cached = getFromSessionStorage(`cache-${model}`);
        if (cached) return cached;
        
        // Fetch from API
        const response = await fetchWithTimeout(
            `${API_URL}/phonespecs?model=${encodeURIComponent(model)}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch specifications');
        }
        
        const data = await response.json();
        saveToSessionStorage(`cache-${model}`, data);
        return data;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};
```

### File Organization

**script.js structure:**
```javascript
// 1. Configuration
const CONFIG = { ... };

// 2. State
const state = { ... };

// 3. DOM Elements
const elements = { ... };

// 4. Utility Functions
const debounce = () => { ... };
const formatData = () => { ... };

// 5. Core Functions
const searchPhone = () => { ... };
const renderSpecs = () => { ... };

// 6. Event Handlers
const handleSearch = () => { ... };

// 7. Initialization
const init = () => { ... };
```

## 📝 Commit Messages

Use conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
# Feature
git commit -m "feat(search): add phone comparison feature"

# Bug fix
git commit -m "fix(autocomplete): prevent duplicate API calls"

# Documentation
git commit -m "docs(readme): add deployment instructions"

# Style
git commit -m "style(css): improve dark mode contrast"
```

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes thoroughly:**
   - Test on multiple browsers
   - Test responsive design
   - Test dark mode
   - Test error handling
   - Check console for errors

2. **Update documentation:**
   - Update README if needed
   - Add comments to complex code
   - Update CHANGELOG if significant

3. **Follow code style:**
   - Run linter if available
   - Check formatting
   - Remove console.logs

### Submitting PR

1. **Create descriptive title:**
   ```
   Add phone comparison feature
   ```

2. **Provide detailed description:**
   ```markdown
   ## Description
   Adds ability to compare up to 3 phones side-by-side.
   
   ## Changes
   - Added comparison state management
   - Created comparison UI components
   - Added localStorage persistence
   - Updated CSS for comparison layout
   
   ## Screenshots
   [Attach screenshots]
   
   ## Testing
   - Tested on Chrome, Firefox, Safari
   - Tested responsive design
   - Tested with 1, 2, and 3 phones
   
   ## Related Issues
   Closes #42
   ```

3. **Link related issues:**
   - Reference issue numbers: `#123`
   - Use keywords: `Fixes #123`, `Closes #123`

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited!

## 🧪 Testing

### Manual Testing Checklist

**Functionality:**
- [ ] Search for Samsung Galaxy S23 Ultra - displays specs
- [ ] Search for iPhone 15 Pro - displays specs
- [ ] Invalid brand/model shows error
- [ ] Autocomplete filters correctly
- [ ] Recent searches work
- [ ] Clear button resets form
- [ ] Dark mode toggles correctly

**Responsive Design:**
- [ ] Mobile (375px): Single column layout
- [ ] Tablet (768px): Two column layout
- [ ] Desktop (1200px): Three column layout
- [ ] All breakpoints work smoothly

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Screen reader friendly

**Performance:**
- [ ] Page loads under 2 seconds
- [ ] API calls cached properly
- [ ] No console errors
- [ ] Smooth animations

### Testing New Features

When adding new features, test:

1. **Happy path** - Feature works as expected
2. **Edge cases** - Empty states, long text, etc.
3. **Error handling** - API failures, network issues
4. **Browser compatibility** - All supported browsers
5. **Responsive design** - All screen sizes
6. **Accessibility** - Keyboard and screen readers

## 🎯 Areas for Contribution

### High Priority

- [ ] Add unit tests (Jest, Mocha)
- [ ] Improve error messages
- [ ] Add loading skeletons
- [ ] Optimize performance
- [ ] Improve accessibility

### Medium Priority

- [ ] Add phone comparison feature
- [ ] Add price tracking
- [ ] Add favorite phones list
- [ ] Export specs to PDF
- [ ] Add phone images

### Low Priority

- [ ] Add animations
- [ ] Add more themes
- [ ] Add keyboard shortcuts
- [ ] Add print styles
- [ ] Add share functionality

## 📚 Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS-Tricks](https://css-tricks.com/)

### Tools
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [WAVE](https://wave.webaim.org/) - Accessibility testing

### API
- [API Ninjas Documentation](https://api-ninjas.com/api/phonespecs)

## ❓ Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues and PRs

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

**Happy Coding!** 💻✨
