# AIBlogBoost

AI-powered blog article creation assistant tool for generating high-quality content through an intuitive 6-step wizard.

![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![Vue.js](https://img.shields.io/badge/vue.js-3.5-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Languages**: English | [日本語](README.ja.md)

## Overview

AIBlogBoost is a frontend-only SPA that leverages Google Gemini AI to assist in creating compelling blog articles through a structured workflow. Built as a portfolio project demonstrating modern web development practices with AI integration.

## Features

### 🎯 **6-Step Article Creation Workflow**
1. **Genre Selection** - Choose from 9 predefined genres or create custom categories
2. **Theme Definition** - Specify your article topic, target audience, and desired word count
3. **AI Idea Generation** - Get 5 creative article ideas with individual regeneration options
4. **Multi-tone Draft Creation** - Generate 3 drafts in different tones with preview capabilities
5. **Intelligent Combination** - Merge the best parts of all drafts with custom instructions
6. **Export & Save** - Download in multiple formats and save to local history

### ⚡ **AI-Powered Features**
- **Google Gemini 1.5 Flash** integration for high-quality content generation
- Context-aware article suggestions based on genre and theme
- Multiple writing tone options for diverse content styles
- Intelligent content combination with user-specified instructions
- Individual idea and draft regeneration for iterative improvement
- Customizable word count settings (1000, 2000-3000, 4000-5000, or custom)

### 📱 **Modern User Experience**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Progressive UI** - Step-by-step wizard with progress tracking and smooth scroll navigation
- **Local Data Persistence** - Save articles and settings in browser storage
- **Auto-Save & Recovery** - Automatic draft saving with navigation confirmation
- **Enhanced Controls** - Individual draft regeneration and custom genre validation

### 📄 **Export & Management**
- **Multiple Export Formats**: Markdown, HTML, Plain Text
- **Article History** - Browse and manage previously created articles
- **Favorites System** - Mark important articles for quick access
- **Copy to Clipboard** - Quick sharing functionality

## Technology Stack

### Frontend Architecture
- **Vue.js 3** with Composition API and TypeScript
- **Tailwind CSS** for utility-first styling and responsive design
- **Pinia** for reactive state management
- **Vue Router** for SPA navigation
- **Vite** for fast development and optimized builds

### AI Integration
- **Google Gemini API** (1.5 Flash model) for content generation
- **Direct API Integration** - Frontend-only architecture with user-provided API keys
- **Intelligent Prompting** - Optimized prompts for Japanese content creation

### Data Management
- **LocalStorage** for article history and user preferences
- **Client-side Processing** - No server required, complete privacy
- **Export Services** - Browser-based file generation

## Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20+)
- Google Gemini API key ([Get API key](https://makersuite.google.com/app/apikey))
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-Ito-7310/AIBlogBoost.git
   cd AIBlogBoost
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to http://localhost:5173

5. **Configure API key**
   - Go to Settings page
   - Enter your Google Gemini API key
   - Start creating articles!

## Project Structure

```
AIBlogBoost/
├── frontend/                 # Vue.js SPA application
│   ├── src/
│   │   ├── components/       # Vue components
│   │   │   ├── BlogWizard/   # 6-step creation wizard
│   │   │   │   ├── GenreSelector.vue     # Step 1: Genre selection
│   │   │   │   ├── ThemeSelector.vue     # Step 2: Theme definition
│   │   │   │   ├── IdeaPicker.vue        # Step 3: AI idea generation
│   │   │   │   ├── DraftGenerator.vue    # Step 4: Multi-tone drafts
│   │   │   │   ├── DraftCombiner.vue     # Step 5: Content combination
│   │   │   │   └── ExportView.vue        # Step 6: Export & save
│   │   ├── views/            # Main application views
│   │   │   ├── HomeView.vue              # Landing page
│   │   │   ├── CreateView.vue            # Article creation wizard
│   │   │   ├── HistoryView.vue           # Article history management
│   │   │   └── SettingsView.vue          # Configuration & preferences
│   │   ├── stores/           # Pinia state management
│   │   │   ├── article.ts               # Article workflow state
│   │   │   ├── settings.ts              # User preferences & API key
│   │   │   └── history.ts               # Article history management
│   │   ├── services/         # Business logic & API integration
│   │   │   ├── geminiService.ts         # Google Gemini API client
│   │   │   └── exportService.ts         # File export functionality
│   │   └── router/           # Vue Router configuration
│   └── package.json
├── docs/
│   ├── README.md
│   └── ROADMAP.md
└── .gitignore
```

## Usage Guide

### Getting Started
1. **API Setup**: Configure your Google Gemini API key in Settings
2. **Start Creating**: Click "記事作成を開始" on the home page
3. **Follow the Wizard**: Complete each step of the 6-step process
4. **Export & Save**: Download your completed article in your preferred format

### API Key Management
- Your API key is stored locally in your browser
- Keys are encrypted before storage for security
- You can change or remove your API key anytime in Settings

### Article Management
- All articles are saved locally in your browser
- Mark articles as favorites for quick access
- Export articles in multiple formats
- Search through your article history

## Development

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

### Key Development Features
- **Hot Module Replacement** for instant updates during development
- **TypeScript** for type safety and better development experience
- **ESLint** for code quality and consistency
- **Tailwind CSS** for rapid UI development

## Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Deploy automatically on push to main branch

### Netlify Deployment
1. Build the project: `cd frontend && npm run build`
2. Deploy the `frontend/dist` directory to Netlify
3. Configure redirects for SPA routing

### Static Hosting
The application builds to static files and can be hosted on any static hosting service:
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- Any CDN or static hosting provider

## Architecture Decisions

### Frontend-Only Design
- **Privacy**: No user data sent to external servers
- **Simplicity**: Single codebase with no backend complexity
- **Cost-Effective**: No server infrastructure required
- **Scalability**: CDN-based distribution for global performance

### Google Gemini Integration
- **Quality**: High-quality Japanese content generation
- **Cost-Effective**: Free tier with 1,500 requests/day
- **Reliability**: Production-ready API with high availability
- **Flexibility**: Direct API integration for maximum control

### State Management Strategy
- **Pinia** for reactive state management with TypeScript support
- **LocalStorage** for data persistence across sessions
- **Modular stores** for clean separation of concerns

## Security & Privacy

### Data Handling
- All data processed locally in your browser
- API keys encrypted before local storage
- No user data transmitted to third parties
- Complete control over your content and settings

### API Key Security
- Keys stored with browser encryption
- Never transmitted to unauthorized endpoints
- User can remove keys at any time
- Clear indicators of API key status

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Vue.js 3 Composition API patterns
- Use TypeScript for all new code
- Follow Tailwind CSS utility-first approach
- Ensure responsive design across all screen sizes
- Test with multiple API scenarios

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Check the project documentation
- Review the [ROADMAP.md](ROADMAP.md) for planned features

---

**Status**: 🚀 Production Ready

### Current Implementation
- ✅ **Core Functionality**: Complete 6-step article creation workflow
- ✅ **AI Integration**: Google Gemini API with intelligent prompting
- ✅ **User Interface**: Modern responsive design with dark/light themes
- ✅ **Data Management**: Local storage with export capabilities
- ✅ **Export Options**: Markdown, HTML, and text formats

### Project Highlights
- **Modern Stack**: Vue 3 + TypeScript + Tailwind CSS
- **AI-Powered**: Google Gemini 1.5 Flash integration
- **Privacy-First**: Frontend-only architecture
- **Production-Ready**: Complete feature set with error handling
- **Portfolio Quality**: Demonstrates advanced frontend development skills

This project showcases expertise in modern web development, AI integration, and user experience design suitable for high-level freelance development projects.