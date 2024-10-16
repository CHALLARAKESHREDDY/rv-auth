// src/Utils/ErrorHandler.js
export const handleErrors = (error, res) => {
    console.error("Error you ae looking for :",error);
    if (error.code && error.sqlMessage) {
        res.status(500).json({ error: "Database error. Please try again" });
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        res.status(408).json({ error: "Request timeout or connection reset" });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        res.status(502).json({ error: "Server or network unavailable" });
    } else {
        res.status(500).json({ error: "Internal server error" });
    }
};