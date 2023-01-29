import { getRepository } from "typeorm";
import { Order } from "../entities/order";

export class OrderDelegate {
    
    constructor() {}

    async saveOrder(order: Order): Promise<Order> {
        const orderRepository = getRepository(Order)
        return await orderRepository.save(order);
    }
}