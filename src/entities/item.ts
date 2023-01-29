import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Order } from "./order";

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    productId: number;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column({type: 'float'})
    price: number;

    @Column({type: 'float'})
    discount: number;

    @Column()
    quantity: number;
    
    @ManyToOne(() => Order, (order) => order.items)
    order: Order;
}