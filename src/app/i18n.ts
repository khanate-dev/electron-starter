/* cSpell: disable */

import { z } from 'zod';

export const languages = ['english', 'urdu'] as const;

export const languageSchema = z.enum(languages);

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'english';

const english = {
	title: 'react native starter',
	headings: {
		welcome: 'welcome to\nreact native\nstarter!',
		login: 'hi,\nplease\nlogin!',
		register: "welcome,\nlet's get started!",
	},
	action: {
		login: 'login',
		logout: 'logout',
		register: 'register',
		close: 'close',
		back: 'back',
		forgotPassword: 'forgot password?',
		resetPassword: 'reset password',
		code: {
			normal: 'send code',
			error: 'resend code',
			success: 'code sent!',
		},
		verify: {
			normal: 'verify',
			error: 'retry',
			success: 'verified!',
		},
	},
	error: 'error',
	oops: 'oops',
	genericError: 'something went wrong',
	resetDescription: 'enter the email to get the reset code',
	resetSent: 'a reset code has been sent to your email',
	pathNotFound: (pathname: string) => `path ${pathname} does not exist`,
	pages: {
		notFound: 'not found',
		login: 'login',
		register: 'register',
		resetPassword: 'reset password',
	},
};

export type Content = typeof english;

const urdu: Content = {
	title: 'ری ایکٹ نیٹو ابتدائی',
	headings: {
		welcome: 'ابتدائی\nری اکٹ نیٹو\nمیں خوش آمدید',
		login: 'براہ کرم لاگ ان کریں',
		register: 'خوش آمدید،\nآئیے شروع کرتے ہیں۔',
	},
	action: {
		login: 'داخل ہوں',
		logout: 'خارج ہوں',
		register: 'اندراج',
		close: 'بند کریں',
		back: 'واپس',
		forgotPassword: 'پاسورڈ بھول گئے؟',
		resetPassword: 'پاسورڈ بدلیں',
		code: {
			normal: 'کوڈ بھیجیں',
			error: 'دوبارہ بھیجیں',
			success: 'بھیج دیا',
		},
		verify: {
			normal: 'تصدیق کریں',
			error: 'دوبارہ کریں',
			success: 'تصدیق شدہ!',
		},
	},
	error: 'غلطی',
	oops: 'اوہو',
	genericError: 'نامعلوم مسئلہ درپیش آیا',
	resetDescription: 'تبدیلی کے کوڈ کیلئے ای میل درج کریں',
	resetSent: 'تبدیلی کا کوڈ آپ کو بھیج دیا گیا ہے',
	pathNotFound: (pathname: string) => `نامعلوم صفحہ: ${pathname}`,
	pages: {
		notFound: 'نامعلوم صفحہ',
		login: 'داخلہ',
		register: 'اندراج',
		resetPassword: 'پاسورڈ تبدیلی',
	},
};

export const content: Record<Language, Content> = { english, urdu };
