import { getRepository } from "typeorm";
import { Order } from "../entities/order";
import { ProductSchema } from "../schemas/product";
import { ProductDelegate } from "./product";

export class OrderDelegate {
    
    constructor() {}

    async saveOrder(order: Order): Promise<Order> {
        const orderRepository = getRepository(Order)
        const productsId: number [] = [];
        order.items.forEach (item => {
            productsId.push (item.productId);
        })
        const productDelegate: ProductDelegate = new ProductDelegate();
        const products: ProductSchema [] = await productDelegate.readProductsById (productsId);
        order.items.map (item => {
            const productFound: ProductSchema = products.find (product => {
                return product.id === item.productId
            }) as ProductSchema;
            item.name = productFound.name;
            if (productFound.bestPromotion?.price != undefined && productFound.bestPromotion?.price != null){
                item.price = productFound.bestPromotion?.price as number;
                item.discount = productFound.bestPromotion?.discount as number; 
            }
            else {
                item.price = productFound.price;
                item.discount = 0;
            }
            return item;
        })
        return await orderRepository.save(order);
    }
}