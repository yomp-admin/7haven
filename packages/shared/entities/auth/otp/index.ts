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

  @Fields.string()
  code!: string;

  @Fields.string()
  type!: OtpType;

  @Fields.date()
  expiresAt!: Date;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}

export type OtpType = 'join' | 'auth' | 'reset';
