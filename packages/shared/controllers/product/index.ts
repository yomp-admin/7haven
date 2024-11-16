import { BackendMethod } from 'remult';
import { Product } from '../../entities/product';
import { getProductRepo } from '../../index';

export class ProductController {
  @BackendMethod({
    apiPrefix: 'product',
    allowed: true
  })
  static async insert(product: Partial<Product>) {
    return await getProductRepo().product.insert(product);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: true
  })
  static async update(id: string, product: Partial<Product>) {
    return await getProductRepo().product.update(id, product);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: true
  })
  static async delete(id: string) {
    return await getProductRepo().product.delete(id);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: true
  })
  static async item(id: string) {
    return await getProductRepo().product.findId(id);
  }
}
