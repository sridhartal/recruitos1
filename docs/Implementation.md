# Implementation Plan for 1WrkOS - AI Recruiter Workbench

## Feature Analysis

### Identified Features:

1. **Chat Interface** - Central chat window for user interaction with 1WrkOS Bot
2. **Context Parser** - Upload and process .txt or .mp3 files from Hiring Manager calls
3. **Job Editor App** - UI card for editing drafted Job Descriptions (Title, Salary, Tech Stack)
4. **Multi-Post Action** - Simulate posting jobs to multiple job boards (LinkedIn, Naukri)
5. **Internal Matcher** - Search and match candidates from local database based on JD requirements
6. **External Scraper Simulator** - Simulated web search that returns pre-generated candidates
7. **AI Voice Trigger** - Simulate AI agent screening calls with audio playback
8. **Scheduler** - Calendar view showing available slots for Hiring Manager
9. **Offer Generator** - Generate offer letters from templates with candidate details
10. **Dashboard Layout** - Three-panel layout (Sidebar, Chat Stream, Right Panel)
11. **Mock Data Service** - Load and manage fake data from JSON files
12. **Status Tracking** - Update candidate status through workflow stages

### Feature Categorization:

- **Must-Have Features:**
  - Chat Interface
  - Context Parser (text file support)
  - Job Editor App
  - Internal Matcher
  - Dashboard Layout
  - Mock Data Service
  - Basic Status Tracking

- **Should-Have Features:**
  - Multi-Post Action
  - External Scraper Simulator
  - Offer Generator
  - Audio file upload support (.mp3)

- **Nice-to-Have Features:**
  - AI Voice Trigger with audio visualization
  - Scheduler with calendar view
  - PDF preview for offer letters
  - Advanced matching algorithms

## Recommended Tech Stack

### Frontend:

- **Framework:** Next.js 14 (App Router) - Modern React framework with built-in API routes, excellent for chat interfaces and dashboard layouts
- **Documentation:** https://nextjs.org/docs
- **UI Library:** Tailwind CSS - For rapid styling and responsive design
- **Documentation:** https://tailwindcss.com/docs
- **State Management:** React Hooks (useState, useContext) - Sufficient for prototype scope
- **Chat UI:** Custom components with React - Full control over chat interface design

### Backend:

- **Framework:** Next.js API Routes - Keeps everything in one codebase, simplifies deployment, sufficient for prototype
- **Documentation:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Alternative Considered:** FastAPI (Python) - More powerful for complex AI workflows, but adds deployment complexity
- **Decision:** Next.js API Routes chosen for simplicity and unified codebase

### Database:

- **Database:** Local JSON files (mock_data folder) - Prototype requirement, no database setup needed
- **File Structure:**
  - `hiring_managers.json`
  - `candidates_db.json`
  - `job_boards_config.json`
  - `conversation_logs.txt`
  - `offer_template.md`

### AI Engine:

- **Service:** Google Gemini API - Context understanding and text generation
- **Documentation:** https://ai.google.dev/docs
- **Integration:** @google/generative-ai Node.js SDK
- **Documentation:** https://github.com/google/generative-ai-nodejs

### Additional Tools:

- **File Upload:** Next.js file upload handling with FormData
- **Audio Processing:** HTML5 Audio API for playback simulation
- **PDF Generation:** react-pdf or jsPDF for offer letter generation
- **Documentation:** https://react-pdf.org/ or https://github.com/parallax/jsPDF

## Implementation Stages

### Stage 1: Foundation & Setup

- **Duration:** 2-3 days
- **Dependencies:** None

#### Sub-steps:

