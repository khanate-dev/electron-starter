import { EmptyPage } from '../../components/containers/empty-page.component';
import { AppLogo } from '../../components/media/app-logo.component';
import { useDocTitle } from '../../hooks/doc-title.hook';

export const Welcome = () => {
	useDocTitle();
	return (
		<EmptyPage>
			<AppLogo />
		</EmptyPage>
	);
};
