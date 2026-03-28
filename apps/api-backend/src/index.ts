import express from 'express';
import cors from 'cors';
import { authMiddleware } from 'primary-backend';
import { chatRoutes } from './routes/Chat-routes.js';
const app = express();

app.use(express.json());
app.use(cors({ 
    origin: '*'
}))

app.get('/', (req, res) => {
    res.send('Hii from api-backend!')
})

app.use('/api/v1/chat/completions', chatRoutes);

app.listen(4000, () => {
    console.log('The app is running on port 4000')
})