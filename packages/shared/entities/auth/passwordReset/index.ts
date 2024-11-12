import { Entity, Fields, Relations, Validators } from 'remult';
import { User } from '../user';

@Entity<PasswordReset>('password_reset', {
  allowApiCrud: true,
  dbName: 'password_reset'
})
export class PasswordReset {
  @Fields.cuid()
  id!: string;

  @Fields.string({ validate: [Validators.unique] })
  userId?: string;

  @Relations.toOne(() => User, { field: 'userId' })
  user?: User;

  @Fields.string({ inputType: 'email' })
  email!: string;

  @Fields.string()
  code!: string;

  @Fields.dateOnly()
  expires_at!: Date;

  @Fields.boolean()
  email_verified!: boolean;

  @Fields.boolean()
  two_factor_verified!: boolean;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
