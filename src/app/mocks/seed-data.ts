// /* spell-checker: disable */

// import { UserWithPassword } from 'types/general';

// export const users: UserWithPassword[] = [
// 	{
// 		UserID: 1,
// 		UserName: 'test',
// 		Password: 'test',
// 		UserType: 'Administrator',
// 		LineID: 1,
// 		SectionID: 1,
// 		CreatedAt: '2022-03-09T16:17:25.183Z',
// 		UpdatedAt: '2022-03-09T16:17:25.183Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 2,
// 		UserName: 'QA',
// 		Password: '12345',
// 		UserType: 'Administrator',
// 		LineID: 107,
// 		SectionID: 1,
// 		CreatedAt: '2022-03-11T12:13:33.690Z',
// 		UpdatedAt: '2022-03-11T12:13:33.690Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 4,
// 		UserName: 'hamza',
// 		Password: 'hamza',
// 		UserType: 'Administrator',
// 		LineID: 113,
// 		SectionID: 303,
// 		CreatedAt: '2022-03-16T14:35:02.043Z',
// 		UpdatedAt: '2022-03-16T14:35:02.043Z',
// 		UserImageUrl: '2022-03-16T09:35:01.968Z',
// 		UserThumbnailUrl: '2022-03-16T09:35:01.968Z'
// 	},
// 	{
// 		UserID: 5,
// 		UserName: 'hamzaw',
// 		Password: 'hamzaw',
// 		UserType: 'Worker',
// 		LineID: 113,
// 		SectionID: 305,
// 		CreatedAt: '2022-03-16T16:25:21.000Z',
// 		UpdatedAt: '2022-03-16T16:25:21.000Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 6,
// 		UserName: 'test10',
// 		Password: 'test10',
// 		UserType: 'Administrator',
// 		LineID: 113,
// 		SectionID: 173,
// 		CreatedAt: '2022-03-16T18:31:46.440Z',
// 		UpdatedAt: '2022-03-16T18:31:46.440Z',
// 		UserImageUrl: '2022-03-16T13:31:46.400Z',
// 		UserThumbnailUrl: '2022-03-16T13:31:46.400Z'
// 	},
// 	{
// 		UserID: 7,
// 		UserName: 'test11',
// 		Password: 'test11',
// 		UserType: 'Administrator',
// 		LineID: 109,
// 		SectionID: 176,
// 		CreatedAt: '2022-03-16T18:33:32.943Z',
// 		UpdatedAt: '2022-03-16T18:33:32.943Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 8,
// 		UserName: 'test12',
// 		Password: 'test12',
// 		UserType: 'Administrator',
// 		LineID: 112,
// 		SectionID: 173,
// 		CreatedAt: '2022-03-16T18:34:40.740Z',
// 		UpdatedAt: '2022-03-16T18:34:40.740Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 9,
// 		UserName: 'test13',
// 		Password: 'test13',
// 		UserType: 'Administrator',
// 		LineID: 109,
// 		SectionID: 173,
// 		CreatedAt: '2022-03-16T18:36:51.330Z',
// 		UpdatedAt: '2022-03-16T18:36:51.330Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 10,
// 		UserName: 'test14',
// 		Password: 'test14',
// 		UserType: 'Administrator',
// 		LineID: 112,
// 		SectionID: 170,
// 		CreatedAt: '2022-03-16T18:38:41.187Z',
// 		UpdatedAt: '2022-03-16T18:38:41.187Z',
// 		UserImageUrl: '2022-03-16T13:38:41.150Z',
// 		UserThumbnailUrl: '2022-03-16T13:38:41.150Z'
// 	},
// 	{
// 		UserID: 11,
// 		UserName: 'test16',
// 		Password: 'test16',
// 		UserType: 'Administrator',
// 		LineID: 106,
// 		SectionID: 171,
// 		CreatedAt: '2022-03-16T18:40:23.813Z',
// 		UpdatedAt: '2022-03-16T18:40:23.813Z',
// 		UserImageUrl: '2022-03-16T13:40:23.741Z',
// 		UserThumbnailUrl: '2022-03-16T13:40:23.741Z'
// 	},
// 	{
// 		UserID: 12,
// 		UserName: 'test17',
// 		Password: 'test17',
// 		UserType: 'Administrator',
// 		LineID: 106,
// 		SectionID: 431,
// 		CreatedAt: '2022-03-16T18:41:49.960Z',
// 		UpdatedAt: '2022-03-16T18:41:49.960Z',
// 		UserImageUrl: '2022-03-16T13:41:49.893Z',
// 		UserThumbnailUrl: '2022-03-16T13:41:49.893Z'
// 	},
// 	{
// 		UserID: 14,
// 		UserName: 'test18',
// 		Password: 'test18',
// 		UserType: 'Administrator',
// 		LineID: 110,
// 		SectionID: 179,
// 		CreatedAt: '2022-03-16T18:47:26.120Z',
// 		UpdatedAt: '2022-03-16T18:47:26.120Z',
// 		UserImageUrl: '2022-03-16T13:47:26.078Z',
// 		UserThumbnailUrl: '2022-03-16T13:47:26.078Z'
// 	},
// 	{
// 		UserID: 15,
// 		UserName: 'test-v2-1',
// 		Password: 'test-v2-1',
// 		UserType: 'Administrator',
// 		LineID: 208,
// 		SectionID: 448,
// 		CreatedAt: '2022-04-08T15:31:15.677Z',
// 		UpdatedAt: '2022-04-08T15:31:15.677Z',
// 		UserImageUrl: '2022-04-08T10:31:16.694Z',
// 		UserThumbnailUrl: '2022-04-08T10:31:16.694Z'
// 	},
// 	{
// 		UserID: 16,
// 		UserName: 'test-v2-2',
// 		Password: 'test-v2-2',
// 		UserType: 'Administrator',
// 		LineID: 207,
// 		SectionID: 447,
// 		CreatedAt: '2022-04-08T15:33:17.390Z',
// 		UpdatedAt: '2022-04-08T15:33:17.390Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 18,
// 		UserName: 'test-v2-3',
// 		Password: 'test-v2-3',
// 		UserType: 'Administrator',
// 		LineID: 205,
// 		SectionID: 444,
// 		CreatedAt: '2022-04-08T15:38:23.387Z',
// 		UpdatedAt: '2022-04-08T15:38:23.387Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 19,
// 		UserName: 'test-v2-5',
// 		Password: 'test-v2-5',
// 		UserType: 'Administrator',
// 		LineID: 204,
// 		SectionID: 446,
// 		CreatedAt: '2022-04-08T15:39:33.037Z',
// 		UpdatedAt: '2022-04-08T15:39:33.037Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 1016,
// 		UserName: 'worder',
// 		Password: 'worker',
// 		UserType: 'Worker',
// 		LineID: 204,
// 		SectionID: 448,
// 		CreatedAt: '2022-06-03T12:01:12.117Z',
// 		UpdatedAt: '2022-06-03T12:01:12.117Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	},
// 	{
// 		UserID: 1017,
// 		UserName: 'worker',
// 		Password: 'worker',
// 		UserType: 'Worker',
// 		LineID: 212,
// 		SectionID: 522,
// 		CreatedAt: '2022-06-03T12:02:22.637Z',
// 		UpdatedAt: '2022-06-03T12:02:22.637Z',
// 		UserImageUrl: null,
// 		UserThumbnailUrl: null
// 	}
// ];
export {};
