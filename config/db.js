const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root', // Usuario por defecto en MySQL
  password: '', // No tiene contraseña
  database: 'ferreterriadb'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = db;