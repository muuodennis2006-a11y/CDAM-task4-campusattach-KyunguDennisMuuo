\# CampusAttach Backend API Documentation



\## Base URL



```text

http://localhost:3000

```



\## Swagger Documentation



```text

http://localhost:3000/api

```



Swagger provides interactive API documentation and testing.



\---



\# Authentication



Protected endpoints require a JWT access token.



Use the HTTP header:



```http

Authorization: Bearer <JWT\_TOKEN>

```



In Swagger, click \*\*Authorize\*\* and enter only the JWT token.



Do not type `Bearer` in the Swagger authorization field because Swagger adds it automatically.



\---



\# 1. Authentication Endpoints



\## Register



\### Endpoint



```http

POST /auth/register

```



\### Description



Creates a new CampusAttach user account.



\### Request Body



```json

{

&#x20; "fullName": "Dennis Kyungu",

&#x20; "email": "dennis@student.com",

&#x20; "password": "Campus123",

&#x20; "role": "STUDENT"

}

```



\### Supported Roles



```text

STUDENT

ORGANIZATION

ADMIN

```



\### Response



```json

{

&#x20; "message": "Registration successful",

&#x20; "user": {

&#x20;   "id": 1,

&#x20;   "fullName": "Dennis Kyungu",

&#x20;   "email": "dennis@student.com",

&#x20;   "role": "STUDENT",

&#x20;   "isActive": true

&#x20; }

}

```



\---



\## Login



\### Endpoint



```http

POST /auth/login

```



\### Request Body



```json

{

&#x20; "email": "dennis@student.com",

&#x20; "password": "Campus123"

}

```



\### Response



The API returns a JWT access token and authenticated user information.



```json

{

&#x20; "access\_token": "<JWT\_TOKEN>",

&#x20; "user": {

&#x20;   "id": 1,

&#x20;   "fullName": "Dennis Kyungu",

&#x20;   "email": "dennis@student.com",

&#x20;   "role": "STUDENT",

&#x20;   "isActive": true

&#x20; }

}

```



\---



\## Get Authenticated Profile



\### Endpoint



```http

GET /auth/profile

```



\### Authentication



Required.



\### Description



Returns information about the currently authenticated user.



\---



\# 2. Opportunity Endpoints



\## List Opportunities



\### Endpoint



```http

GET /opportunities

```



\### Authentication



Not required for browsing opportunities.



\### Query Parameters



| Parameter | Description |

|---|---|

| `q` | Search keyword |

| `type` | `ATTACHMENT` or `INTERNSHIP` |

| `location` | Filter by location |

| `status` | Filter by opportunity status |

| `page` | Page number |

| `limit` | Number of records per page |



\### Example



```http

GET /opportunities?q=software\&type=INTERNSHIP\&location=Nairobi\&page=1\&limit=10

```



\---



\## Get Opportunity Details



\### Endpoint



```http

GET /opportunities/:id

```



\### Example



```http

GET /opportunities/1

```



\### Description



Returns details for a specific opportunity.



\---



\## Create Opportunity



\### Endpoint



```http

POST /opportunities

```



\### Authentication



Required.



\### Role



```text

ORGANIZATION

```



\### Request Body



```json

{

&#x20; "title": "Software Development Intern",

&#x20; "type": "INTERNSHIP",

&#x20; "location": "Nairobi",

&#x20; "description": "Software development internship opportunity for university students.",

&#x20; "requirements": "Basic programming knowledge, Git and willingness to learn.",

&#x20; "deadline": "2026-12-31T23:59:59.000Z"

}

```



\---



\## Update Opportunity



\### Endpoint



```http

PATCH /opportunities/:id

```



\### Authentication



Required.



\### Role



```text

ORGANIZATION

```



\### Description



An organization can update only opportunities belonging to that organization.



\---



\## Delete Opportunity



\### Endpoint



```http

DELETE /opportunities/:id

```



\### Authentication



Required.



\### Role



```text

ORGANIZATION

```



\### Description



An organization can delete only its own opportunities.



\---



\# 3. Application Endpoints



\## Apply for Opportunity



\### Endpoint



```http

POST /opportunities/:id/applications

```



\### Authentication



Required.



\### Role



```text

STUDENT

```



\### Description



Allows a student to apply for an opportunity.



The backend prevents:



\- Duplicate applications.

\- Applications to closed opportunities.

\- Applications after the opportunity deadline.



\### Example



```http

POST /opportunities/1/applications

```



\### Optional Request Body



