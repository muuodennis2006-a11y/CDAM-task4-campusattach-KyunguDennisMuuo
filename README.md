# CampusAttach Backend

## Student Attachment and Internship Opportunity Platform

CampusAttach is a web-based platform designed to help university students discover, apply for, and track attachment and internship opportunities in one organized system.

This repository contains the **Task 4 backend** of the CampusAttach project. The backend provides secure REST APIs for authentication, authorization, opportunities, applications, administration, and database operations.

---

## 1. Project Overview

Students often find attachment and internship opportunities through scattered sources such as WhatsApp groups, social media, university notices, company websites, and personal contacts.

CampusAttach provides a centralized platform where:

- Students can create accounts and manage their profiles.
- Students can browse, search, and filter opportunities.
- Students can view opportunity details and submit applications.
- Students can track their applications.
- Organizations can create and manage opportunity listings.
- Organizations can review applications and update application statuses.
- Administrators can manage users and moderate opportunities.

---

## 2. Task 4 Objective

The objective of Task 4 is to develop the backend REST API that supports the CampusAttach application.

The backend provides:

- RESTful API endpoints
- User registration and login
- JWT authentication
- Password hashing using bcrypt
- Role-based access control
- Request validation
- Opportunity management
- Application management
- Administrative management
- PostgreSQL database connectivity through Prisma ORM
- API documentation through Swagger/OpenAPI
- Environment-based configuration
- Secure error handling

---

## 3. User Roles

CampusAttach has three main roles.

### Student

Students can:

- Register and log in.
- View their authenticated profile.
- Browse opportunities.
- Search and filter opportunities.
- View opportunity details.
- Apply for opportunities.
- View their applications.

### Organization

Organizations can:

- Register and log in.
- Create opportunities.
- View opportunities.
- Update their own opportunities.
- Delete their own opportunities.
- View applicants for their opportunities.
- Update application statuses.

### Administrator

Administrators can:

- View users.
- Activate or deactivate users.
- View opportunities.
- Moderate opportunity statuses.

---

## 4. Technology Stack

### Backend

- NestJS
- TypeScript
- Node.js
- REST API

### Authentication and Security

- JWT
- Passport
- bcrypt
- Role-based access control
- Class-validator
- Class-transformer

### Database

- PostgreSQL
- Prisma ORM

### API Documentation

- Swagger / OpenAPI

### Development Tools

- Git
- GitHub
- Postman
- Swagger UI
- npm

---

## 5. Backend Architecture

The backend follows a modular NestJS architecture.

```text
Client / Angular Frontend
          |
          v
      REST API
          |
          v
   NestJS Controllers
          |
          v
      Services
          |
          v
     Prisma ORM
          |
          v
      PostgreSQL
```

The main backend modules include:

```text
src/
├── admin/
├── applications/
├── auth/
├── common/
│   ├── decorators/
│   └── guards/
├── opportunities/
├── prisma/
├── app.module.ts
└── main.ts
```

---

## 6. Database Entities

The backend uses the following main entities:

### User

Stores authentication and account information.

Important fields include:

- `id`
- `fullName`
- `email`
- `passwordHash`
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

### StudentProfile

Stores student-specific information.

### Organization

Stores organization-specific information.

### Opportunity

Stores attachment and internship opportunities.

### Application

Stores student applications and their statuses.

---

## 7. Application Statuses

Applications can have the following statuses:

- `Pending`
- `Shortlisted`
- `Accepted`
- `Rejected`

---

## 8. Opportunity Statuses

Opportunities support the following statuses:

- `Open`
- `Closed`
- `Pending`
- `Rejected`

Students can only apply to opportunities that are open and have not passed their deadline.

---

## 9. Authentication

CampusAttach uses JWT-based authentication.

### Registration

Users register with:

- Full name
- Email
- Password
- Role

Passwords are hashed with bcrypt before being stored.

### Login

After successful login, the API returns a JWT access token.

Protected endpoints require the token in the HTTP Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Role-Based Access Control

Protected endpoints check the authenticated user's role before allowing access.

Examples:

- Student-only endpoints require `STUDENT`.
- Organization-only endpoints require `ORGANIZATION`.
- Administrator endpoints require `ADMIN`.

---

## 10. Environment Configuration

Sensitive configuration values are stored in environment variables.

Create a local `.env` file containing values similar to:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/campusattach"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="1d"
PORT=3000
```

The `.env` file must not be committed to GitHub.

Use `.env.example` as the configuration template.

---

## 11. Installation

### Prerequisites

Install:

- Node.js
- npm
- PostgreSQL

### Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd campusattach-backend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file using `.env.example` as a guide.

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply the database schema

```bash
npx prisma migrate dev
```

---

## 12. Running the Application

### Development mode

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
```

