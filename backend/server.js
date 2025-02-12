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

// Leer todos los usuarios
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los usuarios");
    }
});

// Crear un usuario
app.post("/users", async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query("INSERT INTO users (name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al crear el usuario");
    }
});

// Actualizar un usuario
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query("UPDATE users SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el usuario");
    }
});

// Eliminar un usuario
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar el usuario");
    }
});

// Iniciar el servidor
app.listen(3000, () => console.log("Backend corriendo en el puerto 3000"));
