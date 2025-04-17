# RULES.md

This document outlines the technical and general guidelines for full-stack development of the Uznai quiz platform. These rules ensure consistency, quality, and alignment with project requirements across backend and frontend development.

## TABLE OF CONTENTS

1. [BACKEND TECHNOLOGY STACK](#1-backend-technology-stack)
2. [FRONTEND TECHNOLOGY STACK](#2-frontend-technology-stack)
3. [BACKEND TECHNICAL PREFERENCES](#3-backend-technical-preferences)
4. [FRONTEND TECHNICAL PREFERENCES](#4-frontend-technical-preferences)
5. [BACKEND DEVELOPMENT STANDARDS](#5-backend-development-standards)
6. [FRONTEND DEVELOPMENT STANDARDS](#6-frontend-development-standards)
7. [IMPLEMENTATION PRIORITIES](#7-implementation-priorities)
8. [GENERAL GUIDELINES](#8-general-guidelines)
9. [DATABASE MANAGEMENT](#9-database-management)
10. [INFRASTRUCTURE AND DEPLOYMENT](#10-infrastructure-and-deployment)
11. [API INTEGRATION](#11-api-integration)
12. [COLLABORATIVE DEVELOPMENT](#12-collaborative-development)

## 1. BACKEND TECHNOLOGY STACK

### Core Technologies
- **Java**: JDK 21 LTS
- **Spring Boot**: v3.2.0 or latest stable
- **Spring Framework**:
  - Spring Web MVC
  - Spring Security
  - Spring Data JPA
  - Spring WebSocket
- **PostgreSQL**: v15 or latest stable
- **Redis**: Latest stable (optional, can be replaced with in-memory solution)

### Required Libraries
- **JJWT (JSON Web Token)**: v0.11.5 or latest stable
- **Apache PDFBox**: v2.0.27 or latest stable for PDF processing
- **OpenAI API Client**: v0.14.0 or latest stable
- **Flyway**: Latest stable for database migrations
- **Lombok**: Latest stable for reducing boilerplate
- **MapStruct**: Latest stable for object mapping
- **SLF4J & Logback**: Latest stable for logging
- **Bucket4j**: Latest stable for rate limiting

### Development Tools
- **Maven**: Latest stable for dependency management
- **JUnit 5**: Latest stable for unit testing
- **Mockito**: Latest stable for mocking
- **Testcontainers**: Latest stable for integration testing
- **Jacoco**: Latest stable for code coverage
- **SonarQube/SonarLint**: Latest stable for code quality analysis

## 2. FRONTEND TECHNOLOGY STACK

### Core Technologies
- **React**: v18.2.0 or latest stable
- **Next.js**: v14.0.0 or latest stable
- **TypeScript**: v5.1.0 or latest stable
- **Tailwind CSS**: v3.3.0 or latest stable
- **shadcn/ui**: Latest stable for component library

### Required Libraries
- **TanStack Query** (React Query): v5.0.0 or latest stable for data fetching
- **React Hook Form**: Latest stable for form handling
- **Zod**: Latest stable for schema validation
- **SockJS-client**: Latest stable for WebSocket support
- **STOMP.js**: Latest stable for STOMP messaging
- **date-fns**: Latest stable for date manipulation
- **Axios**: Latest stable for HTTP requests
- **Lucide React**: Latest stable for icons

### Development Tools
- **ESLint**: Latest stable with react and typescript configurations
- **Prettier**: Latest stable
- **Jest**: Latest stable for unit testing
- **Testing Library**: Latest stable for component testing
- **Storybook**: Latest stable for component development

## 3. BACKEND TECHNICAL PREFERENCES

### Naming Conventions
- **Classes**: PascalCase, descriptive names matching their purpose
- **Methods**: camelCase, action verbs describing functionality
- **Variables**: camelCase, meaningful names (avoid acronyms unless widely recognized)
- **Constants**: UPPER_SNAKE_CASE
- **Packages**: lowercase, domain-driven naming (e.g., `com.uznai.quiz`)
- **Database Tables**: snake_case, plural forms (e.g., `quiz_questions`)
- **Database Columns**: snake_case (e.g., `created_at`)

### Code Organization

#### Package Structure
```
com.uznai/
├── config/              # Configuration classes
├── controller/          # REST controllers
│   ├── websocket/       # WebSocket controllers
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   ├── response/        # Response DTOs
├── entity/              # JPA entities
├── exception/           # Custom exceptions
├── repository/          # Spring Data repositories
├── service/             # Service layer classes
│   ├── impl/            # Service implementations
├── mapper/              # Object mappers (DTOs <-> Entities)
├── util/                # Utility classes
└── security/            # Security-related classes
```

### Architectural Patterns
- **Layered Architecture**: Controller -> Service -> Repository
- **Dependency Injection**: Constructor injection preferred over field injection
- **Repository Pattern**: Use Spring Data JPA repositories
- **DTO Pattern**: Use DTOs for API request/response, never expose entities directly
- **Service Facade Pattern**: Aggregate complex operations in service layer

### Java 21 Features to Leverage
- **Virtual Threads**: Use for handling concurrent WebSocket connections and long-running operations
- **Pattern Matching**: Utilize for cleaner code in type checks and data extraction
- **Record Classes**: Use for immutable DTOs and value objects
- **Sealed Classes**: Use for modeling closed hierarchies where appropriate
- **Text Blocks**: Use for multiline strings, SQL queries, and JSON templates
- **Switch Expressions**: Use for cleaner conditional logic
- **Structured Concurrency**: Use for managing complex concurrent operations

### Data Handling
- **ORM**: Use JPA/Hibernate with proper entity mapping
- **Transactions**: Use Spring's declarative transaction management
- **Data Validation**: Validate all input at controller level with Bean Validation API
- **Pagination**: Implement for all list endpoints returning potentially large datasets
- **Sorting & Filtering**: Support for endpoints returning collections

### API Design
- **RESTful Principles**: Follow REST conventions for API design
- **API Versioning**: Use URL versioning (e.g., `/api/v1/quizzes`)
- **Status Codes**: Use appropriate HTTP status codes
- **Error Responses**: Standardized error response format
- **Documentation**: Use Spring Doc OpenAPI (Swagger) for API documentation

### WebSocket Implementation
- **STOMP Protocol**: Use STOMP over WebSocket
- **Topics & Queues**: Organize message destinations by feature
- **Security**: Apply authentication for WebSocket connections
- **Session Management**: Track and manage active sessions
- **Virtual Threads**: Utilize for improved scalability with many concurrent connections

### Performance Requirements
- **Connection Pooling**: Configure appropriate DB connection pool size
- **Caching**: Implement caching for frequently accessed data
- **Query Optimization**: Use indexed queries and query optimization
- **Pagination**: Limit result sets for large collections
- **Asynchronous Processing**: Use for long-running operations
- **Virtual Thread Optimization**: Use for I/O-bound operations instead of traditional thread pools

### Security Practices
- **JWT Authentication**: 
  - Implement stateless JWT-based authentication
  - Use refresh tokens for extended sessions
  - Implement token blacklisting for logout
  - Set appropriate token expiration times
- **Password Security**:
  - Use BCrypt for password hashing
  - Implement password strength validation
  - Secure password reset flow
- **Role-Based Access Control**:
  - Implement Spring Security roles/authorities
  - Use method-level security annotations
  - Validate role assignments
- **Input Validation**:
  - Sanitize and validate all input
  - Use Bean Validation API
  - Implement custom validators where needed
- **Security Headers**:
  - Set appropriate security headers
  - Configure CORS policies
  - Implement rate limiting

## 4. FRONTEND TECHNICAL PREFERENCES

### Naming Conventions
- **Files and Folders**: Use kebab-case for file names (e.g., `quiz-creator.tsx`)
- **React Components**: Use PascalCase (e.g., `QuizCreator.tsx`)
- **Hooks**: Prefix with `use` and use camelCase (e.g., `useQuizData.ts`)
- **Context**: Suffix with `Context` (e.g., `QuizContext.tsx`)
- **TypeScript Types/Interfaces**: Use PascalCase (e.g., `QuizQuestion.ts`)
- **CSS/Tailwind**: Use BEM-like naming for custom classes

### Code Organization

#### Folder Structure
```
src/
├── app/                  # Next.js app router pages
├── components/           # UI components
│   ├── ui/               # shadcn/ui components
│   ├── quiz/             # Quiz-related components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and constants
├── hooks/                # Custom React hooks
├── services/             # API service functions
├── types/                # TypeScript types and interfaces
├── contexts/             # React contexts
└── styles/               # Global styles
```

### Architectural Patterns
- **Component Composition**: Prefer small, focused components with explicit props
- **Container/Presentational Pattern**: Separate data fetching from UI rendering
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Context API**: Use for global state that many components need
- **Page-based Architecture**: Follow Next.js app router organization

### State Management
- Use **React Context** for global state (user info, theme, etc.)
- Use **TanStack Query** for server state management (caching, refetching, etc.)
- Use **React useState/useReducer** for local component state
- Avoid prop drilling; use context or composition

### API Interactions
- Create service modules for API calls under `services/`
- Use TanStack Query for data fetching, caching, and synchronization
- Implement error handling for all API calls
- Use TypeScript for strong typing of request/response data
- Use Axios for HTTP requests with a configured base instance

### Performance Requirements
- Implement code-splitting using Next.js dynamic imports for large components
- Use Next.js Image component for optimized image loading
- Optimize bundle size with proper tree-shaking and import optimization
- Implement virtualized lists for long quiz lists
- Ensure Largest Contentful Paint (LCP) under 2.5 seconds
- Set up proper caching strategies for static assets

### Responsive Design
- Use Tailwind's responsive classes for all layouts
- Design mobile-first, then expand for larger screens
- Test on common breakpoints:
  - Mobile: 320px - 480px
  - Tablet: 481px - 768px
  - Laptop: 769px - 1024px
  - Desktop: 1025px+
- Ensure all interactive elements are touch-friendly (min 44px × 44px tap targets)

## 5. BACKEND DEVELOPMENT STANDARDS

### Testing Requirements
- **Unit Tests**: Minimum 80% code coverage for service layer
- **Integration Tests**: For all controllers and repositories
- **Mock Testing**: Use Mockito for service layer unit tests
- **Database Tests**: Use Testcontainers for repository tests
- **Security Tests**: Test authentication and authorization
- **Performance Tests**: For critical endpoints and operations
- **Virtual Thread Tests**: Verify behavior with virtual threads for concurrent operations

### Documentation Standards
- **Javadoc**: For all public classes and methods
- **API Documentation**: Use OpenAPI/Swagger annotations
- **README**: Update with setup instructions and important notes
- **Architecture Documentation**: Document design decisions

### Error Handling
- **Global Exception Handling**: Implement ControllerAdvice for consistent error responses
- **Custom Exceptions**: Create domain-specific exceptions
- **Validation Errors**: Return detailed validation error messages
- **Logging**: Log exceptions with context but without sensitive data
- **Graceful Degradation**: Handle external service failures gracefully

### Logging Requirements
- **Log Levels**: Use appropriate log levels (ERROR, WARN, INFO, DEBUG)
- **Contextual Information**: Include relevant context in logs
- **Sensitive Data**: Never log sensitive information
- **Performance**: Avoid excessive logging in high-throughput paths
- **Format**: Use structured logging where possible

## 6. FRONTEND DEVELOPMENT STANDARDS

### Testing Requirements
- Minimum 70% code coverage for components and hooks
- Unit tests for all utility functions
- Integration tests for key user flows:
  - Authentication
  - Quiz creation
  - Quiz taking
  - Live sessions
- Use Jest and Testing Library for tests
- Write tests alongside feature development

### Documentation Standards
- Add JSDoc comments for all functions, hooks, and components
- Document props using TypeScript interface comments
- Include usage examples for complex components
- Add README files for major feature folders
- Use Storybook for component documentation

### Error Handling
- Implement error boundaries for component failures
- Create consistent error UI components
- Log errors to console in development
- Implement graceful fallbacks for API failures
- Use toast notifications for user-facing errors

### Accessibility Standards
- Follow WCAG 2.1 AA standards
- Ensure proper keyboard navigation
- Use semantic HTML elements
- Provide alt text for all images
- Maintain proper color contrast (minimum 4.5:1 for normal text)
- Test with screen readers
- Implement ARIA attributes where necessary

## 7. IMPLEMENTATION PRIORITIES

### Core Features (Phase 1)
- Backend:
  - User authentication and authorization
  - Basic quiz CRUD operations
  - User profile management
  - Database setup and migrations
- Frontend:
  - User authentication UI
  - Basic user profile
  - Quiz creation interface
  - Quiz taking functionality

### Advanced Features (Phase 2)
- Backend:
  - PDF processing and text extraction
  - OpenAI integration for quiz generation
  - Quiz sharing and visibility controls
  - Rating and feedback system
- Frontend:
  - AI quiz generation UI
  - PDF upload and processing
  - Social sharing features
  - User ratings and feedback

### Real-time Features (Phase 3)
- Backend:
  - WebSocket infrastructure with virtual threads
  - Live quiz session management
  - Real-time leaderboard updates
  - Session state synchronization
- Frontend:
  - Live quiz sessions
  - Real-time leaderboards
  - User presence indicators
  - Session chat

### Quality Thresholds
- Backend:
  - All endpoints must have tests
  - Security audit must pass with no high/critical issues
  - API must be fully documented
  - Performance benchmarks must be met
- Frontend:
  - All core features must have test coverage
  - UI must be responsive across device sizes
  - Accessibility compliance for all features
  - Performance metrics must meet or exceed requirements

## 8. GENERAL GUIDELINES

### Following Requirements
- Implement features based on PRD specifications
- Ensure backward compatibility for API changes
- Consider future extensibility in design decisions
- Document assumptions when requirements are unclear
- Confirm understanding before implementing complex features
- Raise concerns early if requirements seem conflicting or unclear

### Code Quality
- Backend:
  - Follow clean code principles
  - Use Java coding conventions
  - Address all compiler warnings
  - Perform static code analysis before commits
  - Keep methods small and focused (max 30 lines)
  - Leverage Java 21 features for cleaner, more efficient code
- Frontend:
  - Use TypeScript strictly (no `any` types without justification)
  - Follow ESLint rules and fix all warnings
  - Format code with Prettier
  - Maintain consistent component structure
  - Use named exports for components
  - Limit component file size (max 300 lines, split if larger)

### Completeness
- No TODO comments in production code
- All features must include appropriate tests
- Complete error handling for all endpoints and user interactions
- Include proper documentation
- Handle edge cases appropriately
- No console.log statements in production code
- Every feature must be fully implemented before moving to the next
- Handle loading states for all asynchronous operations

### Handling Uncertainty
- When specifications are unclear, seek clarification
- Document design decisions and trade-offs
- Choose maintainable solutions over quick fixes
- Plan for future extensibility
- Document assumptions when clarification isn't available
- Favor simple implementations when details are missing
- Implement features in a way that allows for easy extension later

## 9. DATABASE MANAGEMENT

### Schema Design
- Use snake_case for table and column names
- Define appropriate constraints (PK, FK, unique)
- Set up indexes for frequently queried columns
- Implement soft delete where appropriate
- Use appropriate data types (e.g., use UUID for IDs)

### Migrations
- Use Flyway for database migrations
- Version migration scripts properly
- Make migrations forward-only
- Test migrations thoroughly before deployment
- Document schema changes

### Query Performance
- Optimize queries for performance
- Use EXPLAIN for query analysis
- Avoid N+1 query problems
- Use pagination for large result sets
- Consider read/write patterns in design

## 10. INFRASTRUCTURE AND DEPLOYMENT

### Deployment Considerations
- Configure for cost-effective hosting (Railway, Render, or Fly.io)
- Set up proper health checks
- Configure appropriate memory settings
- Implement graceful shutdown
- Set up CI/CD pipelines with GitHub Actions
- Ensure Java 21 compatibility with hosting platforms

### Environment Configuration
- Use environment variables for configuration
- Keep secrets out of code
- Use profiles for different environments
- Configure appropriate logging levels

### Monitoring and Maintenance
- Implement health check endpoints
- Set up application metrics
- Configure appropriate logging
- Plan for database maintenance
- Implement feature flags for gradual rollout
- Monitor virtual thread usage and performance

## 11. API INTEGRATION

### OpenAI Integration
- Implement proper error handling for API calls
- Set up rate limiting and usage tracking
- Cache results where appropriate
- Handle API outages gracefully
- Optimize prompts for efficiency and cost

### External Service Integration
- Use circuit breakers for external dependencies
- Implement timeouts for all external calls
- Cache external service responses when possible
- Handle service unavailability gracefully
- Document integration points thoroughly

## 12. COLLABORATIVE DEVELOPMENT

### Code Reviews
- All code must be reviewed before merging
- Address all review comments
- Use pull request templates for consistency
- Link PRs to relevant issues or tasks

### Version Control
- Use feature branches from main/master
- Write clear, descriptive commit messages
- Keep PRs focused on a single feature or bugfix
- Rebase feature branches on main before PR

### Communication
- Document complex implementation decisions
- Update team on blockers or requirement concerns
- Use issue/task tracking for feature development
- Share knowledge of reusable patterns or solutions
