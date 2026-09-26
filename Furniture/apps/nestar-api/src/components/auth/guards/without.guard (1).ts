import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WithoutGuard implements CanActivate {
	constructor(private authService: AuthService) { }

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		console.info('--- @guard() Authentication [WithoutGuard] ---');

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req,
				bearerToken = request.headers.authorization;

			if (bearerToken) {
				try {
					const token = bearerToken.split(' ')[1];

					console.log('TOKEN EXISTS:', !!token);

					const authMember = await this.authService.verifyToken(token);

					console.log('AUTH MEMBER FROM TOKEN:', authMember);

					request.body.authMember = authMember;
				} catch (err) {
					console.log('VERIFY ERROR:', err);
					request.body.authMember = null;
				}
			} else {
				console.log('NO BEARER TOKEN');
				request.body.authMember = null;
			}
			console.log('memberNick[without] =>', request.body.authMember?.memberNick ?? 'none');
			return true;
		}
		return false;
		// description => http, rpc, gprs and etc are ignored
	}
}
