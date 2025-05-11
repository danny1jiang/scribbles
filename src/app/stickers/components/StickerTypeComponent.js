import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";

export function StickerTypeComponent({setFormData, formData, styles}) {
	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Sticker Type</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Die Cut", "Sticker Sheet"]}
				defaultValue={formData.type}
				onChange={(selected) => {
					setFormData({...formData, type: selected});
				}}
			/>
			<CustomText className={"mt-5"} type={"medium"}>
				Sticker Shape
			</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={["Circular", "Rectangular"]}
				defaultValue={formData.shape}
				onChange={(selected) => {
					setFormData({...formData, shape: selected});
				}}
			/>
		</div>
	);
}
