"use client";

import {useEffect, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";
import {ShirtBasicInfoComponent} from "./components/ShirtBasicInfo";
import {ShirtMaterialsComponent} from "./components/ShirtMaterialsComponent";
import {ShirtDesignComponent} from "./components/ShirtDesignComponent";

export default function ShirtPage() {
	const [formData, setFormData] = useState({
		quantity: 1,
		size: "Medium",
		material: "Cotton",
		design: null,
		side: "Front",
		color: "White",
		specialInstructions: "",
		payment: "",
		email: "",
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
		{header: "General Information", fields: ["Quantity", "Size"], required: [true, true]},
		{header: "Material", fields: ["Material"], required: [true]},
		{header: "Design", fields: ["Design", "Side", "Color"], required: [false, false, false]},
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
