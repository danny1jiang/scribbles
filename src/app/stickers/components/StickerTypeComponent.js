import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function StickerTypeComponent({setFormData, formData, styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Sticker Type</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Dye Cut", "Sticker Sheet"]}
				defaultValue={formData.material}
				onChange={(selected) => {
					setFormData({...formData, type: selected});
				}}
			/>
		</div>
	);
}
