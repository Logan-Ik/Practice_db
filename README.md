Practise_db

A practice database projectwith a frontend interface for managing students, courses, and enrollments. This project demonstrates CRUD operations, table relationships, and a simple academic system using Node.js, Express, and a SQL database.


Database Overview

Database name:`Practise_db`

The database consists of three tables:

1. Students

Stores student information.

| Column Name | Type     | Description               |
| ----------- | -------- | ------------------------- |
| StudentID   | INT (PK) | Unique student identifier |
| FirstName   | VARCHAR  | Student's first name      |
| LastName    | VARCHAR  | Student's last name       |
| Email       | VARCHAR  | Student email             |
| Enrollmed   | DATE     | Enrollment date           |
| Tuition     | DECIMAL  | Tuition fee               |

2. Courses

Stores course information.

| Column Name | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| CourseID    | INT (PK) | Unique course identifier     |
| CourseName  | VARCHAR  | Name of the course           |
| Credits     | INT      | Number of credits for course |

3. Enrollments

Tracks which students are enrolled in which courses.

| Column Name    | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| EnrollmentID   | INT (PK) | Unique enrollment identifier         |
| StudentID      | INT (FK) | References `Students.StudentID`      |
| CourseID       | INT (FK) | References `Courses.CourseID`        |
| EnrollmentDate | DATE     | Date of enrollment                   |
| Grade          | VARCHAR  | Grade assigned to student (optional) |

Relationships:

One student can have multiple enrollments.
One course can have multiple students enrolled.
  
Features

Add, read, and delete students
Add and list courses
Enroll students in courses with optional grades
Dynamic frontend table and dropdowns for easy interaction
Status messages for successful or failed operations

Setup Instructions

1. Install Node.js (v18+ recommended) and MySQl (or any SQL-compatible database).
2. Clone the repository** and install dependencies:

```bash
npm install
```

3. Create the database and tables:

```sql
CREATE DATABASE Practise_db;

USE Practise_db;

CREATE TABLE Students (
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Enrollmed DATE NOT NULL,
    Tuition DECIMAL(10,2)
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY AUTO_INCREMENT,
    CourseName VARCHAR(100) NOT NULL,
    Credits INT NOT NULL
);

CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    EnrollmentDate DATE NOT NULL,
    Grade VARCHAR(2),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```

4. Configure `db.js` with your database credentials. Example:

```js
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "Practise_db",
});

export default db;
```

5. Start the Express server:

```bash
node server.mjs
```

6. Open `index.html` in your browser. Use the forms to:

Add students
Add courses
Enroll students in courses
View tables dynamically updating

Project Files

| File                | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `db.js`             | Database connection configuration                    |
| `server.mjs`        | Node.js/Express server handling routes for CRUD      |
| `index.html`        | Frontend interface for interacting with the database |
| `package.json`      | Project dependencies                                 |
| `package-lock.json` | Exact dependency versions                            |
| `CRUD.session.sql`  | Sample SQL commands for practice                     |
| `.gitignore`        | Files to ignore in Git                               |

Usage Notes

The frontend uses fetch API to communicate with the server (`/students`, `/courses`, `/enrollments`)
Status messages indicate success or failure for each operation
Dropdowns in the enrollment form are dynamically populated from the database
Deleting a student updates the table immediately
