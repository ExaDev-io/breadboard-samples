import { useSelector } from "react-redux";
import styles from "./output-accordion.module.scss";
import { selectSavedResults } from "../outputSlice";
import { RootState } from "~/core/redux/store";
//import { StoryOutput } from "../domain";
//import OutputAccordionItem from "./output-accordion-item";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type SavedStoryOutputsProps = {
	nodeId?: string;
};

const SavedStoryOutputs = ({
	nodeId,
}: SavedStoryOutputsProps): React.JSX.Element => {
	const savedResults = useSelector((state: RootState) =>
		selectSavedResults(state)
	);
	console.log(savedResults);

	if (nodeId) console.log(nodeId);
	return (
		<div className={styles.container}>
			{/* {savedResults.map((result: StoryOutput) => (
				<OutputAccordionItem result={result} />
			))} */}
		</div>
	);
};

export default SavedStoryOutputs;
