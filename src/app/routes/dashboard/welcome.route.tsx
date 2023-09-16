import { EmptyPage } from '~/app/components/containers/empty-page.component';
import { AppLogo } from '~/app/components/media/app-logo.component';
import { useDocTitle } from '~/app/hooks/doc-title.hook';

export const Welcome = () => {
	useDocTitle();
	return (
		<EmptyPage>
			<AppLogo />
		</EmptyPage>
	);
};
