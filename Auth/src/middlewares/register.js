import '../../config.js'; // Ensure this import is at the top to load env variables before using them
import jwt from 'jsonwebtoken'
import { handleErrors } from '../error_handling.js';


const secretKey = process.env.SECRET_KEY;

export const RegisterMiddleware = async (req, res, rvdb) => {
    const { name, email, phoneNumber, category } = req.body;

    const sqlQueryInsertFarmerWithEmail = `
        INSERT INTO farmers (name, phone_number, email, category)
        VALUES (?, ?, ?, ?)
    `;
    const sqlQueryInsertFarmerWithoutEmail = `
        INSERT INTO farmers (name, phone_number, category)
        VALUES (?, ?, ?)
    `;
    const sqlQueryInsertNotification = `
        INSERT INTO notifications (farmer_id, title, message)
        VALUES (?, ?, ?)
    `;

    try {
        await rvdb.query('BEGIN');
        let sqlQuery, parameters;
        if (email) {
            sqlQuery = sqlQueryInsertFarmerWithEmail;
            parameters = [name, phoneNumber, email, category];
        } else {
            sqlQuery = sqlQueryInsertFarmerWithoutEmail;
            parameters = [name, phoneNumber, category];
        }
        const [response] = await rvdb.query(sqlQuery, parameters);
        const farmerId = response.insertId;

        const notificationTitle = 'Registration Successful';
        const notificationMessage = `Hello ${name}, thank you for choosing us! Your registration was successful.`;

        await rvdb.query(sqlQueryInsertNotification, [farmerId, notificationTitle, notificationMessage]);

        jwt.sign({ farmerId, phoneNumber }, secretKey, async (err, token) => {
            if (err) {
                await rvdb.query('ROLLBACK');
                return res.status(500).json({ error: "JWT generation failed" });
            } else {
                await rvdb.query('COMMIT');
                return res.status(200).json({ message: "Registered successfully", token, farmerId });
            }
        });
    } catch (error) {
        await rvdb.query('ROLLBACK');
        handleErrors(error)
    }
}

