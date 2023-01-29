import request from 'supertest'

import { TestHelper } from "../helpers/testhelper";

import { PromotionDelegate } from "../delegates/promotion";
import { ProductDelegate } from "../delegates/product";
import { Promotion } from "../entities/promotion";
import { Product } from "../entities/product";
import { Order } from "../entities/order";
import { Item } from "../entities/item";

import PRODUCTS from '../helpers/datasets/products.json';
import PROMOTIONS from '../helpers/datasets/promotions.json';
import ORDERS from '../helpers/datasets/orders.json';

import app from '../app'


beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

afterAll(() => {
    TestHelper.instance.teardownTestDB();
});


describe('PROMOCIONES', () => {

    test('Crea nuevos productos', async () => {
      let products: Product [] = [];
        PRODUCTS.forEach (async PRODUCT => {
            const product: Product = new Product();
            product.name = PRODUCT.name;
            product.price = PRODUCT.price
            products.push (product);
        });
        const response = await request(app).post ('/api/products').send(products);
        expect (response.statusCode).toBe(201);
        products.forEach (product => {
          const index: number = response.body.findIndex ((productElement: { name: string; price: number}) => {
            return productElement.name === product.name && productElement.price === product.price;
          })
          expect (index).toBeGreaterThan(-1);  
        })
    });

    test('Crea nuevas promociones', async () => {
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

    test('Asocia promociones a productos', async () => {
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

    test('Si producto tiene varias promociones, indica la promoción con mayor descuento', async () => {
      const PRODUCT_WITH_PROMOTIONS = PRODUCTS.filter (PRODUCT => { return PRODUCT.promotionsId.length > 0 && PRODUCT});
      const response = await request(app).get ('/api/promotions').send();
      expect (response.statusCode).toBe(200);
      PRODUCT_WITH_PROMOTIONS.forEach (PRODUCT => {
        const index: number = response.body.findIndex ((product: { id: number; }) => { return product.id === PRODUCT.id})
        if (index > -1){
          if (response.body[index].promotions.length > 0){
            expect(response.body[index].bestPromotion.id).toBe(PRODUCT.bestPromotionId);
         }
        }
       })
    });

    test('Si promociones asociadas a un producto tienen mismo descuento, selecciona la primera', async () => {
      const PRODUCT_WITH_PROMOTIONS = PRODUCTS.filter (PRODUCT => { return PRODUCT.promotionsId.length > 0 && PRODUCT.id === 8});
      const response = await request(app).get ('/api/promotions').send();
      expect (response.statusCode).toBe(200)
      PRODUCT_WITH_PROMOTIONS.forEach ((PRODUCT, index) => {
        expect(response.body[index].bestPromotion.id).toBe(PRODUCT.bestPromotionId)
       })
    });

    test('Si promoción desactivada esta asociada a un producto, no mostrar promoción', async () => {
      const PROMOTIONS_NOT_ACTIVES = PROMOTIONS.filter (PROMO => { return !PROMO.isActive});
      const response = await request(app).get ('/api/promotions').send();
      expect (response.statusCode).toBe(200)
      response.body.forEach ((product: { promotions: { id: number; }[]; }) => {
        product.promotions.forEach ((promo: { id: number; }) => {
          expect (PROMOTIONS_NOT_ACTIVES.findIndex (PROMO_NOT_ACTIVE => PROMO_NOT_ACTIVE.id === promo.id)).toBe(-1) ;
        });
      })
    });

    test('Calcula precio de producto con descuento por cada promoción', async () => {
      const PRODUCT_WITH_PROMOTIONS = PRODUCTS.filter (PRODUCT => { return PRODUCT.promotionsId.length > 0});
      const response = await request(app).get ('/api/promotions').send();
      expect (response.statusCode).toBe(200)
      PRODUCT_WITH_PROMOTIONS.forEach (PRODUCT => {
        const index: number = response.body.findIndex ((product: { id: number; }) => { return product.id === PRODUCT.id})
        if (index > -1){
          if (response.body[index].promotions.length > 0){
            let promotionsPrice: number [] = [];
            response.body[index].promotions.forEach ((promotion: { price: number; }) => {
              promotionsPrice.push(Number (promotion.price))
            })
            expect(promotionsPrice).toStrictEqual(PRODUCT.promotionsPrice);
         }
        }
       })
    });

    test('Crea nuevo pedido', async () => {
      const ORDER = ORDERS[0];
          let order: Order = new Order();
          order.items = [];
          const productsId: number[] = [];
          ORDER.products.forEach (PRODUCT => {
              productsId.push (PRODUCT.productId)
          })
          const products = PRODUCTS.filter (product => {
            return productsId.includes(product.id)
          })
          expect(products.length).toBe(productsId.length);  
          products.forEach (async (product, index) => {
            let item: Item = new Item();
            item.productId = product.id;
            expect(item.productId).toBe(ORDER.products[index].productId);
            item.quantity = ORDER.products[index].quantity;
            order.items.push (JSON.parse (JSON.stringify (item)));
            item.name = product.name;
            if (product.bestPromotionIndex != null){
              item.price = product.promotionsPrice[product.bestPromotionIndex as number] 
              item.discount =  100 - (product.promotionsPrice[product.bestPromotionIndex as number] * 100 / product.price);
            } else {
              item.price = product.price;
              item.discount = 0;
            }
          });
          const response = await request(app).post ('/api/orders').send(order);
          expect (response.statusCode).toBe(201);
          let productsCreatedId: number [] = []
          response.body.items.forEach ((item: { productId: number; }) => {
            productsCreatedId.push (item.productId);
          })
          order.items.forEach (item => {
            expect (productsCreatedId.includes(item.productId)).toBe(true);
          })
      });
  
});