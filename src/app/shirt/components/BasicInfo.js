import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function BasicInfoComponent({styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Quantity</CustomText>
			<input className={styles.textBox + " " + styles.textBoxNormal} type="number" />
			<CustomText className={"mt-5"} type={"medium"}>
				Size
			</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Small", "Medium", "Large"]}
				defaultValue={"Small"}
			/>
		</div>
	);
}
