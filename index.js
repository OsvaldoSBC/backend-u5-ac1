const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database('database.db');

app.post('/agrega_todo', (req, res) => {
    const tarea = req.body.todo;
    const fecha = new Date().toISOString();


    const query = `INSERT INTO todos (todo, created_at) VALUES (?, ?)`;
    
    db.run(query, [tarea, fecha], function(err) {
        if (err) {
            console.error("Error al guardar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        console.log(`-> [SERVIDOR]: Tarea guardada con ID: ${this.lastID}`);
        

        res.status(201).json({ 
            mensaje: "Dato guardado con éxito", 
            id: this.lastID 
        });
    });
});

app.get('/lista_todos', (req, res) => {

    const query = `SELECT id, todo FROM todos`;
    
    db.all(query, [], (err, filas) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        res.status(200).json(filas);
    });
});



app.listen(3000, () => {
    console.log("Servidor Node.js con SQLite corriendo en el puerto 3000");
});
