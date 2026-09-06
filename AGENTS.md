# AGENTS.md

This file provides guidance for AI agents working on the Web4AI codebase.

## Project Overview

**Web4AI** is The Web4 Multiagent Workplace - a platform designed to facilitate collaboration between multiple AI agents. This project is licensed under the GNU Affero General Public License v3 (AGPL-3.0).

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript/JavaScript
- **Package Manager**: npm or yarn

## Code Style & Conventions

### General Guidelines

- Use TypeScript for all new code when possible
- Follow ESLint and Prettier configurations if present
- Use meaningful variable and function names
- Write self-documenting code with comments for complex logic
- Keep functions small and focused on a single responsibility

### Naming Conventions

- **Files**: Use kebab-case for file names (e.g., `user-service.ts`)
- **Variables/Functions**: Use camelCase (e.g., `getUserById`)
- **Classes/Types/Interfaces**: Use PascalCase (e.g., `UserService`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

### File Organization

- Group related functionality into modules/directories
- Keep imports organized: external dependencies first, then internal modules
- Place types and interfaces near their usage or in dedicated `types.ts` files

## Development Workflow

### Before Making Changes

1. Understand the existing code structure and patterns
2. Check for existing tests related to the area you're modifying
3. Review any relevant documentation

### Making Changes

1. Make incremental, focused changes
2. Follow existing patterns and conventions in the codebase
3. Update or add tests for new functionality
4. Update documentation if behavior changes

### After Making Changes

1. Run linting: `npm run lint` (if available)
2. Run tests: `npm test` (if available)
3. Ensure no regressions in existing functionality

## Git Practices

### Commit Messages

Use clear, descriptive commit messages following this format:

```
<type>: <short description>

[optional longer description]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Branch Strategy

- Work on feature branches, not directly on main
- Keep commits atomic and focused

## Architecture Guidelines

### Modularity

- Design components to be loosely coupled
- Use dependency injection where appropriate
- Prefer composition over inheritance

### Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately for debugging

### Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate and sanitize all external inputs
- Follow OWASP security guidelines

## Testing

- Write unit tests for business logic
- Write integration tests for API endpoints
- Aim for meaningful test coverage, not just high percentages
- Test edge cases and error conditions

## Documentation

- Update README.md for significant changes
- Document public APIs and interfaces
- Include JSDoc comments for exported functions
- Keep this AGENTS.md file updated with new conventions

## License Compliance

This project uses AGPL-3.0. When contributing:

- Ensure all contributions are compatible with AGPL-3.0
- Do not introduce code with incompatible licenses
- Maintain license headers where required

## Environment Setup

1. Ensure Node.js is installed (check `.nvmrc` if present for version)
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` if it exists
4. Follow any additional setup in README.md

## Common Tasks

### Adding a New Feature

1. Create necessary files following existing patterns
2. Implement the feature with proper error handling
3. Add tests for the new functionality
4. Update documentation as needed

### Fixing a Bug

1. Write a test that reproduces the bug
2. Fix the bug
3. Verify the test passes
4. Check for similar issues elsewhere in the codebase

### Refactoring

1. Ensure tests exist for the code being refactored
2. Make incremental changes
3. Run tests after each change
4. Keep functionality identical unless intentionally changing behavior
