import { remult, type UserInfo, type ErrorInfo } from 'remult';
import { authEntities, authEntity } from './entities/auth';
import { productEntities } from './entities/product';
import { AuthController, ProductController } from './controllers';

export { remult, type UserInfo, type ErrorInfo };

export const entities = [...authEntities, ...productEntities];
export const controllers = [...AuthController, ...ProductController];

export const authRepo = {
	securityKey: remult.repo(authEntity.securityKey),
	emailReset: remult.repo(authEntity.emailReset),
	passkey: remult.repo(authEntity.passkey),
	otp: remult.repo(authEntity.otp),
	passReset: remult.repo(authEntity.passReset),
	session: remult.repo(authEntity.session),
	user: remult.repo(authEntity.user)
};
