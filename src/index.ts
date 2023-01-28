import app from "./app";
import { createConnection } from 'typeorm';

const port = 3000;
createConnection();

app.listen(port, () => {
    console.log(`API REST Cakes Shop se escucha en http://localhost:${port}`);
});
  
