import AppRoutes from "~/app-routes";
import ContentBox from "~/layouts/content-box";
import ContentGrid from "~/layouts/content-grid";

const MainContent = (): React.JSX.Element => {
	return (
		<ContentGrid>
			<ContentBox>
				<AppRoutes />
			</ContentBox>
		</ContentGrid>
	);
};

export default MainContent;
