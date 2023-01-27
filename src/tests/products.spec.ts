import { Product } from "../entities/product";
import { ProductDelegate } from "../delegates/product";
import { TestHelper } from "../helpers/testhelper";
import DATASETS from '../helpers/datasets.json';
import { Promotion } from "../entities/promotion";
import { PromotionDelegate } from "../delegates/promotion";


beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

afterAll(() => {
    TestHelper.instance.teardownTestDB();
});


describe('PRODUCTOS', () => {

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
        })
    });

    test('Consultar productos creados', async () => {
        DATASETS.forEach (async PRODUCT => {
            const productDelegate: ProductDelegate = new ProductDelegate();
            const productCreated: Product | null = await productDelegate.readProduct (PRODUCT.name);
            expect(productCreated?.name).toBe(PRODUCT.name);
            expect(productCreated?.price).toBe(PRODUCT.price);
            expect(productCreated?.id).toBeGreaterThan(0);
        })
    });

    test('Crear nueva promoción', async () => {
       let promotion: Promotion = new Promotion();
       promotion.name = 'Jueves de Feria';
       promotion.discount = 23.0;
       let promotionDelegate: PromotionDelegate = new PromotionDelegate();
       const promotionCreated: Promotion = await promotionDelegate.createNewPromotion (promotion);
       expect(promotionCreated?.name).toBe(promotion.name);
       expect(promotionCreated?.discount).toBe(promotion.discount);
       expect(promotionCreated?.id).toBeGreaterThan(0);
    });

    test('Asociar productos a promoción', async () => {
        const name = 'Jueves de Feria';
        const discount = 23.0;
        let products: Product [] =[];
        let promotionDelegate: PromotionDelegate = new PromotionDelegate();
        const promotionCreated: Promotion | null = await promotionDelegate.readPromotion (name);
        expect(promotionCreated?.name).toBe(name);
        expect(promotionCreated?.discount).toBe(discount);
        DATASETS.forEach (async PRODUCT => {
            const productDelegate: ProductDelegate = new ProductDelegate();
            const productCreated: Product | null = await productDelegate.readProduct (PRODUCT.name);
            if (productCreated !== null){
                products.push (productCreated);
            }
        })
        let promotionUpdated: Promotion | null = null;
        if (promotionCreated !== null){
            promotionUpdated =  await promotionDelegate.addProducts (promotionCreated, products);
        } 
        expect(promotionUpdated?.name).toBe(name);
        expect(promotionUpdated?.discount).toBe(discount);
        products.forEach (product => {
            const index: number | undefined = promotionUpdated?.products.findIndex (productAdded => {
                return productAdded.name === product.name
            })
            expect(index).toBeGreaterThan(-1);
            if (index != undefined){
                expect( promotionUpdated?.products[index].name).toBe(product.name);
            }
        });     
    });

});