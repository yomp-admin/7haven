import { Entity, Field, Fields, Relations } from 'remult';
import { Account } from './accountEntity';

@Entity<KeychainKeyData>('keychainKeyData', {
	allowApiCrud: true,
	dbName: 'keychain_key_data',
	defaultOrderBy: { name: 'asc' }
})
export class KeychainKeyData {
	@Field(() => Uint8Array)
	id!: Uint8Array;

	@Fields.string()
	userId!: string;

	@Relations.toOne(() => Account, { field: 'userId' })
	user_key_data?: Account;

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
