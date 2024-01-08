import { useNavigate } from "react-router";
import SidebarButton from "./sidebar-button";
import styles from "./sidebar.module.scss";

const Sidebar = (): React.JSX.Element => {
	const navigate = useNavigate();

	const navigateToSearch = () => {
		navigate("/search");
	};

	const navigateToResults = () => {
		navigate("/saved-results");
	};

	const navigateToHistory = () => {
		navigate("/queries-history");
	};

	return (
		<div className={[styles.sidebar].join(" ")} data-cy="Sidebar">
			<SidebarButton
				icon="noteAdd"
				label="Search"
				onClick={navigateToSearch}
			/>
			<SidebarButton
				icon="history"
				label="Query History"
				onClick={navigateToHistory}
			/>
			<SidebarButton
				icon="bookmark"
				label="Saved Results"
				onClick={navigateToResults}
			/>
		</div>
	);
};

export default Sidebar;
