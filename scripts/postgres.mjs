import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'postgres',
  password: 'Tab70959!',
  database: 'next',
});

export default pool;
