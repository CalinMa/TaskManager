import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export function initDatabase() {
   const DATABASE_URL = process.env.DATABASE_URL;

   console.log('Connecting to MongoDB at:', DATABASE_URL); // Log the URL to verify

   mongoose.connection.on('open', () => {
     console.info('Successfully connected to db: ', DATABASE_URL);
   });

   const connection = mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
   return connection;
}
