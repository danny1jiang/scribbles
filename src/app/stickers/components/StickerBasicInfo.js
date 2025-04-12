import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function StickerBasicInfoComponent({setFormData, formData, styles}) {
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
		</div>
	);
}
