import {CustomText} from "@/components/CustomText";

export function MaterialsComponent({styles}) {
	return (
		<div className="transition ease-in-out duration-1000 flex flex-col items-start justify-center w-full mt-8 mb-12">
			<CustomText type={"medium"}>Material</CustomText>
			<select className={styles.textBox + " " + styles.textBoxNormal}>
				<option value="someOption">Small</option>
				<option value="otherOption">Medium</option>
				<option value="otherOption">Large</option>
			</select>
		</div>
	);
}
