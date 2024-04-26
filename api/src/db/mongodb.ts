import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI!, {
    connectTimeoutMS: 3000,
}).then(() => {
    console.log('Connected to MongoDB');
}
).catch((error) => {
    console.error(error);
}
);
