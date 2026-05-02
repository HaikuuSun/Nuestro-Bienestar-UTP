const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia esto por tu contraseña de MySQL
  database: 'test' // Cambia por tu base de datos
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => { // Ejemplo de tabla
    if (err) throw err;
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});