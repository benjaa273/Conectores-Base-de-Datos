const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conectar a la base de datos
const db = new sqlite3.Database('./base_datos.db', (err) => {
    if (err) console.error("Error al conectar con la BD:", err.message);
    else console.log("Conectado con éxito a la base de datos SQLite.");
});

// Crear tabla adaptada al nuevo formulario
db.run(`
    CREATE TABLE IF NOT EXISTS alumnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        dni TEXT NOT NULL,
        curso TEXT NOT NULL,
        especialidad TEXT NOT NULL,
        turno TEXT NOT NULL
    )
`);

// Ruta POST: Guardar alumno
app.post('/api/agregar', (req, res) => {
    const { nombre, dni, curso, especialidad, turno } = req.body;
    const sql = `INSERT INTO alumnos (nombre, dni, curso, especialidad, turno) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [nombre, dni, curso, especialidad, turno], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Registro guardado con éxito", id: this.lastID });
    });
});

// Ruta GET: Extraer registros
app.get('/api/usuarios', (req, res) => {
    const sql = `SELECT * FROM alumnos`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});