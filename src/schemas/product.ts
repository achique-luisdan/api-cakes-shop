import { Product } from "../entities/product";
import { Promotion } from "../entities/promotion";
import { PromotionSchema } from "./promotion";

export class ProductSchema extends Product {
    bestPromotion?: Promotion;
    promotions: PromotionSchema[];
}