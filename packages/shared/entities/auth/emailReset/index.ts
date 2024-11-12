import { Entity, Fields, Validators, Relations } from 'remult';
import { User } from '../user';

@Entity<EmailReset>('email_reset', {
  allowApiCrud: true,
  dbName: 'email_reset'
})
export class EmailReset {
  @Fields.cuid()
  id!: string;

  @Fields.string({ validate: [Validators.unique], allowNull: true })
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

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;
}
