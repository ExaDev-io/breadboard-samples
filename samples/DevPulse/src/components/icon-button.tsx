import styles from "./button.module.scss";
import Icon from "./icons/Icon";
import { IconName } from "./icons/IconMap";

type ButtonProps = {
	iconName: IconName;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
};
const IconButton = ({
	iconName,
	type,
	onClick,
	disabled = false,
	className,
}: ButtonProps): React.JSX.Element => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={[styles.iconButton, className].join(" ")}
			disabled={disabled}
		>
			<Icon name={iconName} fill="white" />
		</button>
	);
};

export default IconButton;
