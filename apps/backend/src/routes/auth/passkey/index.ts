import { Hono } from 'hono';
import { signInWithPasskey, registerPasskey } from './handler';
import { passkeyRegisterValidator, passkeySignInValidator } from './validator';
import { createChallenge } from '../handler';

const passkeyRouter = new Hono();

passkeyRouter.post('/sign-in', passkeySignInValidator, signInWithPasskey);
passkeyRouter.post('/register', passkeyRegisterValidator, registerPasskey);
passkeyRouter.post('/challenge', createChallenge);

export default passkeyRouter;
