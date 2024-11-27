import { Entity, Fields, Validators, Relations } from 'remult';
import { publicId } from '../../../utils';
import { SecurityKey } from '../securityKey';
import { EmailReset } from '../emailReset';
import { PassKey } from '../passKey';
import { Otp } from '../otp';
import { PasswordReset } from '../passwordReset';
import { Session } from '../session';
import { Business } from '../../business';

@Entity<User>('users', {
  allowApiCrud: true,
  dbName: 'users'
})
export class User {
  @Fields.cuid()
  id!: string;

  @publicId('acc')
  publicId!: string;

  @Fields.string({
    validate: [Validators.required, Validators.unique, Validators.email()]
  })
  email!: string;

  @Fields.string({
    //validate: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
  })
  username!: string;

  @Fields.string({
    includeInApi: false,
    inputType: 'password'
    //validate: [Validators.required, Validators.minLength(8)]
  })
  password!: string;

  @Fields.object<User, string[]>({
    valueConverter: {
      toDb: (x) => x?.join(','),
      fromDb: (x) => x?.split(',') ?? []
    }
  })
  roles: string[] = [];

  @Fields.boolean({
    defaultValue: () => false
  })
  emailVerified!: boolean;

  @Fields.boolean({
    defaultValue: () => false
  })
  twoFactorVerified!: boolean;

  @Fields.string({ allowNull: true })
  recoveryCode?: string;

  @Fields.number({ defaultValue: () => 0 })
  failedLoginAttempts!: number;

  @Fields.date({ allowNull: true })
  lockoutUntil?: Date;

  @Fields.date({ allowNull: true })
  lastLoginAt?: Date;

  @Fields.createdAt()
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt?: Date;

  @Relations.toMany(() => SecurityKey)
  securityKeys?: SecurityKey[];

  @Relations.toMany(() => EmailReset)
  emailReset?: EmailReset[];

  @Relations.toMany(() => PassKey)
  passKeys?: PassKey[];

  @Relations.toMany(() => Otp)
  otp?: Otp[];

  @Relations.toMany(() => PasswordReset)
  passwordResets?: PasswordReset[];

  @Relations.toMany<User, Session>(() => Session, 'userId')
  sessions?: Session[];

  @Relations.toMany<User, Business>(() => Business, 'ownerId')
  businesses?: Business[];
}
