# RecruitOS - AI Recruiter Workbench

A chat-centric workspace that unifies the entire recruitment lifecycle. Instead of switching between an ATS, email, and job boards, recruiters chat with an AI that invokes specific "micro-apps" to handle tasks—from intake to offer letter.

## Project Structure

```
.
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── services/         # Business logic and API clients
│   └── utils/           # Utility functions
├── mock_data/           # Mock data files (JSON, txt, md)
├── docs/                # Documentation
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
```

Note: The app will work without an API key for development (it uses mock data), but AI features require a valid key.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Features

### Stage 1: Foundation & Setup ✅
- ✅ Next.js 14 with TypeScript and Tailwind CSS
- ✅ Project structure following guidelines
- ✅ Mock data service with sample data
- ✅ Dashboard layout (Sidebar, Chat, Right Panel)
- ✅ Dark mode theme with glassmorphism design

### Stage 2: Core Features (In Progress)
- Chat interface
- File upload for context parsing
- Job Editor component
- OpenAI integration

### Stage 3: Advanced Features (Planned)
- Candidate matching
- Multi-post job board simulation
- External scraper simulator

### Stage 4: Polish & Optimization (Planned)
- AI voice trigger
- Scheduler calendar
- Offer generator

## Mock Data

The `mock_data/` folder contains:
- `hiring_managers.json` - 5 sample hiring manager profiles
- `candidates_db.json` - 50 sample candidate profiles
- `job_boards_config.json` - Job board configuration
- `conversation_logs.txt` - Sample conversation transcripts
- `offer_template.md` - Offer letter template

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** OpenAI GPT-4 API
- **Database:** Local JSON files (prototype)

## Development

### Project Structure Guidelines

See `/docs/project_structure.md` for detailed structure guidelines.

### UI/UX Guidelines

See `/docs/UI_UX_doc.md` for design system specifications.

### Implementation Plan

See `/docs/Implementation.md` for the complete implementation plan and progress tracking.

## License

Private - Internal Use Only
