# Product Requirements Document (PRD)
# Uznai - Interactive Quiz Creation and Sharing Platform

## Document Information
**Version:** 3.2  
**Date:** March 25, 2025  
**Status:** In Progress  
**Owner:** [Your Name]  

## Executive Summary
Uznai is a web-based application that allows users to create, share, and take quizzes. The platform supports both manual quiz creation and AI-assisted generation from prompts or PDF content. Users can build a profile, share their quizzes publicly or keep them private, and rate quizzes created by others. The application provides an intuitive interface for quiz creation and an engaging experience for quiz taking. A key feature is the ability to host and participate in live quiz sessions with real-time leaderboards, allowing for interactive, competitive quiz experiences.

## Problem Statement & Objectives

### Problem Statement
Current quiz creation platforms lack intuitive, AI-powered generation tools and real-time interaction capabilities. Educators, trainers, and event hosts struggle with time-consuming quiz creation processes and limited engagement options. Meanwhile, quiz takers face disjointed experiences across devices and difficulty finding quality content. Uznai addresses these pain points by combining AI-assisted content creation with interactive, real-time quiz experiences in a single platform.

### Objectives
- Provide an intuitive platform for users to create customized quizzes
- Enable AI-powered quiz generation from prompts and PDF content
- Create a social environment for sharing and rating quizzes
- Deliver a responsive experience that works across devices
- Implement a secure user authentication system with advanced session management
- Support real-time interactive quiz sessions with live leaderboards
- Maintain zero or minimal hosting costs using cost-effective infrastructure

## Technical Requirements

### Frontend
- React.js with Next.js framework
- Responsive design with Tailwind CSS
- State management with React Context API and TanStack Query
- SockJS/STOMP client for real-time communication
- Form validation and handling with comprehensive error feedback
- Progressive Web App capabilities
- Browser compatibility: Latest versions of Chrome, Firefox, Safari, Edge
- Component library: shadcn/ui with custom theming
- JWT token management with refresh token support
- Real-time profile updates and concurrent edit handling

### Backend
- Java Spring Boot application with Java 21
- Spring WebMVC for RESTful API endpoints
- Spring Security for authentication and authorization
- Spring WebSocket with STOMP for real-time features
- Spring Data JPA for database interactions
- JWT token-based authentication with refresh tokens
- Apache PDFBox for PDF processing
- OpenAI API integration for quiz generation
- Rate limiting with Bucket4j
- Logging with SLF4J and Logback
- Virtual Threads for improved scalability
- Concurrent profile update handling
- Real-time session management

### Database
- PostgreSQL for relational data storage
- Redis for session state and real-time features (optional, can be replaced with in-memory solution)
- JPA/Hibernate for ORM capabilities
- Flyway for database migrations
- Transaction management through Spring
- Optimistic locking for concurrent profile updates

### Infrastructure
- Railway.app, Render, or Fly.io for Spring Boot hosting (free or low-cost tiers)
- PostgreSQL hosting through Railway, Render, or ElephantSQL (free tier)
- Redis through Redis Labs free tier (optional)
- AWS S3 or Cloudinary free tier for file storage
- Stripe for payment processing
- GitHub Actions for CI/CD

### Authentication & Authorization
- JWT-based authentication with refresh token mechanism
- Role-based access control (USER, PREMIUM_USER)
- Secure password reset flow with email verification
- Session management with configurable timeouts
- Profile management with avatar support
- Remember me functionality for extended sessions
- Cross-device session synchronization
- Real-time profile updates

### Security Requirements
- BCrypt password hashing
- JWT token blacklisting for logout
- Rate limiting on authentication endpoints
- CORS configuration for API security
- Input validation and sanitization
- Secure headers configuration
- Protection against concurrent profile edits
- XSS and CSRF protection
- Secure file upload handling

## Hosting Cost Estimates

### Cost-Saving Options

| Service | Plan | Estimated Cost |
|---------|------|----------------|
| Railway.app | Starter (5$/month credit for 3 months) | $0 for initial 3 months |
| Render | Free Tier for web service | $0 (with sleep after inactivity) |
| Fly.io | Free Tier (3 shared-cpu-1x 256MB VMs) | $0 |
| ElephantSQL | Tiny Turtle (20MB) | $0 |
| Supabase | Free Tier (500MB PostgreSQL) | $0 |
| Redis Labs | Free Tier (30MB) | $0 |
| Cloudinary | Free Tier (up to 25GB storage) | $0 |
| OpenAI API | Pay-as-you-go (limited usage) | $5-10/month (can be paused) |
| **Total Estimated Monthly Cost** | | **$0-10/month** |

