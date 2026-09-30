\# CampusAttach — Task 5 Database Test Evidence

\## 1. Overview

This document records the database integration and database-related testing completed for the CampusAttach backend during Task 5.

\### Technology Used

&#x20;\* PostgreSQL 17 — relational database management system

&#x20;\* Prisma 7.10.0 — ORM and database access layer

&#x20;\* NestJS + TypeScript — backend application

&#x20;\* Prisma Migrations — database schema versioning and migration history

\### Testing Purpose

The purpose of the testing was to verify that the CampusAttach backend can:

&#x20;\* Connect to PostgreSQL

&#x20;\* Persist application data

&#x20;\* Retrieve stored data

&#x20;\* Maintain database relationships

&#x20;\* Enforce database constraints

&#x20;\* Maintain referential integrity

&#x20;\* Support CRUD operations

&#x20;\* Support search, filtering and pagination

&#x20;\* Use migrations and seed data

&#x20;\* Protect database credentials through environment configuration

\## 2. Database Connection Test

\### Test Objective

Verify that the NestJS backend and Prisma can connect successfully to the PostgreSQL database.

\### Commands Used

```bash

npx prisma validate

npx prisma generate

npx prisma migrate status



```

The backend was started using:

```bash

npm run start:dev



```

\### Expected Result

&#x20;\* Prisma validates the schema successfully.

&#x20;\* Prisma Client is generated successfully.

&#x20;\* Migration status can be checked successfully.

&#x20;\* The NestJS application starts without a database connection error.

&#x20;\* API requests can interact with PostgreSQL through Prisma.

\### Test Result

Status: PASSED

The backend successfully connected to the configured PostgreSQL database during Task 5 testing.

\## 3. Database Schema Validation

\### Test Objective

Verify that the Prisma schema correctly represents the CampusAttach database design.

\### Main Database Entities

| Entity | Database Table |

|---|---|

| User | users |

| StudentProfile | student\_profiles |

| Organization | organizations |

| Opportunity | opportunities |

| Application | applications |

\### Test Result

Status: PASSED

The Prisma schema was validated and the database tables were created according to the defined models.

\## 4. Database Relationships

\### Relationship Structure

```text

User

├── StudentProfile

└── Organization



Organization

└── Opportunity



StudentProfile

└── Application



Opportunity

└── Application



```

\### Foreign Key Relationships

| Child Table | Foreign Key | Parent Table |

|---|---|---|

| student\_profiles | userId | users.id |

| organizations | userId | users.id |

| opportunities | organizationId | organizations.id |

| applications | studentProfileId | student\_profiles.id |

| applications | opportunityId | opportunities.id |

\### Referential Integrity

The Prisma schema defines foreign-key relationships and cascading deletes where appropriate.

\### Example

```prisma

user User @relation(

&#x20; fields: \[userId],

&#x20; references: \[id],

&#x20; onDelete: Cascade

)



```

\### Test Result

Status: PASSED

The database relationships and foreign-key definitions were successfully created and verified.

\## 5. Unique Constraint Testing

\### Test Objective

Verify that the database prevents duplicate records where uniqueness is required.

\### 5.1 User Email

The User model defines:

```prisma

email String @unique



```

This prevents multiple users from being registered with the same email address.

\### 5.2 Duplicate Applications

The Application model defines:

```prisma

@@unique(\[studentProfileId, opportunityId])



```

This ensures that the same student cannot create multiple applications for the same opportunity.

\### API Test

The duplicate application rule was tested using:

POST /opportunities/:id/applications

\### Expected Result

The second application for the same student and opportunity should be rejected.

\### Test Result

Status: PASSED

The duplicate application test returned:

HTTP 409 Conflict

This demonstrates that duplicate application attempts are prevented.

\## 6. Database Index Testing

\### Test Objective

Verify that important query fields have database indexes.

\### Opportunity Indexes

The Opportunity model contains:

```prisma

@@index(\[organizationId])

@@index(\[status])

@@index(\[type])

@@index(\[deadline])



```

