import { BackendMethod, remult, Allow } from 'remult';
import { Product } from '../../entities/product';
import { productRepo } from '../../index';

export class ProductController {
  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async insert(product: Partial<Product>) {
    return await productRepo.product.insert(product);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async update(id: string, product: Partial<Product>) {
    return await productRepo.product.update(id, product);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async delete(id: string) {
    return await productRepo.product.delete(id);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async item(id: string) {
    return await productRepo.product.findId(id);
  }
}
