import express from 'express';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import { handleErrors } from './error_handling.js';
import { LoginMiddleware } from './middlewares/login.js';
import { RegisterMiddleware } from './middlewares/register.js';
import { createDbConnection } from './database.js';

const router = express.Router();



router.post('/users', (req, res) => {
    res.send('Create a user');
});

router.get('/', async(req, res)=>{
    try{
        const rvdb = await createDbConnection();
        const checkFarmerQuery = 'SELECT * FROM farmers WHERE phone_number = ?';
            [user] = await rvdb.query(checkFarmerQuery, [phoneNumber]);
            console.log(user)
    }catch(error) {
        console.log(error)
    }
    

})


router.post('/send-otp', async (req, res) => {
    const { phoneNumber, action, email} = req.body;

    const rvdb = await createDbConnection();
 
    try {
        let user;
        if (action === 'Login') {
            const checkFarmerQuery = 'SELECT * FROM farmers WHERE phone_number = ?';
            [user] = await rvdb.query(checkFarmerQuery, [phoneNumber]);
            if (user.length === 0) {
                return res.status(400).json({ error: 'User with this phone number does not exist. Please signup' });
            }
        } else if (action === 'Register') {
            const checkFarmerQuery = 'SELECT * FROM farmers WHERE phone_number = ?';
            [user] = await rvdb.query(checkFarmerQuery, [phoneNumber]);
            if (user.length > 0) {
                return res.status(400).json({ error: 'User with this phone number already exists. Please login.' });
            }
            if (email) {
                const checkFarmerQueryEmail = 'SELECT * FROM farmers WHERE email = ?';
                [user] = await rvdb.query(checkFarmerQueryEmail, [email]);
                if (user.length > 0) {
                    return res.status(400).json({ error: "Email already exists" });
                }
            }
        }
        const deleteExistingOtpQuery = 'DELETE FROM otps WHERE phone_number = ?';
        await rvdb.query(deleteExistingOtpQuery, [phoneNumber]);

        const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets:false, alphabets: false,});
        const hashedOtp = await bcrypt.hash(otp, 10);
        console.log(otp);

        const insertOtpQuery = 'INSERT INTO otps (phone_number, otp, created_at) VALUES (?, ?, ?)';
        await rvdb.query(insertOtpQuery, [phoneNumber, hashedOtp, new Date()]);

        const responseMessage = { message: 'OTP sent successfully', phone: phoneNumber };
        if (action === 'Login') {
            responseMessage.farmerId = user[0].farmer_id;
        }
        return res.status(200).json(responseMessage);
    } catch (error) {
        handleErrors(error, res)
    }
});



//************************* Verify OTP **********************/

router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, OTP, action } = req.body;
    try {
        const getOtpQuery = 'SELECT otp, created_at FROM otps WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1';
        const [[storedOtpRecord]] = await rvdb.query(getOtpQuery, [phoneNumber]);
        console.log(storedOtpRecord)

        if (!storedOtpRecord) {
            return res.status(400).json({ error: 'OTP expired or not found' });
        }

        const currentTime = new Date();
        const otpTime = new Date(storedOtpRecord.created_at);
        const otpAgeMinutes = (currentTime - otpTime) / (1000 * 60);
        console.log(otpAgeMinutes)

        if (otpAgeMinutes > 3) {
            await rvdb.query('DELETE FROM otps WHERE phone_number = ?', [phoneNumber]);
            return res.status(400).json({ error: 'OTP expired or not found' });
        }

        const isMatch = await bcrypt.compare(String(OTP), storedOtpRecord.otp);

        if (isMatch) {
            await rvdb.query('DELETE FROM otps WHERE phone_number = ?', [phoneNumber]);
            if (action === 'Register') {
                RegisterMiddleware(req, res, rvdb);
            } else if (action === 'Login') {
                LoginMiddleware(req, res, rvdb);
            }
        } else {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
         handleErrors(error, res)
    }
});


export default router;