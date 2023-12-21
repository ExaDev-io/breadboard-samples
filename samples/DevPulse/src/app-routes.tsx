import { Route, Routes } from "react-router";
import SavedStoryOutputs from "./hnStory/components/saved-story-outputs";
import SearchQueryHistory from "./hnStory/components/search-query-history";
import { BreadboardComponent } from "./lib/components/BreadboardComponent";

const routeItems: { path: string; element: React.ReactNode }[] = [
	{
		path: "/search",
		element: <BreadboardComponent />,
	},
	{
		path: "/saved-results",
		element: <SavedStoryOutputs />,
	},
	{
		path: "/queries-history",
		element: <SearchQueryHistory />,
	},
];

const AppRoutes = (): React.JSX.Element => {
	return (
		<Routes>
			{routeItems.map((route) => (
				<Route path={route.path} element={route.element} />
			))}
		</Routes>
	);
};

export default AppRoutes;
