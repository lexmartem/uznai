### Product Overview

**Uznai** is a web-based platform designed to simplify quiz creation, sharing, and participation. It targets educators, trainers, event hosts, and casual users by offering an intuitive interface for manual and AI-assisted quiz creation (via prompts or PDF content), a social environment for sharing and rating quizzes, and real-time interactive quiz sessions with live leaderboards. The platform emphasizes a responsive, cross-device experience, secure user authentication, and cost-effective infrastructure with minimal hosting costs. Built with modern technologies like React.js, Spring Boot, and PostgreSQL, Uznai integrates OpenAI for AI-generated quizzes and supports live features via WebSockets, aiming to address gaps in existing quiz platforms by combining ease of use, interactivity, and affordability.

Below is the comprehensive `features.md` file based on the PRD.

---

# features.md

## Table of Contents
- [Overview](#overview)
- [Feature Categories](#feature-categories)
  - [User Authentication](#user-authentication)
  - [Quiz Creation](#quiz-creation)
  - [Quiz Taking](#quiz-taking)
  - [Social Features](#social-features)
  - [Real-Time Quiz Sessions](#real-time-quiz-sessions)
  - [User Profiles](#user-profiles)
  - [AI Integration](#ai-integration)
  - [PDF Processing](#pdf-processing)
  - [Payment Processing](#payment-processing)
  - [Platform Infrastructure](#platform-infrastructure)
- [Summary](#summary)

## Overview
This document outlines the features of Uznai, an interactive quiz creation and sharing platform. Features are categorized, prioritized using the MoSCoW method, and detailed with descriptions, acceptance criteria, technical considerations, and complexity estimates. The list is designed for implementation planning by the development team.

## Feature Categories

### User Authentication
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F1   | User Registration        | Must     | Medium     | Allow users to create an account with email and password                   | User can sign up, receive confirmation, and log in; email must be unique                             | JWT token generation, Spring Security                        | Duplicate emails, weak passwords |
| F2   | User Login               | Must     | Low        | Enable users to log in with credentials                                    | User enters valid credentials and receives a JWT token; invalid attempts show error                 | Spring Security, JWT authentication                         | Account lockout after attempts   |
| F3   | Role-Based Access        | Should   | Medium     | Restrict premium features to paid users                                    | Free users access basic features; premium users unlock advanced features (e.g., AI generation)       | Spring Security roles, JWT claims                            | Role misassignment               |
| F4   | Password Reset           | Should   | Medium     | Allow users to reset passwords via email                                   | User requests reset, receives email link, and updates password successfully                         | Email service integration (e.g., Spring Mail)                | Expired reset links              |
| F5   | Session Management       | Must     | Medium     | Maintain user sessions with secure logout                                 | User stays logged in across pages; logout invalidates token                                         | Spring Session, Redis or in-memory                           | Session timeout handling         |

### Quiz Creation
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F6   | Manual Quiz Creation     | Must     | Medium     | Users can manually create quizzes with questions and answers               | User adds title, questions, and answers; quiz saves and is accessible                               | React forms, Spring REST API                                 | Invalid input formats            |
| F7   | Quiz Privacy Settings    | Must     | Low        | Users can set quizzes as public or private                                 | User selects privacy; public quizzes are shareable, private ones are restricted                      | Database flag, API authorization                             | Privacy toggle errors            |
| F8   | Quiz Editing             | Should   | Medium     | Users can edit existing quizzes                                            | User modifies quiz details; changes are saved and reflected immediately                             | API versioning, optimistic locking                           | Concurrent edits                 |
| F9   | Question Types           | Should   | Medium     | Support multiple question types (e.g., multiple choice, true/false)        | User selects question type; UI adapts and validates input accordingly                               | Flexible schema design                                       | Unsupported types                |

### Quiz Taking
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F10  | Quiz Access              | Must     | Low        | Users can take public quizzes or private ones they’re authorized for       | User views and completes quiz; results are shown post-submission                                    | API endpoint security                                        | Unauthorized access attempts     |
| F11  | Quiz Results             | Must     | Medium     | Display score and correct answers after quiz completion                    | User finishes quiz; sees score and answer breakdown                                                 | Result calculation logic                                     | Partial submissions              |
| F12  | Responsive Design        | Must     | Medium     | Quiz-taking works seamlessly across devices                                | Quiz UI adapts to mobile, tablet, and desktop without functionality loss                            | Tailwind CSS, media queries                                  | Browser compatibility            |

### Social Features
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F13  | Quiz Sharing             | Must     | Low        | Users can share public quizzes via links                                   | User generates shareable link; others access quiz via link                                          | URL generation, shortlink option                             | Broken links                     |
| F14  | Quiz Rating              | Should   | Medium     | Users can rate quizzes they’ve taken                                       | User submits 1-5 star rating; average displayed on quiz page                                        | Database aggregation                                         | Spam ratings                     |
| F15  | Public Quiz Discovery    | Should   | Medium     | Browse and search public quizzes                                           | User finds quizzes by keyword or category; results are relevant                                    | Search indexing (e.g., PostgreSQL full-text search)          | No results found                 |

### Real-Time Quiz Sessions
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F16  | Live Session Hosting     | Must     | High       | Users can host live quiz sessions with real-time participation             | Host starts session; participants join and answer in real time                                      | WebSocket, STOMP protocol                                    | Session crashes                  |
| F17  | Real-Time Leaderboards   | Must     | High       | Display live scores during quiz sessions                                   | Scores update instantly as participants answer; leaderboard reflects ranking                        | WebSocket pub/sub, server-side state                         | Ties in scoring                  |
| F18  | Session Synchronization  | Must     | High       | Sync quiz timing across participants                               | All users see questions and timers aligned with server time                                         | Server-client clock sync                                     | Network latency                  |
| F19  | User Presence Tracking   | Should   | Medium     | Show who’s active in a live session                                        | Participants see list of active users; updates on join/leave                                        | WebSocket events                                             | Ghost users                      |

### User Profiles
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F20  | Profile Creation         | Must     | Low        | Users can create and view basic profiles                                   | Profile shows username, created quizzes; editable by owner                                          | Database entity, API endpoint                                | Duplicate usernames              |
| F21  | Quiz History             | Should   | Medium     | Display quizzes created and taken by the user                              | Profile lists user’s quiz activity with links to details                                            | Database queries, pagination                                 | Large history volumes            |

### AI Integration
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F22  | AI Quiz Generation       | Should   | High       | Generate quizzes from text prompts using OpenAI                            | User inputs prompt; AI returns quiz with questions and answers                                      | OpenAI API integration, rate limiting                        | Poor prompt quality              |
| F23  | Usage Limits             | Should   | Medium     | Restrict AI usage based on free/premium tier                               | Free users get limited generations; premium users get more                                          | Bucket4j, user tier tracking                                 | Overuse attempts                 |

### PDF Processing
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F24  | PDF Quiz Generation      | Should   | High       | Create quizzes from uploaded PDF content                                   | User uploads PDF; system extracts text and generates quiz                                           | Apache PDFBox, text parsing                                  | Corrupted PDFs                   |

### Payment Processing
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F25  | Subscription Model       | Should   | High       | Offer premium features via subscription                                    | User subscribes via Stripe; gains access to premium features                                        | Stripe integration, webhook handling                         | Payment failures                 |

### Platform Infrastructure
| ID   | Feature                  | Priority | Complexity | Description                                                                 | Acceptance Criteria                                                                                   | Technical Considerations                                      | Edge Cases                       |
|------|--------------------------|----------|------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------|
| F26  | Cost-Effective Hosting   | Must     | Medium     | Deploy on free/low-cost platforms (e.g., Railway, Render)                  | App runs within free tier limits; scales down when idle                                            | Sleep/wake functionality                                     | Resource exhaustion              |
| F27  | Progressive Web App      | Could    | Medium     | Enable offline access and app-like experience                              | Users install PWA; basic features work offline                                                      | Next.js PWA setup                                            | Cache issues                     |
| F28  | CI/CD Pipeline           | Must     | Medium     | Automate builds and deployments                                    | Code commits trigger tests and deployment; failures are flagged                                     | GitHub Actions configuration                                 | Failed deployments               |

## Summary
- **Total Features:** 28
- **By Priority:**
  - Must Have: 14
  - Should Have: 12
  - Could Have: 1
  - Won’t Have: 0
- **By Category:**
  - User Authentication: 5
  - Quiz Creation: 4
  - Quiz Taking: 3
  - Social Features: 3
  - Real-Time Quiz Sessions: 4
  - User Profiles: 2
  - AI Integration: 2
  - PDF Processing: 1
  - Payment Processing: 1
  - Platform Infrastructure: 3
- **Complexity Breakdown:**
  - Low: 5
  - Medium: 13
  - High: 10

---

### Clarifications Needed
The PRD is well-detailed, but a few points require clarification:
1. **Question Types (F9):** The PRD mentions "multiple question types" but doesn’t specify which ones. Are multiple choice and true/false sufficient, or are others (e.g., open-ended) expected?
2. **Premium Features (F3, F25):** The PRD implies AI generation and PDF processing are premium, but this isn’t explicit. Which features are definitively premium?
3. **Live Session Scale (F16):** What’s the expected max number of participants per session to ensure free-tier hosting suffices?

These can be resolved with the product owner before finalizing the feature list for development. The current `features.md` assumes reasonable defaults (e.g., basic question types, AI/PDF as premium, small-scale live sessions).