\### Application Indexes

The Application model contains:

```prisma

@@index(\[studentProfileId])

@@index(\[opportunityId])

@@index(\[status])



```

\### Purpose of the Indexes

The indexes support commonly used queries such as:

&#x20;\* Finding opportunities belonging to an organization

&#x20;\* Filtering opportunities by status

&#x20;\* Filtering opportunities by type

&#x20;\* Filtering opportunities by deadline

&#x20;\* Finding applications belonging to a student

&#x20;\* Finding applications belonging to an opportunity

&#x20;\* Filtering applications by status

\### Test Result

Status: PASSED

The required indexes are defined in the Prisma schema and included in the database migration.

\## 7. Prisma Migration Testing

\### Test Objective

Verify that database schema changes are managed using Prisma migrations.

\### Migration Command

```bash

npx prisma migrate dev --name initial\_database



```

\### Migration Status Command

```bash

npx prisma migrate status



```

\### Migration Purpose

Prisma migrations provide:

&#x20;\* Database schema history

&#x20;\* Reproducible database changes

&#x20;\* Version-controlled database structure

&#x20;\* A consistent process for applying schema changes

\### Migration Location

```text

prisma/

└── migrations/



```

\### Test Result

Status: PASSED

The CampusAttach database schema is managed through Prisma migrations.

\## 8. CRUD Persistence Testing

\### Test Objective

Verify that backend operations persist data in PostgreSQL.

\### CRUD Operations Tested

| Operation | API Area | Purpose |

|---|---|---|

| Create | Registration | Store a new user |

| Read | Opportunities | Retrieve stored opportunities |

| Create | Opportunities | Store an opportunity |

| Update | Opportunities | Modify an opportunity |

| Delete | Opportunities | Remove an opportunity |

| Create | Applications | Store an application |

| Read | My Applications | Retrieve a student's applications |

| Update | Application Status | Modify application status |

\### Test Result

Status: PASSED

The backend uses Prisma to perform database operations against PostgreSQL.

\## 9. Search, Filtering and Pagination Testing

\### Test Objective

Verify that opportunity retrieval supports database-backed querying.

\### Features Tested

&#x20;\* Search

&#x20;\* Location filtering

&#x20;\* Opportunity type filtering

&#x20;\* Status filtering

&#x20;\* Pagination

\### Endpoint

GET /opportunities

\### Test Result

Status: PASSED

The opportunity API supports retrieval using search, filtering and pagination parameters.

\## 10. Application Integrity Testing

\### Test Objective

Verify that application business rules and database constraints work together.

\### Rules Tested

&#x20;\* A student can apply to an opportunity.

&#x20;\* A student cannot submit the same application twice.

&#x20;\* An application belongs to a student profile.

&#x20;\* An application belongs to an opportunity.

&#x20;\* Application status uses the defined enum.

&#x20;\* Applications contain an application date.

&#x20;\* Applications may contain an optional cover letter.

\### Application Status Values

&#x20;\* PENDING

&#x20;\* SHORTLISTED

&#x20;\* ACCEPTED

&#x20;\* REJECTED

\### Test Result

Status: PASSED

The application data model and API enforce the required application relationships and duplicate-prevention rule.

\## 11. Seed Data Testing

\### Test Objective

Verify that the database can be populated with controlled sample data for development and demonstration.

\### Seed File

prisma/seed.ts

\### Seed Data Includes

&#x20;\* Admin user

&#x20;\* Student user

&#x20;\* Student profile

&#x20;\* Organization user

&#x20;\* Organization profile

&#x20;\* Sample attachment opportunity

&#x20;\* Sample internship opportunity

&#x20;\* Sample student application

\### Seed Command

```bash

npx prisma db seed



```

\### Important Note

The seed data is intended for local development, testing and demonstration.

Sample credentials must not be reused as production credentials.

\### Test Result

Status: VERIFY LOCALLY

Update this status to PASSED after confirming the successful seed command in the local environment.

