import { useSyncExternalStore } from 'react';

import { createStore } from '~/helpers/store.helpers';
import { content, defaultLanguage, languageSchema } from '~/i18n';

import type { Language } from '~/i18n';

const store = createStore({
	key: 'language',
	schema: languageSchema,
	defaultVal: defaultLanguage,
});

const subscribe = (callback: () => void) => {
	const listener = (event: StorageEvent) => {
		if (event.key && event.key !== 'language') return;
		callback();
	};
	window.addEventListener('storage', listener);
	return () => {
		window.removeEventListener('storage', listener);
	};
};

export const useI18n = () => {
	const language = useSyncExternalStore(subscribe, store.get);

	return {
		language,
		direction: language === 'urdu' ? 'rtl' : 'ltr',
		rtl: language === 'urdu',
		content: content[language],
	} as const;
};

export const updateLanguage = (language: Language) => {
	store.set(language);
};
