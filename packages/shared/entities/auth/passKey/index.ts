import { Entity, Field, Fields, Relations } from 'remult';
import { User } from '../user';

@Entity<PassKey>('passkey', {
  allowApiCrud: true,
  dbName: 'passkey',
  defaultOrderBy: { name: 'asc' }
})
export class PassKey {
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

  @Fields.object<Uint8Array>({
    valueConverter: {
      toDb: (value: Uint8Array) => Buffer.from(value).toString('hex'),
      fromDb: (value: string) => new Uint8Array(Buffer.from(value, 'hex'))
    }
  })
  publicKey!: Uint8Array;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
