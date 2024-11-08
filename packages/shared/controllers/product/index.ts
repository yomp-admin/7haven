import { BackendMethod, remult, Allow } from 'remult';
import { Product } from '../../entities/product';

export class ProductController {
	@BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
	static async insert(product: Partial<Product>) {
		return await remult.repo(Product).insert(product);
	}

	@BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
	static async update(id: string, product: Partial<Product>) {
		return await remult.repo(Product).update(id, product);
	}

	@BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
	static async delete(id: string) {
		return await remult.repo(Product).delete(id);
	}

	@BackendMethod({ apiPrefix: 'product', allowed: Allow.authenticated })
	static async item(id: string) {
		return await remult.repo(Product).findId(id);
	}
}
