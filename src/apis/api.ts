import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entities/product";

const router = Router();

router.get('/promotions', async (request: Request, response: Response) => {
   const products = await getRepository (Product).find({  
      relations: {
         promotions: true,
     },
    });
   response.json (products); 
});

export default router;