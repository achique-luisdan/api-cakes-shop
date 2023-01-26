import express from 'express';
import cors from 'cors';
import routers from './core/api';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

const app = express();
const port = 3000;

createConnection();

app.use(cors());
app.use (express.json());
app.use('/api', routers)

app.get('/', (req, res) => {
  res.send('Bienvenido')
});

app.listen(port, () => {
  console.log(`API REST se escucha en http://localhost:${port}`)
});