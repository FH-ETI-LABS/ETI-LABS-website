# 🚀 ETI-LABS Official Website

> **Educational Technology Innovation Labs** - Empowering the future of education through technology

[![Project Status](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/FH-ETI-LABS/ETI-LABS-website)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Author](https://img.shields.io/badge/author-jsecco%20®-orange)](https://github.com/FH-ETI-LABS)

## 📋 Overview

The official website for ETI-LABS (Educational Technology Innovation Labs), showcasing our mission to revolutionize education through innovative technology solutions. This project serves as the primary digital presence for ETI-LABS, featuring modern design, responsive layout, and comprehensive information about our educational technology initiatives.

### 🎯 Project Goals

- **Showcase Innovation**: Highlight ETI-LABS cutting-edge educational technology solutions
- **Community Engagement**: Connect with educators, students, and technology enthusiasts
- **Resource Hub**: Provide access to educational resources and documentation
- **Modern Experience**: Deliver a fast, accessible, and mobile-friendly website

## 🏗️ Architecture & Technology Stack

### **Frontend**
- **Library**: React 18+ with TypeScript
- **Build Tool**: Create React App or Webpack
- **Styling**: CSS3 with mobile-first responsive design
- **State Management**: React Context API
- **UI Components**: Custom components
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for fast loading

### **Backend**
- **Platform**: Supabase (PostgreSQL + Real-time + Auth)
- **Database**: PostgreSQL (via Supabase)
- **API**: Supabase REST API + Real-time subscriptions
- **Authentication**: Supabase Auth (OAuth, email, etc.)
- **Storage**: Supabase Storage for files/images
- **Edge Functions**: Supabase Edge Functions (if needed)

### **DevOps & Deployment**
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Local server deployment
- **Backend**: Supabase (fully managed)
- **Web Server**: Node.js/Express static server or Apache/Nginx
- **SSL**: Manual SSL certificate setup (if needed)
- **Monitoring**: Simple server logs

### **Development Tools**
- **Version Control**: Git with GitHub
- **Code Quality**: ESLint + Prettier (TypeScript/React)
- **Testing**: Jest + React Testing Library (when needed)
- **Development Server**: React dev server (npm start)
- **Build Process**: Standard React build tools

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm (recommended)
- Git
- Supabase account (for backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FH-ETI-LABS/ETI-LABS-website.git
   cd ETI-LABS-website
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using pnpm (recommended)
   pnpm install
   ```

3. **Set up Supabase**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your Supabase project credentials
   # REACT_APP_SUPABASE_URL=your_supabase_url
   # REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   # Using npm
   npm start
   
   # Or using pnpm
   pnpm start
   ```

5. **Visit the website**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Project Management

### 🔗 Important Links

- **Repository**: [FH-ETI-LABS/ETI-LABS-website](https://github.com/FH-ETI-LABS/ETI-LABS-website)
- **Project Board**: [ETI-LABS Website Development](https://github.com/users/FH-ETI-LABS/projects/1)
- **Issues**: [GitHub Issues](https://github.com/FH-ETI-LABS/ETI-LABS-website/issues)
- **Milestones**: [Project Milestones](https://github.com/FH-ETI-LABS/ETI-LABS-website/milestones)

### 🗓️ Development Timeline

| Phase | Milestone | Duration | Target Date |
|-------|-----------|----------|-------------|
| **Phase 1** | Initial Setup | Week 1 | Jan 12, 2025 |
| **Phase 2** | Core Features | Weeks 2-3 | Jan 26, 2025 |
| **Phase 3** | Testing & Deployment | Week 4 | Feb 2, 2025 |

### 📈 Current Progress

**Sprint 1 - Setup Phase** (In Progress)
- [x] Project repository created
- [x] Project board configured with custom fields
- [x] Development milestones established
- [x] Technology stack decided: React TypeScript + Supabase
- [ ] React TypeScript project setup completed
- [ ] Supabase backend integration configured
- [ ] Development environment standardized

**Sprint 2 - Core Development** (Upcoming)
- [ ] Homepage design and mockups
- [ ] Responsive React component implementation
- [ ] Supabase database schema designed
- [ ] Documentation structure created

**Sprint 3 - Polish & Deployment** (Planned)
- [ ] Component testing implemented
- [ ] Performance optimization completed
- [ ] Local server deployment configured
- [ ] Production launch

## 🎨 Design System

### **Color Palette**
- Primary: TBD
- Secondary: TBD
- Accent: TBD
- Background: TBD

### **Typography**
- Headings: TBD
- Body: TBD
- Monospace: TBD

### **Responsive Breakpoints**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🔧 Development Workflow

### **Branch Strategy**
- `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches
- `hotfix/*` - Critical fixes

### **Commit Messages**
```
type(scope): description

feat(homepage): add hero section with call-to-action
fix(navigation): resolve mobile menu toggle issue
docs(readme): update installation instructions
```

### **Pull Request Process**
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run code quality checks
4. Submit PR with detailed description
5. Code review and approval
6. Merge to `develop`

### **Code Quality Standards**
- **Formatting**: Prettier (TypeScript/React/CSS)
- **Linting**: ESLint with TypeScript and React rules
- **Testing**: Basic Jest testing when needed
- **Documentation**: Clear component and function comments
- **Type Safety**: TypeScript with reasonable strictness

## 🧪 Testing

### **Running Tests**
```bash
# Run all tests (when implemented)
npm test
# or
pnpm test

# Run specific test file
npm test src/components/Homepage.test.tsx
```

### **Test Categories** (Simple Approach)
- **Component Tests**: Basic React component testing
- **Function Tests**: Utility function testing
- **Integration Tests**: Supabase API integration testing
- **Manual Testing**: Browser-based user testing

## 📚 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Pull request requirements
- Issue reporting
- Feature requests

### **Getting Started as a Contributor**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 👥 Team

- **Repository Owner**: [FH-ETI-LABS](https://github.com/FH-ETI-LABS)
- **Lead Developer**: jsecco ®
- **Project Type**: Educational Technology Website
- **Development Stack**: React TypeScript + Supabase

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/FH-ETI-LABS/ETI-LABS-website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FH-ETI-LABS/ETI-LABS-website/discussions)
- **Email**: [Contact ETI-LABS](mailto:fh.ai.lab01@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ETI-LABS team for vision and guidance
- Open source community for tools and frameworks
- Contributors and supporters of educational technology

---

**Made with ❤️ by the ETI-LABS team**

*Empowering education through innovative technology solutions*
