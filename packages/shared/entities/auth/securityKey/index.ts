import { Entity, Field, Fields, Relations } from 'remult';
import { User } from '../user';

@Entity<SecurityKey>('securitykey', {
  allowApiCrud: true,
  dbName: 'securitykey',
  defaultOrderBy: { name: 'asc' }
})
export class SecurityKey {
  @Field(() => Uint8Array)
  id!: Uint8Array;

  @Fields.string()
  userId!: string;

  @Relations.toOne(() => User, { field: 'userId' })
  user?: User;

  @Fields.string()
  name!: string;

  @Fields.number()
  algorithm!: number;

  @Field(() => Uint8Array)
  publicKey!: Uint8Array;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