### Cost-Saving Considerations
- Limit OpenAI API usage to essential features and pause when not required
- Use in-memory solutions instead of Redis where possible
- Implement sleep/wake functionality to stay within free tier limits
- Optimize resource usage for concurrent users on free tier instances
- Leverage Java 21 virtual threads for improved scalability without increasing hosting costs
- Implement efficient caching strategies for profile data
- Optimize avatar storage and retrieval

## Technical Architecture

### Spring Boot Application Structure
- Controller layer for REST endpoints and WebSocket handlers
- Service layer for business logic
- Repository layer for data access
- DTO objects for API requests/responses
- Entity classes for database models
- Configuration classes for security, websockets, etc.
- Concurrent update handling for profile management

### Real-time Communication
- Spring WebSocket with STOMP messaging protocol
- SockJS for client-side compatibility
- Session management with Spring Session
- User presence tracking with WebSocket events
- Virtual Threads for efficient WebSocket connection handling
- Real-time profile update notifications

### Authentication & Security
- Spring Security with JWT token authentication
- Role-based access control for premium features
- CORS configuration for frontend access
- XSS and CSRF protection
- Refresh token mechanism
- Remember me functionality
- Concurrent session management

### Live Sessions Implementation
- WebSocket topics for session rooms
- Pub/Sub pattern for broadcasting updates
- Server-side session state management
- Client synchronization with server timing
- Virtual Threads for handling concurrent connections efficiently
- Real-time leaderboard updates

## Implementation Phases

### Phase 1: Core Infrastructure (Completed)
- Basic project setup with Spring Boot and Next.js
- Database initialization with PostgreSQL and Flyway migrations
- CI/CD pipeline with GitHub Actions
- Development environment configuration
- Virtual thread configuration for improved scalability
- Basic health check endpoints
- Initial security configurations

### Phase 2: Authentication & Profile (In Progress)
- User registration and login with JWT and refresh tokens
- JWT authentication with remember me functionality
- Password reset flow with email verification
- Comprehensive profile management with avatar support
- Role-based access control (USER, PREMIUM_USER)
- Real-time profile updates with optimistic locking
- Avatar upload and management with Cloudinary
- Session management with cross-device synchronization

### Phase 3: Advanced Features (Planned)
- WebSocket implementation with virtual threads for real-time features
- AI quiz generation integration with OpenAI API
- PDF processing capability with Apache PDFBox
- Payment integration with Stripe
- Live quiz session functionality with real-time leaderboards
- Quiz sharing and discovery features
- Rating and social interaction system

### Phase 4: Deployment & Optimization (Planned)
- Deployment to cost-effective hosting platforms (Railway.app/Render/Fly.io)
- Performance optimization with virtual threads
- Comprehensive testing suite
- Final security enhancements
- Production monitoring setup
- Cost optimization for free tier limits

## Appendix: Spring Boot Implementation Details

### Key Dependencies
```xml
<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<!-- PDF Processing -->
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>2.0.27</version>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- OpenAI API Client -->
<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.14.0</version>
</dependency>

<!-- Redis (Optional) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### Java 21 Configuration
```java
// Main application configuration
@SpringBootApplication
public class UznaiApplication {
    public static void main(String[] args) {
        SpringApplication.run(UznaiApplication.class, args);
    }
    
    // Configure Spring to use virtual threads for servlet requests
    @Bean
    public TomcatProtocolHandlerCustomizer<?> protocolHandlerVirtualThreadExecutorCustomizer() {
        return protocolHandler -> {
            protocolHandler.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        };
    }
    
    // Executor service for general application tasks using virtual threads
    @Bean
    public ExecutorService applicationTaskExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }

    // Configure WebSocket with virtual threads
    @Bean
    public WebSocketHandlerDecoratorFactory webSocketHandlerDecoratorFactory() {
        return handler -> new WebSocketHandlerDecorator(handler) {
            @Override
            public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
                Thread.startVirtualThread(() -> {
                    try {
                        super.handleMessage(session, message);
                    } catch (Exception e) {
                        // Handle exception
                    }
                });
            }
        };
    }
}
```
