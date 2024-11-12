import { Allow, Entity, Fields, Relations } from 'remult';
import { User } from '../user';

@Entity<Session>('session', {
  allowApiCrud: Allow.authenticated,
  dbName: 'session'
})
export class Session {
  @Fields.string({ allowApiUpdate: false })
  id!: string;

  @Fields.string()
  userId!: string;

  @Relations.toOne<Session, User>(() => User, 'userId')
  userPublicId?: User;

  @Fields.date()
  expiresAt!: Date;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.updatedAt()
  updatedAt?: Date;
}
