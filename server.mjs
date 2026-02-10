import express from "express";
import db from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/test-db", async (_, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");
        res.json(rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json(err);
    }
});

app.get("/students", async (_, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");
        res.json(rows);
    } catch (err) {
        console.error("GET ERROR:", err);
        res.status(500).json(err);
    }
});

app.post("/students", async (req, res) => {
    const { firstName, lastName, email, enrollmed, tuition } = req.body;
    const tuitionAmount = Number(tuition);
    if (tuitionAmount < 50000 || tuitionAmount > 90000) {
        return res.status(400).json({
            error: "Tuition must be between 50,000 and 90,000"
        });
    }

    const enrollDate = new Date(enrollmed);
    const minDate = new Date("2010-01-01");
    const maxDate = new Date("2026-12-31");

    if (isNaN(enrollDate)) {
        return res.status(400).json({ error: "Invalid enrollment date" });
    }

    if (enrollDate < minDate || enrollDate > maxDate) {
        return res.status(400).json({
            error: "Enrollment date must be between 2010 and 2026"
        });
    }

    try {
        const sql = `
            INSERT INTO students
            (FirstName, LastName, Email, Enrollmed, tuition)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            firstName,
            lastName,
            email,
            enrollmed,
            tuition
        ]);

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("MYSQL INSERT ERROR:", err);
        res.status(500).json(err);
    }
});

app.delete("/students/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            "DELETE FROM students WHERE StudentID = ?",
            [id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json(err);
    }
});

app.get("/courses", async (_, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM courses");
        res.json(rows);
    } catch (err) {
        console.error("COURSES GET ERROR:", err);
        res.status(500).json(err);
    }
});

app.post("/courses", async (req, res) => {
    const { courseName, credits } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO courses (CourseName, Credits)
             VALUES (?, ?)`,
            [courseName, credits]
        );

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("COURSES POST ERROR:", err);
        res.status(500).json(err);
    }
});

app.post("/enrollments", async (req, res) => {
    const { studentId, courseId, enrollmentDate, grade } = req.body;
    const enrollDate = new Date(enrollmentDate);
    const maxEnroll = new Date("2026-12-31");

    if (enrollDate > maxEnroll) {
        return res.status(400).json({
            error: "Enrollment date cannot be after 2026"
        });
    }

    try {
        const [result] = await db.query(
            `
            INSERT INTO enrollments
            (StudentID, CourseID, EnrollmentDate, Grade)
            VALUES (?, ?, ?, ?)
            `,
            [studentId, courseId, enrollmentDate, grade]
        );

        console.log("RAW MYSQL RESULT:", result);

        res.json({
            success: true,
            enrollmentId: result.insertId
        });
    } catch (err) {
        console.error("❌ ENROLLMENT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
