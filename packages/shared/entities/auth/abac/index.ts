import { Allow, Entity, Fields, Relations, Validators } from 'remult';
import { User } from '../user';
import { Business } from '../../business';
import {
  type BusinessRole,
  type Resource,
  type Action,
  type BusinessConditions
} from '../../../utils/abac/permissions';

@Entity<Permission>('permissions', {
  allowApiCrud: Allow.authenticated,
  dbName: 'permissions'
})
export class Permission {
  @Fields.cuid()
  id!: string;

  @Fields.string()
  userId!: string;

  @Relations.toOne(() => User, { field: 'userId' })
  user?: User;

  @Fields.string()
  businessId!: string;

  @Relations.toOne(() => Business, { field: 'businessId' })
  business?: Business;

  @Fields.string()
  resource!: Resource;

  @Fields.string()
  action!: Action<Resource>;

  @Fields.string()
  role!: BusinessRole;

  @Fields.object<Permission, BusinessConditions>({
    valueConverter: {
      toDb: (value) => (value ? JSON.stringify(value) : '{}'),
      fromDb: (value) => (value ? JSON.parse(value) : {})
    }
  })
  conditions: BusinessConditions = {};

  @Fields.boolean({ defaultValue: () => true })
  isAllowed!: boolean;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
