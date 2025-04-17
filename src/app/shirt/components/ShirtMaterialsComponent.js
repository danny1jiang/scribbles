import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function ShirtMaterialsComponent({setFormData, formData, styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Material</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Cotton", "Athletic", "Sweatshirt"]}
				defaultValue={formData.material}
				onChange={(selected) => {
					setFormData({...formData, material: selected});
				}}
			/>
		</div>
	);
}
