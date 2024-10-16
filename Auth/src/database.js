/* import  '../config.js'; // Ensure this import is at the top to load env variables before using them
import mysql from 'mysql' // Correct the typo here

 export async function initializeDatabase() {
    let rvdb; // Declare pool variable

    try {
        // Create MySQL pool
        rvdb = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionLimit: 10, // Adjust as per your application's needs
            queueLimit: 0
        });
        console.log('Connected to the database');
        return rvdb; // Return the pool object
    } catch (err) {
        console.error(`Error connecting to the database: ${err.message}`);
    }
}*/

import  '../config.js';
import mysql from 'mysql2/promise';


export const createDbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,    // IP of the VM where MariaDB is running
      user: process.env.DB_USER,    // Database user
      password: process.env.DB_PASS, // Database password
      database: process.env.DB_NAME, // Database name
      port: process.env.DB_PORT || 3306 // Database port (default to 3306 if not set)
    });
    console.log("Connected to the database.");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};



