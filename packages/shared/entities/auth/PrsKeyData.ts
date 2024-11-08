import { Entity, Fields, Relations, Validators } from 'remult';
import { Account } from './accountEntity';

@Entity<PrsKeyData>('prsKeyData', {
	allowApiCrud: true,
	dbName: 'prs_key_data'
})
export class PrsKeyData {
	@Fields.cuid()
	id!: string;

	@Fields.string({ validate: [Validators.unique] })
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

	@Fields.boolean()
	two_factor_verified!: boolean;

	@Fields.createdAt()
	createdAt!: Date;

	@Fields.updatedAt()
	updatedAt?: Date;
}
