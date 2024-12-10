import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, otpSchema, forgotPasswordSchema } from './schema';
import { remult } from '@repo/shared';
import { authState, type AuthState } from './+page.svelte';

export const load: PageServerLoad = async ({ url }) => {
  if (remult.authenticated()) {
    throw redirect(303, '/');
  }

  const params = url.searchParams;
  const initialState: AuthState = (params.has(authState.twoFactor)
    ? authState.twoFactor
    : params.has(authState.forgotPassword)
      ? authState.forgotPassword
      : authState.credentials);
  
 // const isPasswordReset = params.has('password_reset');
 // const resetToken = params.get('token'); 

 // console.log(isPasswordReset, resetToken)

  return {
    form: await superValidate(zod(formSchema)),
    otpForm: await superValidate(zod(otpSchema)),
    forgotPasswordForm: await superValidate(zod(forgotPasswordSchema)),
    initialState
  };
};

export const actions: Actions = {
  signin: async ({ request }) => {
    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      return fail(400, { 
        form,
        error: 'Invalid form submission'
      });
    }
    
    return {
      form
    }
  },

  verify2fa: async ({ request }) => {
    const form = await superValidate(request, zod(otpSchema));

    if (!form.valid) {
      return fail(400, {
        form,
        error: 'Invalid verification code'
      });
    }

    return {
      form
    }
  },

  forgotPassword: async ({ request }) => {
    const form = await superValidate(request, zod(forgotPasswordSchema));

    if (!form.valid) {
      return fail(400, {
        form,
        error: 'Invalid email address'
      });
    }

    return {
      form
    }
  }
};