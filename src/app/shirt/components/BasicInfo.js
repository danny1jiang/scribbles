import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function BasicInfoComponent({setFormData, formData, styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Quantity</CustomText>
			<input
				className={
					styles.textBox + " " + styles.textBoxNormal + " " + styles.textBoxPadding
				}
				defaultValue={formData.quantity}
				onChange={(e) => {
					setFormData({...formData, quantity: e.target.value});
				}}
				type="number"
			/>
			<CustomText className={"mt-5"} type={"medium"}>
				Size
			</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Small", "Medium", "Large"]}
				defaultValue={formData.size}
				onChange={(selected) => {
					setFormData({...formData, size: selected});
				}}
			/>
		</div>
	);
}