```json

{

&#x20; "coverLetter": "I am interested in this internship opportunity and would like to be considered."

}

```



\---



\## View My Applications



\### Endpoint



```http

GET /applications/my

```



\### Authentication



Required.



\### Role



```text

STUDENT

```



\### Description



Returns applications belonging to the authenticated student.



\---



\## View Opportunity Applicants



\### Endpoint



```http

GET /opportunities/:id/applications

```



\### Authentication



Required.



\### Role



```text

ORGANIZATION

```



\### Description



Returns applicants for an opportunity owned by the authenticated organization.



\---



\## Update Application Status



\### Endpoint



```http

PATCH /applications/:id/status

```



\### Authentication



Required.



\### Role



```text

ORGANIZATION

```



\### Request Body



```json

{

&#x20; "status": "SHORTLISTED"

}

```



\### Supported Statuses



```text

PENDING

SHORTLISTED

ACCEPTED

REJECTED

```



\### Description



Organizations can update application statuses for applications belonging to their own opportunities.



\---



\# 4. Administration Endpoints



\## Get Users



\### Endpoint



```http

GET /admin/users

```



\### Authentication



Required.



\### Role



```text

ADMIN

```



\### Description



Returns registered users.



\---



\## Update User Status



\### Endpoint



```http

PATCH /admin/users/:id/status

```



\### Authentication



Required.



\### Role



```text

ADMIN

```



\### Request Body



```json

{

&#x20; "isActive": false

}

```



\### Description



Allows an administrator to activate or deactivate a user account.



\---



\## Get Opportunities for Administration



\### Endpoint



```http

GET /admin/opportunities

```



\### Authentication



Required.



\### Role



```text

ADMIN

```



\### Description



Returns opportunities for administrative moderation.



\---



\## Update Opportunity Status



\### Endpoint



```http

PATCH /admin/opportunities/:id/status

```



\### Authentication



Required.



\### Role



```text

ADMIN

```



\### Request Body



```json

{

&#x20; "status": "OPEN"

}

```



\### Supported Statuses



```text

OPEN

CLOSED

PENDING

REJECTED

```



\---



\# 5. Role Permissions



| Endpoint Area | Student | Organization | Admin |

|---|---:|---:|---:|

| Register | Yes | Yes | Yes |

| Login | Yes | Yes | Yes |

| View own profile | Yes | Yes | Yes |

| Browse opportunities | Yes | Yes | Yes |

| Search opportunities | Yes | Yes | Yes |

| Create opportunity | No | Yes | No |

| Update own opportunity | No | Yes | No |

| Delete own opportunity | No | Yes | No |

| Apply for opportunity | Yes | No | No |

| View own applications | Yes | No | No |

| View applicants | No | Yes | No |

| Update application status | No | Yes | No |

| View users | No | No | Yes |

| Activate/deactivate users | No | No | Yes |

| Moderate opportunities | No | No | Yes |



\---



\# 6. Common HTTP Responses



\## 200 OK



Request completed successfully.



\## 201 Created



A new resource was successfully created.



\## 400 Bad Request



The request contains invalid data.



\## 401 Unauthorized



Authentication is missing or invalid.



\## 403 Forbidden



The authenticated user does not have permission to perform the requested action.



\## 404 Not Found



The requested resource does not exist.



\## 409 Conflict



The request conflicts with existing data.



Example:



```json

{

&#x20; "message": "You have already applied for this opportunity",

&#x20; "error": "Conflict",

&#x20; "statusCode": 409

}

```



\## 500 Internal Server Error



An unexpected server-side error occurred.



\---



\# 7. Testing Workflow



A basic end-to-end backend test can follow this sequence:



1\. Register a student.

2\. Register an organization.

3\. Log in as the organization.

4\. Create an opportunity.

5\. Browse the opportunity.

6\. Log in as the student.

7\. Apply for the opportunity.

8\. View the student's applications.

9\. Log in as the organization.

10\. View applicants.

11\. Update the application status.

12\. Log in as the student.

13\. Verify the updated application status.



\---



\# 8. API Documentation Tools



The backend can be tested and explored using:



\- Swagger UI

\- Postman



Swagger:



```text

http://localhost:3000/api

```



Local API:



```text

http://localhost:3000

```



\---



\# 9. Security Notes



The API uses:



\- JWT authentication

\- bcrypt password hashing

\- Role-based access control

\- DTO validation

\- Ownership checks

\- Database constraints

\- Environment variables for sensitive configuration



The `.env` file must never be committed to GitHub.



