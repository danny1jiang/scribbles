"use client";

import {useEffect, useRef, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";
import {ShirtBasicInfoComponent} from "./components/ShirtBasicInfo";
import {ShirtMaterialsComponent} from "./components/ShirtMaterialsComponent";
import {ShirtDesignComponent} from "./components/ShirtDesignComponent";

export default function ShirtPage() {
	const [formData, setFormData] = useState({
		sizes: {
			"Youth Small": 0,
			"Youth Medium": 0,
			"Youth Large": 0,
			"Adult Small": 0,
			"Adult Medium": 0,
			"Adult Large": 0,
			"Adult 2XL": 0,
			"Adult 3XL": 0,
		},
		requestedDeliveryDate: new Date(),
		material: "Cotton",
		front: null,
		frontPreview: null,
		back: null,
		backPreview: null,
		sleeve: "Short Sleeve",
		color: "White",
		specialInstructions: "",
		payment: "",
		email: "",
	});

	const metadata = useRef({
		frontScale: 1,
		frontPosition: {x: 0, y: 0},
		frontRotation: 0,
		frontBoundingBox: null,
		backScale: 1,
		backPosition: {x: 0, y: 0},
		backRotation: 0,
		backBoundingBox: null,
	});

	const componentArray = [
		<ShirtBasicInfoComponent
			key={0}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
		<ShirtMaterialsComponent
			key={1}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
		<ShirtDesignComponent
			key={2}
			metadata={metadata}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
	];

	const titles = ["General Information", "Material", "Design", "Payment", "Confirmation"];
	const progressTitles = ["General", "Materials", "Design", "Payment", "Confirmation"];
	const descriptions = [
		"Tell us about the basic information of your shirt order.",
		"Choose from the following materials for your shirt.",
		"Upload your design and see how it will look on your shirt.",
		"Describe your desired payment method.",
		"Confirm your order details and submit the order form.",
	];
	const summaryInfo = [
		{
			header: "General Information",
			fields: ["Sizes", "Requested Delivery Date"],
			required: [true, true],
		},
		{header: "Material", fields: ["Material"], required: [true]},
		{
			header: "Design",
			fields: ["Front", "Back", "Sleeve", "Color"],
			required: [false, false, true, true],
		},
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
			itemType={"shirt"}
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
