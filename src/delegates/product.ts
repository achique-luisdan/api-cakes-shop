import { getRepository } from "typeorm";
import { Product } from "../entities/product";

export class ProductDelegate {

    constructor() {}

    async createNewProduct(product: Product): Promise<Product> {
        const productRepository= getRepository(Product)
        return await productRepository.save(product);
    }

    async readProduct(productName: string): Promise<Product | null> {
        const productRepository = getRepository(Product)
        return await productRepository.findOne({
            where: {
                name: productName
            }
        });
    }
}