import { getRepository } from "typeorm";
import { Product } from "../entities/product";
import { ProductSchema } from "../schemas/product";

export class ProductDelegate {

    constructor() {}

    async saveProduct(product: Product): Promise<Product> {
        const productRepository= getRepository(Product)
        return await productRepository.save(product);
    }

    async readProduct(name: string): Promise<Product> {
        const productRepository = getRepository(Product)
        return await productRepository.findOne({
            where: {
                name: name
            }
        }) as Product;
    }

    async productsWithPromotions(): Promise<ProductSchema[]> {
         let products = await getRepository (Product).find({  
            relations: {
               promotions: true,
           },
        }) as ProductSchema[]
        const withPromotions: ProductSchema [] = products.filter (product => {
            return product.promotions.length > 0;
        })
        withPromotions.map (product => {
            const promotionsDiscount: number [] =[];
            product.promotions.forEach (promotion => {
                promotionsDiscount.push (promotion.discount)
            })
            const discountMax: number = Math.max(...promotionsDiscount);
            const promotionIndex: number = promotionsDiscount.findIndex( discount => { return discount === discountMax})
            product.bestPromotion = product.promotions[promotionIndex]
            return product;
        })
        return withPromotions;
    }
    
 
}