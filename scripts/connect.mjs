import pool from './postgres.mjs';

export async function fetchDataFromDB() {
  try {
    const client = await pool.connect();
    console.log('Connected to database !');

    return client;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

fetchDataFromDB()
  .then((data) => {
    // console.log('Received data:', data);
  })
  .catch((err) => {
    console.error('Error fetching data:', err);
  });
