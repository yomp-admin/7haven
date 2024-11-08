import { Entity, Field, Fields, Relations } from 'remult';
import { Account } from './accountEntity';

@Entity<DeviceKeyData>('deviceKeyData', {
	allowApiCrud: true,
	dbName: 'device_key_data',
	defaultOrderBy: { name: 'asc' }
})
export class DeviceKeyData {
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

	@Field(() => Uint8Array)
	publicKey!: Uint8Array;

	@Fields.createdAt()
	createdAt!: Date;

	@Fields.updatedAt()
	updatedAt?: Date;
}
