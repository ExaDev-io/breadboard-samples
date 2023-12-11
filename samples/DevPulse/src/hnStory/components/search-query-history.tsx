import styles from "./output-accordion.module.scss";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type SearchQueryHistoryProps = {
	nodeId?: string;
};

const SearchQueryHistory = ({
	nodeId,
}: SearchQueryHistoryProps): React.JSX.Element => {
	if (nodeId) console.log(nodeId);
	return (
		<div className={styles.container}>
			This is where the latest search queries will be displayed.
		</div>
	);
};

export default SearchQueryHistory;
