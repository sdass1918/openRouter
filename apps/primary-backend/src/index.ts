import express from 'express'
import { authRoutes } from './routes/auth-routes.js'
import { apiKeyRoutes } from './routes/apiKey-routes.js';
import { authMiddleware } from './middleware/auth-middleware.js';
import { modelsRouter } from './routes/models-routes.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/api-key', authMiddleware, apiKeyRoutes);
app.use('/models', modelsRouter);

app.get('/', (req, res) => {
    res.send({
        message: "Hello World!"
    })
})

app.listen(3000, () => {
    console.log('The app is listening on port 3000');
});
