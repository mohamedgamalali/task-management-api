import mongoose from 'mongoose';
import app from './app';

const port = process.env.PORT ?? 3000;

mongoose.connect(process.env.MONGO_URL as string).then(m => {
    console.log('connected to mongo DB');
    app.listen(port, () => {
        console.log('Server listen to port: ', port);
    })
})