import { remult, type ErrorInfo, type UserInfo } from 'remult';
import { authEntities, productEntities } from './entities';
import { authServices, productServices } from './controllers';

export { remult, ErrorInfo, UserInfo };

export * from './types';
export * from './utils';
export const entities = [...Object.values(authEntities), ...Object.values(productEntities)];

export const controllers = [...Object.values(authServices), ...Object.values(productServices)];

export function getAuthRepo() {
  return {
    securityKey: remult.repo(authEntities.SecurityKey),
    emailReset: remult.repo(authEntities.EmailReset),
    passkey: remult.repo(authEntities.PassKey),
    otp: remult.repo(authEntities.Otp),
    passwordReset: remult.repo(authEntities.PasswordReset),
    session: remult.repo(authEntities.Session),
    user: remult.repo(authEntities.User),
    permission: remult.repo(authEntities.Permission)
  };
}

export function getProductRepo() {
  return {
    product: remult.repo(productEntities.Product)
  };
}

export function getUserService() {
  return {
    user: authServices.userController,
    securityKey: authServices.securityKeyController
  };
}
