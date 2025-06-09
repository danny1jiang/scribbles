"use client";

import {useEffect, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";
import {StickerBasicInfoComponent} from "./components/StickerBasicInfo";
import {StickerTypeComponent} from "./components/StickerTypeComponent";
import {StickerDesignComponent} from "./components/StickerDesignComponent";

export default function StickersPage() {
	const [formData, setFormData] = useState({
		quantity: 1,
		dimensions: "1.5″ x 1.5″",
		requestedDeliveryDate: new Date(),
		type: "Die Cut",
		shape: "Circular",
		design: null,
		specialInstructions: "",
		payment: "",
		email: "",
	});

	const componentArray = [
		<StickerBasicInfoComponent
			key={0}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
		<StickerTypeComponent
			key={1}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
		<StickerDesignComponent
			key={2}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
	];

	const titles = ["General Information", "Sticker Type", "Design", "Payment", "Confirmation"];
	const progressTitles = ["General", "Type", "Design", "Payment", "Confirmation"];
	const descriptions = [
		"Tell us about the basic information of your sticker order.",
		"Choose from the following sticker types.",
		"Upload a design for your sticker.",
		"Describe your desired payment method.",
		"Confirm your order details and submit the order form.",
	];
	const summaryInfo = [
		{
			header: "General Information",
			fields: ["Quantity", "Dimensions", "Requested Delivery Date"],
			required: [true, true, true],
		},
		{header: "Sticker Type", fields: ["Type", "Shape"], required: [true, true]},
		{header: "Design", fields: ["Design"], required: [false]},
		{header: "Payment", fields: ["Email", "Payment"], required: [true, true]},
	];

	return (
		<FormWrapperComponent
			componentArray={componentArray}
			textObj={{
				titles: titles,
				progressTitles: progressTitles,
				descriptions: descriptions,
			}}
			summaryInfo={summaryInfo}
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
