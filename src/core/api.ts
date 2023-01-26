import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Promotion } from "../entities/promotion";

const router = Router();

router.get('/promotions', async (request: Request, response: Response) => {
   const promotions = await getRepository (Promotion).find();
   response.json (promotions); 
});

export default router;