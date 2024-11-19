import { BackendMethod, remult } from 'remult';
import { Product } from '../../entities/product';
import { getProductRepo } from '../../index';
import { abac } from '../../utils/abac';

export class ProductController {
  @BackendMethod({
    apiPrefix: 'product',
    allowed: () => {
      return abac.can('create', 'product');
    }
  })
  static async insert(product: Partial<Product>) {
    return await getProductRepo().product.insert(product);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: () => {
      return abac.can('read', 'product');
    }
  })
  static async item(id: string) {
    return await getProductRepo().product.findId(id);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: () => {
      return abac.can('update', 'product');
    }
  })
  static async update(id: string, product: Partial<Product>) {
    return await getProductRepo().product.update(id, product);
  }

  @BackendMethod({
    apiPrefix: 'product',
    allowed: () => {
      return abac.can('delete', 'product');
    }
  })
  static async delete(id: string) {
    return await getProductRepo().product.delete(id);
  }
}
