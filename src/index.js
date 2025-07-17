import dotenv from 'dotenv';
import app from './app.js';
import connectToDatabase from './db/db.js';
import { DB_NAME } from './constants.js';

dotenv.config({
    path: './.env'
});
const PORT = process.env.PORT || 8000;
connectToDatabase()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error); })