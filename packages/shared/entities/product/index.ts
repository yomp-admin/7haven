import { Entity, Fields, Validators, remult } from 'remult';
import { can, createAbacFilter } from '../../utils/abac';

@Entity<Product>('products', {
  allowApiInsert: () => can.do('create', 'product'),
  allowApiRead: () => can.do('read', 'product'),
  allowApiUpdate: () => can.do('update', 'product'),
  allowApiDelete: () => can.do('delete', 'product', { ownerId: remult.user?.id }),
  apiPrefilter: () => Product.abac(),
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

  @Fields.string({ allowApiUpdate: false })
  ownerId = remult.user?.id || '';

  @Fields.string()
  business?: string;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;

  static abac = createAbacFilter<Product>('product');
}
