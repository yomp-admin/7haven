import { Entity, Field, Fields, Relations } from 'remult';
import { Account } from './accountEntity';

@Entity<OtpKeyData>('otpKeyData', {
	allowApiCrud: true,
	dbName: 'otp_key_data'
})
export class OtpKeyData {
	@Fields.cuid()
	id!: string;

	@Fields.string()
	userId!: string;

	@Relations.toOne(() => Account, { field: 'userId' })
	user_key_data?: Account;

	@Field(() => Uint8Array)
	key!: Uint8Array;

	@Fields.createdAt()
	createdAt!: Date;

	@Fields.updatedAt()
	updatedAt?: Date;
}
