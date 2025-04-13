"use client";

import {useEffect, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";
import {StickerBasicInfoComponent} from "./components/StickerBasicInfo";
import {StickerTypeComponent} from "./components/StickerTypeComponent";
import {StickerDesignComponent} from "./components/StickerDesignComponent";

const maxSteps = 4;

export default function StickersPage() {
	const [formData, setFormData] = useState({
		quantity: 1,
		size: "Medium",
		material: "Dye Cut",
		design: null,
		specialInstructions: "",
		payment: "",
		email: "",
	});

	const componentArray = [
		<StickerBasicInfoComponent setFormData={setFormData} formData={formData} styles={styles} />,
		<StickerTypeComponent setFormData={setFormData} formData={formData} styles={styles} />,
		<StickerDesignComponent setFormData={setFormData} formData={formData} styles={styles} />,
	];

	const titles = ["General Information", "Sticker Type", "Design", "Payment", "Confirmation"];
	const progressTitles = ["General", "Type", "Design", "Payment", "Confirmation"];
	const descriptions = [
		"Tell us about the basic information of your sticker order.",
		"Choose from the following sticker types.",
		"Upload your design and see how it will look on your sticker.",
		"Describe your desired payment method.",
		"Confirm your order details and submit the order form.",
	];

	return (
		<FormWrapperComponent
			componentArray={componentArray}
			textObj={{
				titles: titles,
				progressTitles: progressTitles,
				descriptions: descriptions,
			}}
			styles={styles}
			itemType={"sticker"}
			formData={formData}
			setFormData={setFormData}
		/>
	);
}

const styles = {
	textBox: "border-(--color-gray) border-solid border-1 resize-none rounded-lg",
	textBoxPadding: "pl-2",
	textBoxWide: "w-1/1 h-12",
	textBoxNormal: "w-1/1 h-12",
};
