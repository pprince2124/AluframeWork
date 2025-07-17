import mongoose from 'mongoose';
// src/db/db.js
import { DB_NAME } from '../constants.js';



const connectToDatabase = async () => {
try {
   const connectDB =  await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
   console.log(`Connected to the database: ${connectDB.connection.host}`);
} catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
    process.exit(1);
    
}

}

export default connectToDatabase;