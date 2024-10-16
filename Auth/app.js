

// server.js
import express from 'express';

import userRoutes from './src/sample.js'; // Your route file
//import { initializeDatabase } from './src/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Global variable for MySQL connection pool
let rvdb;

async function startServer() {
    try {
        //rvdb = await initializeDatabase(); // Initialize database
        console.log('Database connected successfully');

        /* Pass rvdb to routes
        app.use((req, res, next) => {
            req.db = rvdb; // Attach the db connection pool to the request object
            next();
        });*/

        app.use('/', userRoutes); // Now userRoutes has access to req.db

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Exit process in case of an error
    }
}

startServer();



