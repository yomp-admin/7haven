import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, otpFormSchema } from './schema';
import { remult } from '@repo/shared';

export const load: PageServerLoad = async () => {
  if (remult.authenticated()) {
    throw redirect(303, '/');
  }

  return {
    form: await superValidate(zod(formSchema)),
    otpForm: await superValidate(zod(otpFormSchema))
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

  verify: async ({ request }) => {
    const form = await superValidate(request, zod(otpFormSchema));

    if (!form.valid) {
      return fail(400, {
        form,
        error: 'Invalid verification code'
      });
    }

    return {
      form
    }
  }
};
