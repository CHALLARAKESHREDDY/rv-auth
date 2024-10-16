import '../../config.js'; // Ensure this import is at the top to load env variables before using them
import jwt from 'jsonwebtoken'
import { handleErrors } from '../error_handling.js';



export const LoginMiddleware = async(req, res, rvdb) => {
    const { phoneNumber, farmerId } = req.body;
    const sqlQueryInsertNotification = `
        INSERT INTO notifications (farmer_id, title, message)
        VALUES (?, ?, ?)
    `;
    try {
        const notificationTitle = 'Login Successful';
        const notificationMessage = 'Welcome back! Happy to see you again.';

        await rvdb.query('BEGIN');

        await rvdb.query(sqlQueryInsertNotification, [farmerId, notificationTitle, notificationMessage]);

        jwt.sign({ farmerId, phoneNumber }, secretKey, (err, token) => {
            if (err) {
                rvdb.query('ROLLBACK');
                return res.status(500).json({ error: "Failed to generate JWT token" });
            }

            rvdb.query('COMMIT');
            return res.status(200).json({ message: "Login successful", token, farmerId });
        });
    } catch (error) {
        await rvdb.query('ROLLBACK');
        handleErrors(error)
    }
}