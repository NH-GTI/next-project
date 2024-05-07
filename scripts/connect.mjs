import pool from './postgres.mjs';

const fetchDataFromDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to database !');

    const result = await client.query('SELECT * FROM public.user');
    const data = result.rows;
    console.log('Fetched data:', data);

    client.release();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

fetchDataFromDB()
  .then((data) => {
    console.log('Received data:', data);
  })
  .catch((err) => {
    console.error('Error fetching data:', error);
  });
