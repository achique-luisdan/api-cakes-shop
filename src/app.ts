import express from 'express';
import cors from 'cors';
import routers from './apis/api';
import 'reflect-metadata';

const app = express();

app.use(cors());
app.use (express.json());
app.use('/api', routers)

app.get('/', (req, res) => {
  res.send('Bienvenido')
});

export default app;
