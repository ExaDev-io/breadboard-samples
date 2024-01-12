import styles from "./layouts.module.scss";

type CenteredProps = {
	className?: string;
	children?: React.ReactNode;
};
const Centered = ({ className = "centered", children }: CenteredProps): React.JSX.Element => {
	return (
		<div className={[className, styles.centered].join(" ")} data-cy="Centered">
			{children}
		</div>
	);
};

export default Centered;