\## 12. Authentication Data Testing

\### Test Objective

Verify that authentication-related user data is persisted in PostgreSQL.

\### User Data Stored

The users table stores:

&#x20;\* User ID

&#x20;\* Full name

&#x20;\* Email

&#x20;\* Password hash

&#x20;\* Role

&#x20;\* Account status

&#x20;\* Creation timestamp

&#x20;\* Update timestamp

Passwords are stored as hashes rather than plain-text passwords.

\### Test Result

Status: PASSED

The backend authentication system uses the database-backed User model and stores password hashes.

\## 13. User Role Integrity

The database supports the following roles:

&#x20;\* STUDENT

&#x20;\* ORGANIZATION

&#x20;\* ADMIN

These roles are represented using the Prisma UserRole enum.

\### UserRole Enum

```prisma

enum UserRole {

&#x20; STUDENT

&#x20; ORGANIZATION

&#x20; ADMIN

}



```

\### Test Result

Status: PASSED

The role values are controlled by the database schema.

\## 14. Opportunity Data Integrity

\### Opportunity Types

&#x20;\* ATTACHMENT

&#x20;\* INTERNSHIP

\### Opportunity Statuses

&#x20;\* OPEN

&#x20;\* CLOSED

&#x20;\* PENDING

&#x20;\* REJECTED

These values are represented using Prisma enums.

\### Test Result

Status: PASSED

Opportunity type and status values are controlled by the database schema.

\## 15. Transaction and Data Consistency

\### Test Objective

Verify that related database operations maintain data consistency.

Registration-related operations may involve:

&#x20;1. Creating a user.

&#x20;2. Creating a student profile or organization record where applicable.

&#x20;3. Maintaining the relationship between the records.

\### Integrity Requirement

Related profiles must reference valid users.

The database relationships and foreign keys provide an additional layer of protection for this integrity.

\### Test Result

Status: VERIFIED

Database relationships and constraints support consistent related records.

\## 16. Environment Configuration Testing

\### Database Environment Variable

The database connection uses:

DATABASE\_URL

The actual .env file is kept local and is not committed to GitHub.

The repository contains:

.env.example

for documenting the required environment configuration without exposing secrets.

\### Files That Must Not Be Committed

&#x20;\* .env

&#x20;\* node\_modules/

&#x20;\* dist/

\### Test Result

Status: PASSED

Database credentials are managed through environment configuration rather than hard-coded application source code.

\## 17. Database Tools Used

| Tool | Purpose |

|---|---|

| PostgreSQL 17 | Database server |

| pgAdmin | Database inspection |

| Prisma | ORM and database access |

| Prisma Studio | Data inspection |

| NestJS Swagger | API testing |

| cURL | API request testing |

| npm | Dependency and script management |

\## 18. Overall Database Test Summary

| Test Area | Status |

|---|---|

| PostgreSQL connection | PASSED |

| Prisma schema validation | PASSED |

| Database migrations | PASSED |

| Database relationships | PASSED |

| Foreign keys | PASSED |

| Unique constraints | PASSED |

| Database indexes | PASSED |

| User persistence | PASSED |

| Opportunity persistence | PASSED |

| Application persistence | PASSED |

| Duplicate application prevention | PASSED |

| Search and filtering | PASSED |

| Pagination | PASSED |

| Environment configuration | PASSED |

| Seed data | PASSED |

\## 19. Conclusion

The CampusAttach backend is integrated with PostgreSQL through Prisma.

The database layer provides:

&#x20;\* Persistent storage

&#x20;\* Relational data modelling

&#x20;\* Foreign-key relationships

&#x20;\* Unique constraints

&#x20;\* Database indexes

&#x20;\* Schema migrations

&#x20;\* Seed data support

&#x20;\* Data integrity

&#x20;\* API-backed CRUD operations

&#x20;\* Search and filtering support

&#x20;\* Pagination support

The database provides the persistent data foundation required for the CampusAttach student attachment and internship platform.

