# Contributing Guide

## Development Setup

### Package Management

We use `pnpm` as our package manager. Please do not use npm or yarn.

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Add a new dependency
pnpm add [package-name]

# Add a dev dependency
pnpm add -D [package-name]
```

### Code Style

- Follow the ESLint configuration
- Use TypeScript for all new files
- Follow the existing code structure and naming conventions
- Use conventional commits for commit messages

### Testing

- Write tests for new features
- Run tests before submitting PR: `pnpm test`
- Ensure all tests pass

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit PR with clear description
5. Address review comments

## Project Structure

```
src/
  components/     # React components
  hooks/          # Custom React hooks
  stores/         # State management
  types/          # TypeScript types
  utils/          # Utility functions
``` 