import { Product } from "../entities/product";
import { ProductDelegate } from "../delegates/product";
import { TestHelper } from "../helpers/testhelper";
import DATASETS from '../helpers/datasets.json';
import { Promotion } from "../entities/promotion";
import { PromotionDelegate } from "../delegates/promotion";
import request from 'supertest'
import app from '../index'
beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

afterAll(() => {
    TestHelper.instance.teardownTestDB();
});


describe('PROMOCIONES', () => {

    test('Crea nuevos productos', async () => {
        DATASETS.forEach (async PRODUCT => {
            let product: Product = new Product();
            product.name = PRODUCT.name;
            product.price = PRODUCT.price
            const productDelegate: ProductDelegate = new ProductDelegate();
            const productCreated: Product = await productDelegate.createNewProduct (product);
            expect(productCreated.name).toBe(product.name);
            expect(productCreated.price).toBe(product.price);
            expect(productCreated.id).toBeGreaterThan(0);
        });
        const response = await request(app).get ('/api/promotions').send();
        expect (response.statusCode).toBe(200)
        DATASETS.forEach (async PRODUCT => {
            const index: number | undefined = response.body.findIndex ( (product: { name: string; }) => {return product.name === PRODUCT.name })
            expect(index).toBeGreaterThan(-1);
            if (index != undefined){
                expect (response.body[index].name).toBe(PRODUCT.name)
            }  
        })
    });

    test('Crear nuevas promociones', async () => {
       let promotion: Promotion = new Promotion();
       promotion.name = 'Jueves de Feria';
       promotion.discount = 23.0;
       let promotionDelegate: PromotionDelegate = new PromotionDelegate();
       const promotionCreated: Promotion = await promotionDelegate.createNewPromotion (promotion);
       expect(promotionCreated?.name).toBe(promotion.name);
       expect(promotionCreated?.discount).toBe(promotion.discount);
       expect(promotionCreated?.id).toBeGreaterThan(0);
    });

    test('Asociar promociones a productos', async () => {
        const name = 'Jueves de Feria';
        const discount = 23.0;
        let products: Product  [] =[];
        let promotionDelegate: PromotionDelegate = new PromotionDelegate();
        const promotionCreated: Promotion | null = await promotionDelegate.readPromotion (name);
        expect(promotionCreated?.name).toBe(name);
        expect(promotionCreated?.discount).toBe(discount);
        DATASETS.forEach (async (PRODUCT, index) => {
            const productDelegate: ProductDelegate = new ProductDelegate();
            const productCreated: Product | null = await productDelegate.readProduct (PRODUCT.name);
            products.push (productCreated as Product);
            let promotionUpdated: Promotion | null = null;
            if (index +1 === DATASETS.length){
                promotionUpdated =  await promotionDelegate.addProducts (promotionCreated as Promotion, products);
            }
         })
        const response = await request(app).get ('/api/promotions').send();
        expect (response.statusCode).toBe(200)
    });

});