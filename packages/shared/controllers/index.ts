import { securityKeyController } from './auth/2fa/securitykey';
import { ProductController as pController } from './product';

export const AuthController = [securityKeyController];
export const ProductController = [pController];
