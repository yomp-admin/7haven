import { Allow, Entity, Fields, Relations, Validators } from 'remult';
import { User } from '../auth/user';
import { Product } from '../product';

@Entity<Business>('business', {
  allowApiCrud: Allow.authenticated,
  dbName: 'business'
})
export class Business {
  @Fields.cuid()
  id!: string;

  @Fields.string({ validate: [Validators.required] })
  name!: string;

  @Fields.string()
  ownerId!: string;

  @Relations.toOne(() => User, 'ownerId')
  owner?: User;

  @Fields.object()
  settings: {
    allowMultipleStores: boolean;
    maxProducts: number;
    features: string[];
  } = {
    allowMultipleStores: false,
    maxProducts: 100,
    features: []
  };

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;

  @Relations.toMany<Business, Product>(() => Product, 'businessId')
  products?: Product[];
}
