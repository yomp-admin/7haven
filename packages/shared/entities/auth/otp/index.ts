import { Entity, Field, Fields, Relations } from 'remult';
import { User } from '../user';

@Entity<Otp>('otp', {
  allowApiCrud: true,
  dbName: 'otp'
})
export class Otp {
  @Fields.cuid()
  id!: string;

  @Fields.string()
  userId!: string;

  @Relations.toOne(() => User, { field: 'userId' })
  user?: User;

  @Field(() => Uint8Array)
  key!: Uint8Array;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
