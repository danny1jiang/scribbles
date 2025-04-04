import {CustomText} from "@/components/CustomText";

export function BasicInfoComponent({styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full mt-8 mb-12">
			<CustomText type={"medium"}>Quantity</CustomText>
			<input className={styles.textBox + " " + styles.textBoxNormal} type="number" />
			<CustomText className={"mt-5"} type={"medium"}>
				Size
			</CustomText>
			<select className={styles.textBox + " " + styles.textBoxNormal}>
				<option value="someOption">Small</option>
				<option value="otherOption">Medium</option>
				<option value="otherOption">Large</option>
			</select>
		</div>
	);
}
