import { BackendMethod, remult } from 'remult';
import { authRepo } from '../../../index';

export class userController {
  @BackendMethod({ allowed: true })
  static async signOut() {
    if (remult.user?.session.id) {
      await authRepo.session.delete(remult.user.session.id);
      remult.user = undefined;
    }
    return { success: true };
  }

  @BackendMethod({ allowed: true })
  static async signInDemo(name: string) {
    let user = await authRepo.user.findFirst({ username: name });

    if (!user) {
      user = authRepo.user.create();
      user.username = name;
      user.roles = ['Admin'];
      await authRepo.user.save(user);
    }
  }

  @BackendMethod({ allowed: true })
  static async currentUser() {
    return remult.user;
  }

  @BackendMethod({ allowed: true })
  static async isEmailAvailable(email: string): Promise<boolean> {
    const user = await authRepo.user.findFirst({ email });
    return !user;
  }
}
