require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "db",
    database: "mydb",
    password: "password",
    port: 5432,
});

// Ruta de inicio
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// Leer todos los libros
app.get("/books", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los libros");
    }
});

// Crear un libro
app.post("/books", async (req, res) => {
    const { title, author } = req.body;
    try {
        const result = await pool.query("INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *", [title, author]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al crear el libro");
    }
});

// Actualizar un libro
app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    try {
        const result = await pool.query("UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *", [title, author, id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Libro no encontrado");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el libro");
    }
});

// Eliminar un libro
app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Libro no encontrado");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar el libro");
    }
});

// Iniciar el servidor
app.listen(3000, () => console.log("Backend corriendo en el puerto 3000"));

// Para ejecutar este servidor, necesitas tener una base de datos PostgreSQL corriendo en el puerto 5432. Puedes usar Docker para levantar una base de datos PostgreSQL con el siguiente comando: