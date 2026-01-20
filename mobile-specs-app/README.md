# 📱 Mobile Specs Finder

A modern, responsive web application for looking up detailed mobile phone specifications. Built with vanilla JavaScript, HTML5, and CSS3 - no frameworks required!

![Mobile Specs Finder](https://img.shields.io/badge/vanilla-javascript-yellow) ![HTML5](https://img.shields.io/badge/HTML5-semantic-orange) ![CSS3](https://img.shields.io/badge/CSS3-responsive-blue)

## ✨ Features

- 🔍 **Smart Search**: Autocomplete functionality for brands and models
- 📊 **Detailed Specs**: Display comprehensive phone specifications including:
  - Display (size, resolution, refresh rate, technology)
  - Performance (chipset, RAM, storage, GPU)
  - Camera (rear/front cameras, video capabilities, features)
  - Battery (capacity, charging, type)
  - Physical dimensions and build quality
  - Connectivity (network, WiFi, Bluetooth, NFC, USB)
- 🌓 **Dark Mode**: Toggle between light and dark themes with persistent preference
- 💾 **Smart Caching**: SessionStorage for API results, localStorage for preferences
- 📜 **Search History**: Recent searches stored locally for quick access
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Fast & Lightweight**: No frameworks, pure vanilla JavaScript
- ♿ **Accessible**: Semantic HTML5 with ARIA labels and keyboard navigation

## 🚀 Technology Stack

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript (ES6+)**: No frameworks or libraries
- **API Ninjas Phone Specs API**: Free API for phone specifications

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An API key from API Ninjas (free tier available)
- Optional: A simple HTTP server for local development

## 🛠️ Setup Instructions

### 1. Get Your API Key

1. Visit [API Ninjas](https://api-ninjas.com/register)
2. Create a free account
3. Navigate to the API Keys section in your dashboard
4. Copy your API key
5. **Free tier includes 50,000 requests per month** - more than enough for personal use!

### 2. Configure the Application

1. Open `script.js` in a text editor
2. Find the `CONFIG` object at the top of the file:
   ```javascript
   const CONFIG = {
       API_BASE_URL: 'https://api.api-ninjas.com/v1',
       API_KEY: 'YOUR_API_KEY_HERE', // Replace this
       // ...
   };
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key from API Ninjas

### 3. Run Locally

You have several options to run the app locally:

#### Option 1: Python HTTP Server (Recommended)
```bash
# Python 3
cd mobile-specs-app
python3 -m http.server 8000

# Python 2
cd mobile-specs-app
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Node.js HTTP Server
```bash
npm install -g http-server
cd mobile-specs-app
http-server -p 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Direct File Access (Limited Functionality)
Simply open `index.html` in your browser. Note: Some browsers may restrict API calls from `file://` protocol.

## 🌐 Deployment

### Deploy to Netlify

1. **Via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   cd mobile-specs-app
   netlify deploy --prod
   ```

2. **Via Netlify Dashboard**:
   - Go to [Netlify](https://www.netlify.com/)
   - Drag and drop the `mobile-specs-app` folder
   - Add environment variable for API key (optional for client-side)

3. **Via Git**:
   - Push your code to GitHub/GitLab
   - Connect repository to Netlify
   - Set publish directory to `mobile-specs-app`
   - Deploy!

### Deploy to Vercel

1. **Via Vercel CLI**:
   ```bash
   npm install -g vercel
   cd mobile-specs-app
   vercel --prod
   ```

2. **Via Vercel Dashboard**:
   - Go to [Vercel](https://vercel.com/)
   - Import your Git repository
   - Set root directory to `mobile-specs-app`
   - Deploy!

### Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push the `mobile-specs-app` folder contents
3. Go to Settings > Pages
4. Select your branch and root folder
5. Your site will be live at `https://yourusername.github.io/repo-name`

## 📖 Usage Guide

### Searching for Phone Specifications

1. **Select a Brand**:
   - Click on the "Brand" input field
   - Start typing or select from the dropdown
   - Autocomplete will show matching brands

2. **Select a Model**:
   - After selecting a brand, the "Model" field becomes active
   - Start typing the phone model name
   - Autocomplete will show available models for that brand

3. **View Specifications**:
   - Click "Search Specs" button
   - Specifications will be displayed in organized cards
   - Scroll through different categories (Display, Performance, Camera, etc.)

### Using Recent Searches

- Recent searches are automatically saved (up to 5)
- Click on any recent search to quickly load those specifications
- Click "Clear All" to remove search history

### Dark Mode

- Click the sun/moon icon in the header to toggle dark mode
- Your preference is saved and will persist across sessions

### Clearing the Form

- Click "Clear" button to reset the form and results
- This doesn't affect your search history or theme preference

## 🎨 Customization

### Changing the Color Scheme

Edit the CSS custom properties in `styles.css`:

```css
:root {
    --accent-primary: #6366f1; /* Change this to your preferred color */
    --accent-hover: #4f46e5;
    /* ... */
}
```

### Modifying API Configuration

Edit the `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://api.api-ninjas.com/v1',
    DEBOUNCE_DELAY: 300, // Adjust autocomplete delay
    TIMEOUT_DURATION: 10000, // Adjust API timeout
    MAX_RECENT_SEARCHES: 5, // Change number of saved searches
    // ...
};
```

## 🧪 Testing Checklist

- [ ] Search for "iPhone 15 Pro" - should display full specs
- [ ] Search for "Samsung Galaxy S23 Ultra" - should display full specs
- [ ] Try invalid model - should show error message
- [ ] Type "Sam" in brand field - should show "Samsung" in dropdown
- [ ] Select a brand - model dropdown should become active
- [ ] Toggle dark mode - theme should switch and persist on reload
- [ ] Perform 3 searches - they should appear in recent searches
- [ ] Click recent search - should auto-fill form and search
- [ ] Test on mobile (375px width) - should be fully responsive
- [ ] Test on tablet (768px width) - should use 2-column grid
- [ ] Test on desktop (1024px+) - should use 3-column grid
- [ ] Disconnect network - should show timeout error

## 🌍 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

Requires ES6+ support (Arrow functions, async/await, template literals, etc.)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1023px (2 columns)
- **Desktop**: 1024px+ (3 columns)

## 🔒 Security Features

- Content Security Policy headers in deployment configs
- API key stored client-side (for demo purposes)
- No sensitive data stored in localStorage
- XSS protection headers
- Secure HTTPS recommended for production

## 🚀 Performance Optimizations

- **Debounced autocomplete**: Reduces API calls while typing
- **SessionStorage caching**: Prevents duplicate API requests
- **Lazy loading**: Results fade in smoothly
- **Minimal dependencies**: No frameworks = faster load times
- **Optimized CSS**: Uses CSS custom properties for theme switching

## 🐛 Troubleshooting

### API Key Not Working

- Verify your API key is correct in `script.js`
- Check your API quota at API Ninjas dashboard
- Ensure you're using the Phone Specifications API endpoint

### Autocomplete Not Showing

- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache and reload

### Dark Mode Not Persisting

- Check if localStorage is enabled in your browser
- Clear localStorage and try again: `localStorage.clear()`

### CORS Errors

- Use a local HTTP server instead of opening file directly
- Check API endpoint is correct
- Verify API key has proper permissions

## 🔮 Future Enhancements

- [ ] Compare multiple phones side-by-side
- [ ] Filter by price range, features, release date
- [ ] Export specifications as PDF
- [ ] Share specifications via URL
- [ ] Favorite phones list
- [ ] Price comparison from multiple retailers
- [ ] User reviews and ratings integration
- [ ] Image gallery for each phone
- [ ] Benchmark scores integration
- [ ] Push notifications for new releases

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Built with ❤️ using Vanilla JavaScript

## 🙏 Acknowledgments

- [API Ninjas](https://api-ninjas.com/) for the Phone Specifications API
- Icons from [Feather Icons](https://feathericons.com/)
- Inspiration from modern mobile spec websites

## 📞 Support

If you have any questions or need help:

1. Check the troubleshooting section above
2. Review the API Ninjas documentation
3. Open an issue on GitHub
4. Check browser console for error messages

---

**Happy phone hunting! 📱✨**