### Production mode

```bash
npm run start:prod
```

---

## 13. Swagger API Documentation

Swagger UI is available during local development at:

```text
http://localhost:3000/api
```

Swagger provides an interactive interface for:

- Viewing API endpoints
- Viewing request schemas
- Testing API endpoints
- Authorizing JWT protected requests
- Reviewing response structures

For protected endpoints, use the Swagger **Authorize** button and enter only the JWT token.

Swagger will automatically add the `Bearer` prefix.

---

## 14. Main API Areas

### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/profile
```

### Opportunities

```http
GET    /opportunities
GET    /opportunities/:id
POST   /opportunities
PATCH  /opportunities/:id
DELETE /opportunities/:id
```

### Applications

```http
POST  /opportunities/:id/applications
GET   /applications/my
GET   /opportunities/:id/applications
PATCH /applications/:id/status
```

### Administration

```http
GET   /admin/users
PATCH /admin/users/:id/status
GET   /admin/opportunities
PATCH /admin/opportunities/:id/status
```

Detailed endpoint documentation is available in `API.md`.

---

## 15. Search, Filtering and Pagination

The opportunity listing endpoint supports:

- Keyword search
- Opportunity type filtering
- Location filtering
- Status filtering
- Pagination

Example:

```http
GET /opportunities?q=software&type=INTERNSHIP&location=Nairobi&page=1&limit=10
```

The API returns opportunity data together with pagination information.

The pagination limit is protected so clients cannot request excessively large result sets.

---

## 16. Validation and Error Handling

Request DTOs are used to validate incoming data.

The backend validates important fields such as:

- Email addresses
- Passwords
- Required opportunity fields
- Opportunity types
- Application data
- Status values

The API returns appropriate HTTP status codes for common errors.

Examples include:

- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

Sensitive implementation details should not be exposed to API clients.

---

## 17. Application Business Rules

The backend enforces important CampusAttach rules.

### Authentication

Protected functionality requires authentication.

### Authorization

Users can only perform actions allowed by their roles.

### Opportunity ownership

Organizations can update or delete only opportunities belonging to their organization.

### Application ownership

Students can view their own applications.

Organizations can manage applications belonging to their own opportunities.

### Duplicate applications

A student cannot apply to the same opportunity more than once.

### Closed opportunities

Students cannot apply to closed opportunities.

### Expired opportunities

Students cannot apply after an opportunity deadline has passed.

---

## 18. Security Measures

The backend applies several security practices:

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Protected routes
- DTO validation
- Environment variables for secrets
- Database constraints
- Ownership checks
- Duplicate application prevention
- Controlled error responses

Secrets such as database passwords and JWT secrets are not stored in the source repository.

---

## 19. Testing

The API can be tested using:

- Swagger UI
- Postman

Recommended testing flow:

1. Register a student.
2. Register an organization.
3. Log in as the organization.
4. Create an opportunity.
5. Log in as the student.
6. Browse opportunities.
7. View opportunity details.
8. Apply for an opportunity.
9. Log in as the organization.
10. View applicants.
11. Update an application status.
12. Verify the updated status as the student.

---

## 20. Build Verification

The backend production build is verified using:

```bash
npm run build
```

A successful build confirms that the NestJS TypeScript project compiles without TypeScript build errors.

---

## 21. Project Structure

```text
campusattach-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── admin/
│   ├── applications/
│   ├── auth/
│   ├── common/
│   │   ├── decorators/
│   │   └── guards/
│   ├── opportunities/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── API.md
├── package.json
├── prisma.config.ts
└── README.md
```

---

## 22. Current Task Scope

This repository represents **CDAM Task 4 - Backend Development**.

Task 4 focuses on the backend REST API and its supporting services.

Database-focused work, deployment, and final frontend-backend production integration are handled in later project tasks.

---

## 23. Future Improvements

Possible future improvements include:

- Email notifications
- Password reset
- Advanced student-opportunity matching
- File/CV uploads
- Application analytics
- Organization verification
- Admin dashboard improvements
- Automated testing
- Cloud deployment
- Production monitoring
- Rate limiting
- More advanced security controls

---

## 24. Author

**Kyungu Dennis Muuo**

CampusAttach

Student Attachment and Internship Opportunity Platform

---

## 25. License

This project was developed as part of the CDAM Chuka University Internship Programme.

The project is intended for academic and educational purposes.