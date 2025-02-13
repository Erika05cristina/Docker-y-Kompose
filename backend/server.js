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
    host: "db",  // Nombre del servicio del DB en Kubernetes
    database: "books",
    password: "password",
    port: 5432,
});

// Función para crear la tabla 'books' si no existe
const createTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log("Tabla 'books' asegurada.");
    } catch (err) {
        console.error("Error al crear la tabla:", err);
    }
};

// Llamar a la función para crear la tabla al iniciar el backend
createTable();

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
