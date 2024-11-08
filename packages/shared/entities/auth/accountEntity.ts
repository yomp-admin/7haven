import { Entity, Fields, Validators, Relations } from 'remult';
import { publicId } from '..';
import { DeviceKeyData } from './DeviceKeyData';
import { EvrKeyData } from './EvrKeyData';
import { KeychainKeyData } from './KeychainKeyData';
import { OtpKeyData } from './OtpKeyData';
import { PrsKeyData } from './PrsKeyData';
import { Session } from './sessionEntity';

@Entity<Account>('accounts', {
	allowApiCrud: true,
	dbName: 'accounts'
})
export class Account {
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
	passwordHash!: string;

	@Fields.object<Account, string[]>({
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

	@Relations.toMany(() => DeviceKeyData)
	deviceKeyData?: DeviceKeyData[];

	@Relations.toMany(() => EvrKeyData)
	evrKeyData?: EvrKeyData[];

	@Relations.toMany(() => KeychainKeyData)
	keychainKeyData?: KeychainKeyData[];

	@Relations.toMany(() => OtpKeyData)
	otpKeyData?: OtpKeyData[];

	@Relations.toMany(() => PrsKeyData)
	prsKeyData?: PrsKeyData[];

	@Relations.toMany<Account, Session>(() => Session, 'userId')
	sessions?: Session[];
}
