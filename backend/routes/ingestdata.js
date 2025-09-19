const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dataset');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', async (req, res) => {
  const { datasetID, format, name } = req.body;
  try {
    await pool.query(
      'INSERT INTO dataset (datasetID, format, name) VALUES ($1, $2, $3)',
      [datasetID, format, name]
    );
    res.status(201).json({ message: 'Dataset added!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

module.exports = router;
