import { Entity, Fields, Validators, Relations } from 'remult';
import { abac, preFilter } from '../../utils/abac';
import { Business } from '../business';

function can(action: string) {
  return abac.can(action, 'product', { businessId: 'dmtuh9tjeyoi13ikovm6g8xw' });
}
@Entity<Product>('products', {
  allowApiInsert: () => can('create'),
  allowApiRead: () => can('read'),
  allowApiUpdate: () => can('update'),
  allowApiDelete: () => can('delete'),
  backendPrefilter: () => Product.canRead()
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

  @Fields.string({ allowNull: true })
  categoryId?: string;

  @Fields.string({
    validate: [Validators.required]
  })
  businessId!: string;

  @Relations.toOne(() => Business, 'businessId')
  business?: Business;

  @Fields.boolean({
    defaultValue: () => false
  })
  isPublished!: boolean;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;

  static canRead = preFilter<Product>();
}
