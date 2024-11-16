import { Allow, Entity, Fields, Relations, Validators } from 'remult';
import { User } from '../user';

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

  @Fields.string({ validate: [Validators.required] })
  resource!: string;

  @Fields.string({ validate: [Validators.required] })
  action!: string;

  @Fields.object<Permission, Record<string, any>>({
    valueConverter: {
      toDb: (x) => JSON.stringify(x),
      fromDb: (x) => JSON.parse(x || '{}')
    }
  })
  attributes: Record<string, any> = {};

  @Fields.boolean({ defaultValue: () => true })
  isAllowed!: boolean;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}

export interface ResourceAction {
  resource: string;
  action: string;
  attributes?: Record<string, any>;
}
