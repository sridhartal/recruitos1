# Project Structure

## Root Directory

```
project-name/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── assets/
├── docs/
├── tests/
├── config/
└── deployment/
```

## Directory Descriptions

### `/src/`
Main source code directory containing all application code.

#### `/src/components/`
Reusable UI components used across the application.
- **Structure**: One component per folder
- **Naming**: PascalCase (e.g., `Button/`, `UserCard/`)
- **Files**: `index.tsx`, `component.tsx`, `component.test.tsx`, `component.styles.ts`, `types.ts`
- **Example**:
  ```
  components/
  ├── Button/
  │   ├── index.tsx
  │   ├── Button.tsx
  │   ├── Button.test.tsx
  │   ├── Button.styles.ts
  │   └── types.ts
  └── UserCard/
      └── ...
  ```

#### `/src/pages/`
Page-level components representing routes/views.
- **Structure**: One page per file or folder
- **Naming**: PascalCase (e.g., `HomePage.tsx`, `Dashboard/`)
- **Files**: `PageName.tsx` or `PageName/index.tsx`
- **Example**:
  ```
  pages/
  ├── HomePage.tsx
  ├── Dashboard/
  │   ├── index.tsx
  │   └── Dashboard.tsx
  └── Profile/
      └── ...
  ```

#### `/src/services/`
Business logic, API clients, and external service integrations.
- **Structure**: One service per file
- **Naming**: camelCase with `Service` suffix (e.g., `userService.ts`, `apiService.ts`)
- **Files**: `serviceName.ts`, `serviceName.test.ts`
- **Example**:
  ```
  services/
  ├── userService.ts
  ├── apiService.ts
  ├── authService.ts
  └── dataService.ts
  ```

#### `/src/utils/`
Utility functions and helper methods.
- **Structure**: Grouped by functionality
- **Naming**: camelCase (e.g., `formatDate.ts`, `validation.ts`)
- **Files**: Descriptive names indicating purpose
- **Example**:
  ```
  utils/
  ├── formatDate.ts
  ├── validation.ts
  ├── constants.ts
  └── helpers.ts
  ```

#### `/src/assets/`
Static assets: images, fonts, icons, etc.
- **Structure**: Organized by asset type
- **Naming**: kebab-case (e.g., `logo.svg`, `hero-image.png`)
- **Example**:
  ```
  assets/
  ├── images/
  │   ├── logo.svg
  │   └── hero-image.png
  ├── fonts/
  │   └── custom-font.woff2
  └── icons/
      └── ...
  ```

### `/docs/`
Project documentation and supporting materials.
- **Contents**:
  - `Implementation.md` - Implementation plan and tasks
  - `UI_UX_doc.md` - UI/UX specifications
  - `project_structure.md` - This file
  - `Bug_tracking.md` - Known issues and solutions
  - API documentation
  - Architecture diagrams
  - User guides

### `/tests/`
Test files and test utilities.
- **Structure**: Mirror `src/` structure or separate test suites
- **Naming**: Match source files with `.test.ts` or `.spec.ts` suffix
- **Example**:
  ```
  tests/
  ├── unit/
  ├── integration/
  ├── e2e/
  └── fixtures/
  ```

### `/config/`
Configuration files for different environments and tools.
- **Contents**:
  - Environment variables (`.env.example`, `.env.development`, `.env.production`)
  - Build configuration
  - Linter configuration
  - TypeScript configuration
  - Package manager configuration
- **Example**:
  ```
  config/
  ├── webpack.config.js
  ├── tsconfig.json
  ├── .eslintrc.js
  └── jest.config.js
  ```

### `/deployment/`
Deployment scripts, Docker files, and infrastructure as code.
- **Contents**:
  - Docker files (`Dockerfile`, `docker-compose.yml`)
  - Deployment scripts
  - CI/CD configuration
  - Infrastructure templates
- **Example**:
  ```
  deployment/
  ├── Dockerfile
  ├── docker-compose.yml
  ├── deploy.sh
  └── kubernetes/
      └── ...
  ```

## Additional Root Files

### Configuration Files
- `package.json` - Dependencies and scripts
- `README.md` - Project overview and setup
- `.gitignore` - Git ignore patterns
- `.env.example` - Environment variable template
- `.cursorrules` - Cursor IDE rules
- `development-agent-workflow.md` - Development workflow

### Build Output
- `/dist/` or `/build/` - Compiled/build output (gitignored)
- `/node_modules/` - Dependencies (gitignored)

## File Naming Conventions

### Source Files
- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Services/Utils**: camelCase (`userService.ts`, `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL.ts`)
- **Types/Interfaces**: PascalCase (`User.ts`, `ApiResponse.ts`)

### Configuration Files
- Use standard names: `package.json`, `tsconfig.json`, `.eslintrc.js`
- Environment files: `.env`, `.env.development`, `.env.production`

### Documentation Files
- Use descriptive names: `Implementation.md`, `API_DOCUMENTATION.md`
- Use kebab-case or PascalCase for markdown files

## Organization Principles

1. **Separation of Concerns**: Keep related code together
2. **Single Responsibility**: Each file/component should have one clear purpose
3. **Scalability**: Structure should accommodate growth
4. **Discoverability**: Clear naming and organization make code easy to find
5. **Consistency**: Follow established patterns throughout the project

## Import Paths

### Absolute Imports (Recommended)
```typescript
import { Button } from '@/components/Button';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils/formatDate';
```

### Relative Imports (Use sparingly)
```typescript
import { Button } from '../components/Button';
import { helper } from './utils';
```

## Before Making Structural Changes

1. **Check this document** for existing patterns
2. **Consult team** if unsure about structure
3. **Update this document** if adding new directories
4. **Maintain consistency** with existing structure
5. **Consider impact** on imports and dependencies

## Notes

- This structure is a template and should be adapted to project needs
- Some projects may combine or omit certain directories
- Always maintain consistency once structure is established
- Document any deviations or project-specific conventions
