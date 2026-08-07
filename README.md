# NextGenTeens Platform (JTF Youth Development)

NextGenTeens is a youth development digital ecosystem built under **JTF Youth Development (CSR Initiative)** to nurture, train, mentor, evaluate, and develop teenagers into responsible leaders, mentors, worshippers, innovators, and positive contributors to society.

This repository contains a static multi-page web application deployed on **Vercel**, powered by **HTML, CSS, JavaScript**, and **Supabase** for authentication and data storage, plus an AI coaching experience.

## Vision

To raise a generation of spiritually grounded, purpose-driven, disciplined, skilled, confident, and impactful teenagers who become future leaders, mentors, and positive contributors to society.

## Mission

To provide teenagers with structured opportunities for growth through mentorship, leadership development, spiritual formation, practical learning, accountability systems, community engagement, and technology-enabled support.

## Core Objectives

- Develop leadership capacity among teenagers
- Promote spiritual maturity
- Improve communication and interpersonal skills
- Build confidence and self-awareness
- Foster mentorship relationships
- Encourage accountability and discipline
- Strengthen participation in youth programs
- Create measurable pathways for growth
- Develop future mentors and leaders
- Provide a sustainable framework for youth development

## Platform Environments

- Public environment (pre-login)
- Student environment (registered students)
- Mentor environment (mentors only)
- Administrator environment (platform admins)
- AI coaching environment (students and mentors)
- Learning & assessment environment (lessons, quizzes, games, evaluations)

## Active Programs

### 1) Christian Teenage Fellowship Session (CTFS)

- Duration: 12 weeks
- Schedule: Every Saturday and Sunday
- Delivery: Physical sessions + digital resources
- Components: assignments, discussions, reflections, assessments
- Outcomes: faith growth, communication, leadership, purpose discovery, discipline, relationships, practical life skills

### 2) Teen Choir Voice, Leadership & Mentorship Development Project (TCVLMDP)

Focus areas:

- Voice training (breathing, pitch, harmony, warm-ups, voice care)
- Leadership development (teamwork, communication, responsibility, accountability, servant leadership)
- Mentorship (personal guidance, goal setting, character building, talent discovery)
- Spiritual formation (worship understanding, prayer, ministry development)
- Life skills (confidence, financial awareness, self-management)

## User Types

### Student

Students participate in programs and growth activities.

Students can:

- Join programs
- View lessons
- Complete assignments
- Upload videos and images
- Participate in activities
- Play educational games
- Chat with the AI Coach
- Track progress
- View leaderboards
- Earn achievements

### Mentor

Mentors supervise and guide students.

Mentors can:

- Manage students
- Create activities
- Review submissions
- Verify attendance
- Publish content
- Generate reports
- Recommend promotions

### Administrator

Administrators manage the ecosystem.

Administrators can:

- Manage users
- Manage programs
- Manage content
- Monitor reports
- Configure settings
- Oversee promotions

## Registration System

Users select their role before account creation.

Student registration fields:

- Full name
- Email
- Phone number
- Date of birth
- Gender
- Password

Mentor registration fields:

- Full name
- Email
- Phone number
- Department
- Password

Role separation is enforced (students cannot access mentor systems; mentors cannot access student systems).

## Attendance Management

Attendance is a core measurement dimension and impacts rankings, growth scores, and promotion eligibility.

Attendance status options:

- Present
- Absent
- Excused

## Strike Management

Missed sessions generate strikes to encourage accountability.

Policy:

- 1 missed session = 1 strike

Strike levels:

- 0–4: Active
- 5–7: Warning
- 8–9: Critical
- 10: Suspension review

## Activity Management

Mentors can publish:

- Images
- Videos
- Announcements
- Updates
- Reflections
- Session summaries

Each activity includes:

- Title
- Description
- Media
- Program
- Date

## Assignment Management

Assignment types:

- Text
- Image
- Video
- Reflection
- Quiz
- Game-based

Practical assignment flow:

Watch lesson → Practice exercise → Record video (1–5 minutes) → Submit evidence → Mentor review → Approved → Completed

## File Uploads

Supported upload types:

- Images: JPG, PNG, WEBP
- Videos: MP4, MOV
- Documents: PDF, DOCX

Files are stored via Supabase Storage.

## Interactive Learning Lab (Games)

Gamified learning experiences (JavaScript-based), including:

- Lyrics arrangement
- Memory verse puzzle
- Word placement challenge
- Leadership simulator
- Communication challenge
- Choir rhythm trainer
- Faith quiz arena

## Quiz System

Assessment formats:

- Multiple choice
- True/false
- Reflection questions
- Practical evaluation
- Scenario analysis

## Student Growth Index (SGI)

Primary performance framework (Total = 100%):

- Attendance: 15%
- Assignments: 15%
- Practice videos: 15%
- Games & quizzes: 10%
- Leadership activities: 10%
- Spiritual development: 10%
- Mentor evaluation: 15%
- AI growth assessment: 10%

## Leaderboards

SGI-based rankings:

- Weekly
- Monthly
- All-time
- Most improved
- Best attendance
- Leadership excellence

## Achievements

Examples:

- Perfect attendance
- Leadership star
- Voice master
- Scripture champion
- Consistency champion
- CTFS graduate
- Kingdom builder

## Leadership Pathway

Student → Outstanding performer → Student leader → Junior mentor → Mentor

Promotion considerations:

- SGI performance
- Attendance
- Character
- Leadership
- Consistency
- Mentor reviews

## Hall of Fame

Permanent recognition for:

- Outstanding students
- Student leaders
- Junior mentors
- Mentors
- Graduates

## AI Coach System

AI coaching supports:

- Goal discovery
- Reflection support
- Communication coaching
- Leadership coaching
- Faith discussions
- Study support
- Personal growth guidance

AI growth analysis surfaces insights for mentors/admins, including:

- Communication skills
- Leadership potential
- Emotional intelligence
- Consistency
- Initiative
- Self-awareness
- Teamwork
- Growth mindset

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Auth/Data/Storage: Supabase
- Deployment: Vercel

## Pages (Current App Structure)

Public:

- `index.html`
- `login.html`
- `register.html`

Student:

- `student-dashboard.html`
- `tasks.html`
- `achievements.html`
- `leaderboard.html`
- `profile.html`
- `settings.html`

Mentor:

- `mentor-dashboard.html`

Admin:

- `admin-dashboard.html`

Shared:

- `ai-coach.html`
- `activity-feed.html`
- `programs.html`
- `ctfs.html`
- `choir.html`
- `notifications.html`
- `session-manager.html`

## Configuration Notes

This project expects Supabase (URL and anon key) and an AI provider key configured for the running environment.

- For Vercel, configure environment variables in the Vercel dashboard (Project Settings → Environment Variables).
- Avoid committing real secret keys to the repository.

## Conclusion

NextGenTeens is a complete Youth Development Operating System that combines mentorship, leadership development, faith formation, education, accountability, gamification, AI-powered support, and community engagement into one unified ecosystem.

NextGenTeens — Developing Leaders. Building Purpose. Creating Impact.

