import { Product } from "../entities/product";
import { ProductDelegate } from "../delegates/product";
import { TestHelper } from "../helpers/testhelper";
import { Promotion } from "../entities/promotion";
import { PromotionDelegate } from "../delegates/promotion";
import request from 'supertest'
import app from '../app'

import PRODUCTS from '../helpers/datasets/products.json';
import PROMOTIONS from '../helpers/datasets/promotions.json';

beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

afterAll(() => {
    TestHelper.instance.teardownTestDB();
});


describe('PROMOCIONES', () => {

    test('Crea nuevos productos', async () => {
        PRODUCTS.forEach (async PRODUCT => {
            const product: Product = new Product();
            product.name = PRODUCT.name;
            product.price = PRODUCT.price
            const delegate: ProductDelegate = new ProductDelegate();
            const saved: Product = await delegate.saveProduct (product);
            const created: Product = await delegate.readProduct (saved.name);
            expect(created.name).toBe(PRODUCT.name);
            expect(created.price).toBe(PRODUCT.price);
            expect(created.id).toBeGreaterThan(0);
        });
    });

    test('Crear nuevas promociones', async () => {
      PROMOTIONS.forEach ( async PROMO => {
        const promotion: Promotion = PROMO as Promotion;
        const delegate: PromotionDelegate = new PromotionDelegate();
        const saved = await delegate.createPromotion(promotion);
        const created = await delegate.readPromotion(saved.name);
        expect(created.name).toBe(PROMO.name);
        expect(created.discount).toBe(PROMO.discount);
        expect(created.id).toBeGreaterThan(0);
        expect(created.id).toBe(PROMO.id);
      });
    });

    test('Asociar promociones a productos', async () => {
      PRODUCTS.forEach (async PRODUCT => {
        const productDelegate: ProductDelegate = new ProductDelegate();
        let product: Product = new Product ();
        product.id = PRODUCT.id;
        product.name= PRODUCT.name;
        product.price = PRODUCT.price;
        const promotionDelegate: PromotionDelegate = new PromotionDelegate();
        let promotions: Promotion [] = [];
        PRODUCT.promotionsId.forEach(async (promotionId, index) => {
          const promotion = await promotionDelegate.readPromotionById(promotionId);
          expect(promotion.id).toBe(promotionId);
          promotions.push (promotion);
          if (index +1 ===PRODUCT.promotionsId.length){
            product.promotions = promotions;
            const updated: Product = await productDelegate.saveProduct (product);
            expect(updated.id).toBe(product.id);
            expect(updated.promotions).toStrictEqual(promotions);            
          }
        });
      });
    });

    test('Si un producto tiene varias promociones, indicar la promoción con mayor descuento', async () => {
      const PRODUCT_WITH_PROMOTIONS = PRODUCTS.filter (PRODUCT => { return PRODUCT.promotionsId.length > 0});
      const response = await request(app).get ('/api/promotions').send();
      expect (response.statusCode).toBe(200)
      PRODUCT_WITH_PROMOTIONS.forEach ((PRODUCT, index) => {
        expect(response.body[index].bestPromotion.id).toBe(PRODUCT.bestPromotionId)
       })
    });

});