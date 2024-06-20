import * as dotenv from 'dotenv';

dotenv.config();
import app from './index';
import mongoose from 'mongoose';

console.log(process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('database connected')
})

mongoose.connection.on('disconnected', () => {
    console.log('database disconnected');
})

app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})