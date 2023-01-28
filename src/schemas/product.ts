import { Product } from "../entities/product";
import { Promotion } from "../entities/promotion";

export class ProductSchema extends Product {
    bestPromotion?: Promotion;
}