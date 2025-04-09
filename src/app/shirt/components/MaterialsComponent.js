import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function MaterialsComponent({styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Material</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Cotton", "Athletic", "Sweatshirt"]}
				defaultValue={"Cotton"}
			/>
		</div>
	);
}
