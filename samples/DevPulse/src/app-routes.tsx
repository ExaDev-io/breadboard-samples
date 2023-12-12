import { Route, Routes } from "react-router";
import SavedStoryOutputs from "./hnStory/components/saved-story-outputs";
import SearchQueryHistory from "./hnStory/components/search-query-history";
import WorkerComponent from "./hnStory/components/worker-component";

const routeItems: { path: string; element: React.ReactNode }[] = [
	{
		path: "/search",
		element: <WorkerComponent />,
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
			{routeItems.map((route, key) => (
				<Route path={route.path} element={route.element} key={key} />
			))}
		</Routes>
	);
};

export default AppRoutes;
