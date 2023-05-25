// import {
// 	rest,
// 	DefaultBodyType,
// 	PathParams,
// 	RestRequest,
// } from 'msw';

// type HttpInformationCode = (
// 	| 100
// 	| 101
// 	| 102
// 	| 103
// );

// type HttpSuccessCode = (
// 	| 200
// 	| 201
// 	| 202
// 	| 203
// 	| 204
// 	| 205
// 	| 206
// 	| 207
// 	| 208
// 	| 226
// );

// type HttpRedirectionCode = (
// 	| 300
// 	| 301
// 	| 302
// 	| 303
// 	| 304
// 	| 305
// 	| 306
// 	| 307
// 	| 308
// );

// type HttpClientErrorCode = (
// 	| 400
// 	| 401
// 	| 402
// 	| 403
// 	| 404
// 	| 405
// 	| 406
// 	| 407
// 	| 408
// 	| 409
// 	| 410
// 	| 411
// 	| 412
// 	| 413
// 	| 414
// 	| 415
// 	| 416
// 	| 418
// 	| 421
// 	| 422
// 	| 423
// 	| 424
// 	| 425
// 	| 426
// 	| 428
// 	| 429
// 	| 431
// 	| 451
// );

// type HttpServerErrorCode = (
// 	| 500
// 	| 501
// 	| 502
// 	| 503
// 	| 504
// 	| 505
// 	| 506
// 	| 507
// 	| 508
// 	| 510
// 	| 511
// );

// type HttpCode = (
// 	| HttpInformationCode
// 	| HttpSuccessCode
// 	| HttpRedirectionCode
// 	| HttpClientErrorCode
// 	| HttpServerErrorCode
// );

// interface Response {
// 	statusCode: HttpCode,
// 	error: string,
// 	message: string,
// }

// interface ErrorResponse extends Response {
// 	statusCode: Exclude<HttpCode, HttpSuccessCode>,
// }

// interface SuccessResponse<Data> extends Response {
// 	statusCode: HttpSuccessCode,
// 	data: Data,
// }

// const getPath = (path: string) => `${backendApiEndpoint}/${path}`;

// const genericResponse = <Req, Res, Ctx>(request: Request, response: Res, context: Ctx) =>

// const notFound = (message: string, response: response) => ();

// 	const route = {
// 		post: <
// 			Body extends DefaultBodyType = DefaultBodyType,
// 			Params extends PathParams<keyof Params> = PathParams<string>,
// 			Response extends DefaultBodyType = DefaultBodyType
// 		>(
// 			path: string,
// 			callback: (
// 				request: RestRequest<Body, Params>,
// 				response: {
// 					notFound;
// 				},
// 			)
// 	) => {

// 			rest.post<
// 				Body,
// 				Params,
// 				SuccessResponse<Response> | ErrorResponse
// 			>(
// 				getPath(path),
// 				(request, response, context) => {

// 					const typedRequest = {
// 						...request,
// 						json: request.json<Body>,
// 					};

// 					const responseUtil = {

// 					};

// 					return (typedRequest, responseUtil);

// 				}
// 			);

// 		}
// 	};
export {};
