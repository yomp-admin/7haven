import { BackendMethod, remult } from 'remult';
import { lucia } from '../../../src/lib/auth/lucia';
import { authRepo } from '../..';

export class UserController {
	@BackendMethod({ allowed: true })
	static async signOut() {
		if (remult.user?.session.id) {
			await lucia.invalidateSession(remult.user.session.id);
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
}
