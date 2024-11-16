import { BackendMethod, remult } from 'remult';
import { getAuthRepo } from '../../../index';

export class userController {
  @BackendMethod({ allowed: true })
  static async sign_out() {
    if (remult.user?.session.id) {
      await getAuthRepo().session.delete(remult.user.session.id);
      remult.user = undefined;
    }
    return { success: true };
  }

  @BackendMethod({ allowed: true })
  static async sign_in_demo(name: string) {
    let user = await getAuthRepo().user.findFirst({ username: name });

    if (!user) {
      user = getAuthRepo().user.create();
      user.username = name;
      user.roles = ['Admin'];
      await getAuthRepo().user.save(user);
    }
  }

  @BackendMethod({ allowed: true })
  static async current_user() {
    return remult.user;
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async is_email_available(email: string): Promise<boolean> {
    const user = await getAuthRepo().user.findFirst({ email });
    return !user;
  }
}
