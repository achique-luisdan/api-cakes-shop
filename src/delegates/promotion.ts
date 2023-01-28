import { getRepository } from "typeorm";
import { Product } from "../entities/product";
import { Promotion } from "../entities/promotion";

export class PromotionDelegate {

    constructor() {}

    async createPromotion(promotion: Promotion): Promise<Promotion> {
        const promotionRepository= getRepository(Promotion)
        return await promotionRepository.save(promotion);
    }

    async readPromotion(promotionName: string): Promise<Promotion> {
        const promotionRepository = getRepository(Promotion)
        return await promotionRepository.findOne({
            where: {
                name: promotionName
            }
        }) as Promotion;
    }

    async readPromotionById(id: number): Promise<Promotion> {
        const promotionRepository = getRepository(Promotion)
        return await promotionRepository.findOne({
            where: {
                id: id
            }
        }) as Promotion;
    }

    async addProducts(promotion: Promotion, products: Product[]): Promise<Promotion> {
        promotion.products = products;
        const productRepository = getRepository(Product)
        products.forEach (async product => {
            product.promotions = [];
            product.promotions.push(promotion);
            await productRepository.save(product);
        })
        return promotion;
    }
}