- [x] Initialize Next.js 14 project with TypeScript and Tailwind CSS [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Set up project structure following `/docs/project_structure.md` [Estimated: 1 hour] [Resources: Frontend Developer]
- [x] Create mock_data folder structure with sample JSON files [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Implement mock data service to load JSON files [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Set up OpenAI API integration and environment variables [Estimated: 2 hours] [Resources: Full-stack Developer]
- [x] Create base dashboard layout (Sidebar, Main Chat, Right Panel) [Estimated: 4 hours] [Resources: Frontend Developer]
- [x] Configure dark mode theme and basic styling [Estimated: 2 hours] [Resources: Frontend Developer]

### Stage 2: Core Features (Phase 1 - Intake & Create)

- **Duration:** 4-5 days
- **Dependencies:** Stage 1 completion

#### Sub-steps:

- [x] Build chat interface component with message history [Estimated: 4 hours] [Resources: Frontend Developer]
- [x] Implement file upload button for .txt files in chat input [Estimated: 3 hours] [Resources: Frontend Developer]
- [x] Create file upload handler in API route [Estimated: 2 hours] [Resources: Backend Developer]
- [x] Build context parser function that sends text to OpenAI GPT-4 [Estimated: 4 hours] [Resources: Backend Developer]
- [x] Create prompt engineering for JD extraction (Title, Skills, Seniority) [Estimated: 3 hours] [Resources: Backend Developer]
- [x] Implement JSON response parser for extracted JD data [Estimated: 2 hours] [Resources: Backend Developer]
- [x] Build Job Editor Card component with editable fields [Estimated: 4 hours] [Resources: Frontend Developer]
- [x] Add Edit and Save functionality to Job Card [Estimated: 3 hours] [Resources: Frontend Developer]
- [x] Integrate Job Card display in Right Panel [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Test end-to-end flow: Upload → Parse → Display → Edit → Save [Estimated: 3 hours] [Resources: QA]

### Stage 3: Advanced Features (Phase 2 - Sourcing & Distribution)

- **Duration:** 4-5 days
- **Dependencies:** Stage 2 completion

#### Sub-steps:

- [x] Add "Post" button to Job Card component [Estimated: 1 hour] [Resources: Frontend Developer]
- [x] Implement multi-post action handler (LinkedIn, Naukri simulation) [Estimated: 3 hours] [Resources: Frontend Developer]
- [x] Create loading spinner and success toast notifications [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Build candidate matching algorithm (keyword-based scoring) [Estimated: 4 hours] [Resources: Backend Developer]
- [x] Create CandidateList component with profile cards [Estimated: 4 hours] [Resources: Frontend Developer]
- [x] Implement match percentage score calculation and display [Estimated: 3 hours] [Resources: Frontend Developer]
- [x] Build external scraper simulator function [Estimated: 3 hours] [Resources: Backend Developer]
- [x] Add "Search Web" button with 5-second delay simulation [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Implement dynamic candidate list updates after scraping [Estimated: 2 hours] [Resources: Frontend Developer]
- [x] Create candidate table with sorting and filtering [Estimated: 3 hours] [Resources: Frontend Developer]

### Stage 4: Polish & Optimization (Phase 3 - Outreach & Operations)

- **Duration:** 5-6 days
- **Dependencies:** Stage 3 completion

#### Sub-steps:

- [ ] Add "Actions" column to candidate table [Estimated: 1 hour] [Resources: Frontend Developer]
- [ ] Implement "Start AI Screen" button functionality [Estimated: 3 hours] [Resources: Frontend Developer]
- [ ] Create status update system (yellow → green transition) [Estimated: 2 hours] [Resources: Frontend Developer]
- [ ] Build audio playback simulation for AI voice trigger [Estimated: 4 hours] [Resources: Frontend Developer]
- [ ] Create audio visualization waveform component [Estimated: 3 hours] [Resources: Frontend Developer]
- [ ] Implement modal for "Call Candidate" action [Estimated: 2 hours] [Resources: Frontend Developer]
- [ ] Build scheduler calendar view component [Estimated: 5 hours] [Resources: Frontend Developer]
- [ ] Create offer template system (offer_template.md) [Estimated: 2 hours] [Resources: Backend Developer]
- [ ] Implement offer generator with template filling [Estimated: 4 hours] [Resources: Backend Developer]
- [ ] Build "Generate Offer" modal with preview [Estimated: 4 hours] [Resources: Frontend Developer]
- [ ] Add PDF preview functionality for offer letters [Estimated: 3 hours] [Resources: Frontend Developer]
- [ ] Implement .mp3 file upload support for context parser [Estimated: 3 hours] [Resources: Backend Developer]
- [ ] Add audio transcription service integration [Estimated: 4 hours] [Resources: Backend Developer]
- [ ] Conduct comprehensive testing of complete workflow [Estimated: 4 hours] [Resources: QA]
- [ ] Performance optimization and latency simulation refinement [Estimated: 3 hours] [Resources: Full-stack Developer]
- [ ] UI/UX polish and visual distinction between Chat and App View [Estimated: 4 hours] [Resources: Frontend Developer/Designer]

## Resource Links

- **Next.js Documentation:** https://nextjs.org/docs
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Google Gemini API Documentation:** https://ai.google.dev/docs
- **Google Generative AI Node.js SDK:** https://github.com/google/generative-ai-nodejs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **React PDF:** https://react-pdf.org/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

## Risk Assessment

### Technical Risks

- **Gemini API Rate Limits:** May hit rate limits during development/testing
  - **Mitigation:** Implement request throttling and caching, use mock responses during development

- **File Upload Size Limits:** Large .mp3 files may cause issues
  - **Mitigation:** Implement file size validation and compression

- **Audio Transcription:** .mp3 transcription may require additional service
  - **Mitigation:** Consider using OpenAI Whisper API or similar service

### Timeline Risks

- **Complexity Underestimation:** Chat interface and AI integration may take longer
  - **Mitigation:** Build MVP first, iterate on enhancements

- **Gemini API Integration Learning Curve:** Team may need time to learn best practices
  - **Mitigation:** Allocate extra time for research and experimentation

### Resource Risks

- **Single Developer Bottleneck:** If only one developer, stages may take longer
  - **Mitigation:** Prioritize must-have features, defer nice-to-have items

## Success Criteria

### Definition of Done for Each Stage

**Stage 1:**
- Project runs locally without errors
- Mock data loads successfully
- Dashboard layout is visible and responsive

**Stage 2:**
- User can upload .txt file and receive JD in chat
- Job Card displays with editable fields
- User can edit and save JD successfully

**Stage 3:**
- Job posting simulation works with loading states
- Candidate matching displays results with scores
- External scraper simulation returns candidates after delay

**Stage 4:**
- Complete workflow functional: Upload → Job → Match → Screen → Offer
- All UI interactions feel responsive and realistic
- No crashes during normal usage

### Acceptance Criteria

- **Flow Completeness:** User can complete full recruitment workflow without app crashes
- **Latency Simulation:** Scraping and AI call features have realistic delays (3-5 seconds)
- **UI Clarity:** Clear visual distinction between Chat (Command Center) and App View (Workspace)
- **Data Persistence:** Job cards and candidate statuses persist during session
- **Error Handling:** Graceful error messages for API failures and invalid inputs

### Performance Benchmarks

- **Page Load:** < 2 seconds initial load
- **Chat Response:** < 3 seconds for AI parsing
- **Candidate Matching:** < 1 second for 50 candidates
- **File Upload:** < 5 seconds for .txt files up to 1MB
- **Simulation Delays:** 3-5 seconds for realistic feel

## Progress Tracking

- **Total Tasks:** 47
- **Completed:** 27
- **In Progress:** 0
- **Not Started:** 20

## Next Steps

1. Review and approve implementation plan
2. Set up development environment
3. Begin Stage 1: Foundation & Setup
4. Create initial mock data files
5. Set up OpenAI API account and keys
