import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { OrderDelegate } from "../delegates/order";
import { ProductDelegate } from "../delegates/product";
import { Order } from "../entities/order";

const router = Router();

router.get('/promotions', async (request: Request, response: Response) => {
   const delegate: ProductDelegate = new ProductDelegate;
   response.json (await delegate.productsWithPromotions()); 
});

router.post('/orders', async (request: Request, response: Response) => {
      const delegate: OrderDelegate = new OrderDelegate();
      response.json (await delegate.saveOrder (request.body as Order));
});
export default router;