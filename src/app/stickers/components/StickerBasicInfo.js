"use client";

import {CustomText} from "@/components/CustomText";
import {SelectComponent} from "@/components/SelectComponent";
import {useState} from "react";

const presetDimensions = ["1.5″ x 1.5″", "2″ x 2″", "3″ x 3″"];

export function StickerBasicInfoComponent({setFormData, formData, styles}) {
	const [custom, setCustom] = useState(areCustomDimensions(formData.dimensions));

	function areCustomDimensions(dimensions) {
		if (dimensions === null) {
			return true;
		}
		if (presetDimensions.includes(dimensions)) {
			return false;
		}
		return true;
	}

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
				Dimensions
			</CustomText>
			<SelectComponent
				className={styles.textBox + " " + styles.textBoxNormal}
				options={[...presetDimensions, "Custom"]}
				defaultValue={
					areCustomDimensions(formData.dimensions) ? "Custom" : formData.dimensions
				}
				onChange={(selected) => {
					if (selected === "Custom") {
						setCustom(true);
						setFormData({...formData, dimensions: null});
					} else {
						setCustom(false);
						setFormData({...formData, dimensions: selected});
					}
				}}
			/>
			{custom ? (
				<div className="flex flex-col items-start justify-center w-full">
					<CustomText className={"mt-5"} type={"medium"}>
						Custom Dimensions (Width″ x Height″)
					</CustomText>
					<input
						className={
							styles.textBox +
							" " +
							styles.textBoxNormal +
							" " +
							styles.textBoxPadding
						}
						defaultValue={formData.dimensions}
						placeholder="Ex: 3.5 x 2"
						onChange={(e) => {
							setFormData({...formData, dimensions: e.target.value});
						}}
					/>
				</div>
			) : null}
		</div>
	);
}
