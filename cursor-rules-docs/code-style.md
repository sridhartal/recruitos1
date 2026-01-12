# Code Style Guidelines

## Naming Conventions

### Variables
- Use camelCase for variables: `userName`, `totalCount`
- Use descriptive names: `isActive` instead of `flag`
- Boolean variables should start with `is`, `has`, `can`, `should`

### Functions
- Use camelCase for functions: `getUserData()`, `calculateTotal()`
- Use verb-noun pattern: `fetchData()`, `validateInput()`
- Async functions should indicate async nature: `async fetchUser()`

### Classes
- Use PascalCase: `UserService`, `DataProcessor`
- Use nouns representing entities or services

### Constants
- Use UPPER_SNAKE_CASE: `MAX_RETRY_COUNT`, `API_BASE_URL`
- Group related constants together

### Files
- Use kebab-case for files: `user-service.ts`, `data-processor.js`
- Match file name to main export when possible

## Formatting

### Indentation
- Use 2 spaces for indentation
- Use consistent spacing around operators
- Align multi-line statements appropriately

### Line Length
- Maximum 100 characters per line
- Break long lines at logical points
- Use line continuations when necessary

### Spacing
- Add blank lines between logical sections
- No trailing whitespace
- One blank line at end of file

## Comments

### When to Comment
- Complex algorithms or business logic
- Non-obvious code behavior
- Public APIs and interfaces
- Workarounds or temporary solutions

### Comment Style
- Use clear, concise language
- Explain "why" not "what"
- Keep comments up-to-date with code
- Remove commented-out code

## Code Organization

### Imports
- Group imports: external libraries, then internal modules
- Sort imports alphabetically within groups
- Use absolute imports when possible

### Functions
- Keep functions small and focused
- Single responsibility principle
- Maximum 50 lines per function (guideline)
- Extract complex logic into separate functions

### Files
- One main class/component per file
- Related utilities can be grouped
- Keep files under 300 lines when possible
