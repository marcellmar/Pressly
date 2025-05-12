# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

- Start development server: `npm run start`
- Build for production: `npm run build`
- Run all tests: `npm run test`
- Run a single test: `npm run test -- -t "test name pattern"`
- Run Flask server: `python app.py`

## Code Style Guidelines

### React Components
- Use functional components with hooks
- PascalCase for component files and names
- Organize components by feature in the `/src/components` directory
- Keep components small and focused on a single responsibility

### Imports & Structure
- React imports first, then third-party, then local imports
- Group related imports together
- Keep styles/CSS imports last

### Naming Conventions
- Components: PascalCase (e.g., `ProducerCard.js`)
- Functions/methods: camelCase (e.g., `handleSubmit`)
- Event handlers: prefix with "handle" (e.g., `handleClick`)
- Constants: ALL_CAPS for important constants
- Hooks: prefix with "use" (e.g., `usePortfolio`)

### Error Handling
- Use try/catch for async functions
- Propagate errors to UI via state
- Log errors to console.error

### Styling
- Use Tailwind CSS for styling
- Follow the theme configuration in tailwind.config.js
- Prefer composing utility classes over custom CSS

### Python
- Follow PEP 8 style guidelines
- Use Flask blueprints for API routes
- Model definitions with SQLAlchemy