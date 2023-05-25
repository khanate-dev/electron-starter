// import { backendApiEndpoint } from '~/app/config';
// import { rest, RestContext } from 'msw';
// import { User } from 'types/general';
// import { users } from './seed-data';

// interface LoginBody {
// 	UserName: string,
// 	Password: string,
// }

// const signin = rest.post<
// 	LoginBody,
// 	Record<string, never>,
// 	SuccessResponse<User> | ErrorResponse
// >(
// 	getPath('signin'),
// 	async (request, response, context) => {

// 		const { UserName, Password } = await request.json<LoginBody>();

// 		const user = users.find(user => user.UserName === UserName);

// 		if (!user) {
// 			return response(
// 				context.status(404),
// 				context.json({
// 					statusCode: 404,
// 					error: 'Not Found',
// 					message: 'No User With This UserName Exists!'
// 				})
// 			);
// 		}

// 		const {
// 			Password: userPassword,
// 			...userWithoutPassword
// 		} = user;

// 		if (Password !== userPassword) {
// 			return response(
// 				context.status(406),
// 				context.json({
// 					statusCode: 406,
// 					error: 'Not Found',
// 					message: 'No User With This UserName Exists!'
// 				})
// 			);
// 		}

// 		return response(
// 			context.status(200),
// 			context.json({
// 				statusCode: 200,
// 				error: 'Success!',
// 				message: 'Sign-In Successful!',
// 				data: userWithoutPassword
// 			})
// 		);

// 	}
// );

// export const handlers = [
// 	signin,
// ];
export {};
