import { Entity, Fields, Validators, Allow } from 'remult';

@Entity<Product>('products', {
	allowApiCrud: Allow.authenticated,
	dbName: 'products'
})
export class Product {
	@Fields.cuid()
	id!: string;

	@Fields.string({ validate: [Validators.required] })
	name!: string;

	@Fields.number({ validate: [Validators.required] })
	price!: number;

	@Fields.string()
	description?: string;

	@Fields.createdAt()
	createdAt!: Date;

	@Fields.updatedAt()
	updatedAt?: Date;
}
