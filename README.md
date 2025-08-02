# CAM Portfolio - Enhanced Web3 Edition

A modern, interactive portfolio website showcasing creative work, Web3 development, and blockchain expertise. Built with React, TypeScript, and cutting-edge web technologies.

## ✨ Features

### 🎨 Enhanced UI/UX
- **Modern Design**: Brutalist-inspired design with glassmorphism effects
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Responsive Design**: Mobile-first approach with perfect desktop experience
- **Interactive Elements**: Hover effects, micro-interactions, and dynamic content

### 🔗 Web3 Integration
- **Wallet Connection**: Connect MetaMask and other Web3 wallets
- **Crypto Dashboard**: Real-time cryptocurrency prices and portfolio tracking
- **NFT Gallery**: Showcase NFT collections with rarity indicators
- **Token Swap**: Interactive token swapping interface with slippage controls
- **Blockchain Stats**: Live portfolio value and asset tracking

### 📱 Multi-Section Portfolio
- **Enhanced Hero**: Animated hero section with skill highlights
- **Project Showcase**: Filterable project gallery with modal details
- **Skills Section**: Interactive skill bars and achievement cards
- **Contact Form**: Functional contact form with validation
- **Social Integration**: Links to social media and professional profiles

### 🛠 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Modern React**: React 19 with hooks and functional components
- **Performance Optimized**: Lazy loading, code splitting, and optimized builds
- **SEO Ready**: Meta tags, structured data, and accessibility features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cam-portfolio.git
cd cam-portfolio
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Web3Connect.tsx   # Wallet connection component
│   ├── CryptoDashboard.tsx # Cryptocurrency dashboard
│   ├── NFTGallery.tsx    # NFT showcase gallery
│   ├── TokenSwap.tsx     # Token swapping interface
│   ├── EnhancedHero.tsx  # Animated hero section
│   ├── ProjectShowcase.tsx # Project portfolio
│   ├── SkillsSection.tsx # Skills and expertise
│   └── ContactForm.tsx   # Contact form
├── App-simple.tsx        # Main application component
├── App.css              # Base styles
├── App-enhanced.css     # Enhanced component styles
└── main.tsx             # Application entry point
```

## 🎯 Key Components

### Web3Connect
- Wallet connection with MetaMask integration
- Address display and copy functionality
- Connection status indicators

### CryptoDashboard
- Real-time cryptocurrency price updates
- Portfolio value tracking
- Market cap and volume statistics
- Animated price changes

### NFTGallery
- NFT collection showcase
- Rarity badges and metadata
- Like and view functionality
- Responsive grid layout

### TokenSwap
- Token swapping interface
- Slippage tolerance settings
- Exchange rate calculations
- Gas estimation

### EnhancedHero
- Animated title and description
- Skill highlights with icons
- Call-to-action buttons
- Statistics display

### ProjectShowcase
- Filterable project gallery
- Category-based filtering
- Modal project details
- External links to live projects

### SkillsSection
- Interactive skill bars
- Progress animations
- Tools and technologies grid
- Achievement cards

### ContactForm
- Form validation
- Success/error handling
- Contact information display
- Availability status

## 🎨 Styling

The project uses a custom CSS architecture with:

- **CSS Variables**: Consistent theming and easy customization
- **Glassmorphism**: Modern glass-like effects
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Design**: Mobile-first approach

### Color Palette
- Primary: `#61dafb` (React Blue)
- Secondary: `#c792ea` (Purple)
- Accent: `#f07178` (Pink)
- Success: `#4ade80` (Green)
- Error: `#f87171` (Red)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=CAM Portfolio
VITE_APP_DESCRIPTION=Creative Director & Web3 Developer
```

### Customization
- Update personal information in component files
- Modify color scheme in CSS variables
- Add new projects to the showcase
- Customize Web3 functionality

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### GitHub Pages
```bash
npm run deploy
```

### Vercel
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- [React CountUp](https://react-countup.now.sh/) for number animations

## 📞 Contact

- **Email**: hello@cam.com
- **Twitter**: [@cam_creative](https://twitter.com/cam_creative)
- **LinkedIn**: [CAM](https://linkedin.com/in/cam)
- **GitHub**: [CAM](https://github.com/cam)

---

Built with ❤️ and ☕ by CAM
