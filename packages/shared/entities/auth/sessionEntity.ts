import { Allow, Entity, Fields, Relations } from 'remult';
import { Account } from './accountEntity';

@Entity<Session>('sessions', {
	allowApiCrud: Allow.authenticated,
	dbName: 'sessions'
})
export class Session {
	@Fields.string({ allowApiUpdate: false })
	id!: string;

	@Fields.string()
	userId!: string;

	@Relations.toOne<Session, Account>(() => Account, 'userId')
	userPublicId?: Account;

	@Fields.date()
	expiresAt!: Date;

	@Fields.createdAt()
	createdAt = new Date();

	@Fields.updatedAt()
	updatedAt?: Date;
}
