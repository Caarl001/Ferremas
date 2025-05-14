const express = require('express');
const db = require('./database'); // Importar la conexión a MySQL

const app = express();

app.get('/api/productos', (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener productos" });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});