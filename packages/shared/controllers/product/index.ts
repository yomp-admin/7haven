import { BackendMethod, remult, Allow } from 'remult';
import { Product } from '../../entities';

export class ProductController {
  private static repo = remult.repo(Product);

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async insert(product: Partial<Product>) {
    return await this.repo.insert(product);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async update(id: string, product: Partial<Product>) {
    return await this.repo.update(id, product);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async delete(id: string) {
    return await this.repo.delete(id);
  }

  @BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
  static async item(id: string) {
    return await this.repo.findId(id);
  }
}
