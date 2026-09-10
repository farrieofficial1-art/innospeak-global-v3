# InnoSpeak Global

InnoSpeak Global is a React/Vite educational platform combining public academy content, admissions, student services, practical innovation labs and an authenticated learning management system.

## Recent platform upgrade

The project now includes a dedicated Programs experience, a clearer practical-learning taxonomy in Labs, stronger Apply error handling, and an expanded learner workspace with Live Sessions, Learning Calendar and My Portfolio areas. The LMS database foundation also includes scheduled sessions, attendance records, course prerequisites, certificates, portfolio items and learner goals.

## Stack

- React 18
- Vite 5
- React Router 6
- Tailwind CSS
- Framer Motion
- Supabase
- Firebase (where already used by the project)

## Run locally

1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and provide the required Supabase/Firebase values.
4. Run `npm run dev`.
5. For a production build, run `npm run build`.

Do not commit secrets. The included `.env` file should remain local and deployment secrets should be configured through the hosting provider.

## Core routes

### Public
- `/`
- `/about`
- `/academy`
- `/programs`
- `/courses/:courseCode`
- `/labs`
- `/apply`

### Learner
- `/learn`
- `/learn/catalog`
- `/learn/sessions`
- `/learn/calendar`
- `/learn/portfolio`
- `/learn/courses/:courseId`
- `/learn/lessons/:lessonId`
- `/learn/assignments/:assignmentId`
- `/learn/quizzes/:quizId`

### Student services
- `/portal`
- `/portal/profile`
- `/portal/registration`
- `/portal/records`
- `/portal/finance`
- `/portal/timetable`
- `/portal/attendance`
- `/portal/exams`
- `/portal/documents`
- `/portal/communication`
- `/portal/requests`
- `/portal/support`
- `/portal/graduation`

### Instructor / Admin
- `/teach`
- `/teach/courses/:courseId`
- `/teach/courses/:courseId/submissions`
- `/teach/quizzes/:quizId`
- `/admin`
- `/admin/students`
- `/admin/applications`
- `/admin/programs`
- `/admin/lms`

## Database migrations

Apply the migrations in `supabase/migrations` to the connected Supabase project. The latest migration adds scheduled LMS sessions, attendance, prerequisites, certificates, portfolio items and learning goals.

## Important note

The frontend cannot truthfully make external services such as payments, video conferencing, SMS or certificate issuance operational without their corresponding production credentials/backend configuration. The UI and data-layer foundations should expose clear states rather than fake successful transactions.

## Platform systems
The application now includes production-oriented foundations for public programmes/courses, admissions, authenticated student portal, LMS learning, instructor course management, live sessions and attendance, cohorts, learning goals, projects/practical labs, portfolio, certificates and verification, mentorship, career opportunities, notifications, discussions and administration.

### Supabase deployment
Apply all SQL files in `supabase/migrations/` in timestamp order. The latest migration adds cohorts, session attendance controls, manual gradebook entries, practical project workflows, career opportunities, mentorship requests, admissions status fields and automatic course certificate issuance.

### External services
Meeting links are provider-neutral (Google Meet, Zoom, Teams or another service). Payment/M-Pesa and messaging providers require real merchant/provider credentials and server-side webhook configuration; the UI does not simulate successful payments.

## Current platform additions
- Public course catalogue at `/courses` with search and filters.
- Landing-page promotional rail for current learning campaigns.
- Connected learning ecosystem section linking Academy, LMS, Labs, community and career.
- Catalogue governance metadata for permanent course IDs, versioning and review cycles.
- Duplicate course-code correction: Rust Programming uses `RST101`; Russian Language remains `RUS101`.
- Technology-heavy and exam-specific courses are flagged for annual curriculum review.
