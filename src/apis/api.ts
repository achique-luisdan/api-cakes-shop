import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { ProductDelegate } from "../delegates/product";

const router = Router();

router.get('/promotions', async (request: Request, response: Response) => {
   const delegate: ProductDelegate = new ProductDelegate;
   response.json (await delegate.productsWithPromotions()); 
});

export default router;