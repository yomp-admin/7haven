import { Entity, Fields, Validators, Relations } from 'remult';
import { Account } from './accountEntity';

@Entity<EvrKeyData>('evrKeyData', {
	allowApiCrud: true,
	dbName: 'evr_key_data'
})
export class EvrKeyData {
	@Fields.cuid()
	id!: string;

	@Fields.string({ validate: [Validators.unique], allowNull: true })
	user_key_data_id?: string;

	@Relations.toOne(() => Account, { field: 'user_key_data_id' })
	user_key_data?: Account;

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
