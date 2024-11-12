import { remult, type ErrorInfo, type UserInfo } from 'remult';
import { authEntities, productEntities } from './entities';
import { authServices, productServices } from './controllers';

export { remult, ErrorInfo, UserInfo };

export * from './types';

export const entities = [...Object.values(authEntities), ...Object.values(productEntities)];

export const controllers = [...Object.values(authServices), ...Object.values(productServices)];

export const authRepo = {
  securityKey: remult.repo(authEntities.SecurityKey),
  emailReset: remult.repo(authEntities.EmailReset),
  passkey: remult.repo(authEntities.PassKey),
  otp: remult.repo(authEntities.Otp),
  passwordReset: remult.repo(authEntities.PasswordReset),
  session: remult.repo(authEntities.Session),
  user: remult.repo(authEntities.User)
};

export const productRepo = {
  product: remult.repo(productEntities.Product)
};

export const userService = {
  user: authServices.userController,
  securityKey: authServices.securityKeyController
};
