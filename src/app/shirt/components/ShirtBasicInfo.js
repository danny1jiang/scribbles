import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function ShirtBasicInfoComponent({setFormData, formData, styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Quantity</CustomText>
			<input
				className={
					styles.textBox + " " + styles.textBoxNormal + " " + styles.textBoxPadding
				}
				type="text"
				value={formData.quantity}
				onChange={(e) => {
					setFormData({...formData, quantity: e.target.value.replace(/[^0-9]/g, "")});
				}}
			/>
			<CustomText className={"mt-5"} type={"medium"}>
				Size
			</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={[
					"Youth Small",
					"Youth Medium",
					"Youth Large",
					"Adult Small",
					"Adult Medium",
					"Adult Large",
					"Adult 2XL",
					"Adult 3XL",
				]}
				defaultValue={formData.size}
				onChange={(selected) => {
					setFormData({...formData, size: selected});
				}}
			/>
		</div>
	);
}
