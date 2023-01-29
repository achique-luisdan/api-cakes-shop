import { Router, Request, Response } from "express";
import { OrderDelegate } from "../delegates/order";
import { ProductDelegate } from "../delegates/product";
import { PromotionDelegate } from "../delegates/promotion";
import { Order } from "../entities/order";
import { Product } from "../entities/product";
import { Promotion } from "../entities/promotion";

const router = Router();

router.get('/promotions', async (req: Request, res: Response) => {
  const delegate: ProductDelegate = new ProductDelegate;
  res.json (await delegate.productsWithPromotions()); 
});

router.post('/promotions', async (req: Request, res: Response) => {
  const delegate: PromotionDelegate = new PromotionDelegate;
  const promotionsSaved: Promotion[] = await delegate.savePromotions( req.body as Promotion[]); 
  const status: number = promotionsSaved.length === req.body.length ? 201 : 400;
  res.status(status).json (promotionsSaved); 
});

router.post('/orders', async (req: Request, res: Response) => {
  const delegate: OrderDelegate = new OrderDelegate();
  res.status(201).json (await delegate.saveOrder (req.body as Order));
});

router.post('/products', async (req: Request, res: Response) => {
  const delegate: ProductDelegate = new ProductDelegate;
  const productsSaved: Product[] = await delegate.saveProducts( req.body as Product[]); 
  const status: number = productsSaved.length === req.body.length ? 201 : 400;
  res.status(status).json (productsSaved); 
});

router.get('/products', async (req: Request, res: Response) => {
  const delegate: ProductDelegate = new ProductDelegate;
  res.json (await delegate.readProducts()); 
});

export default router;