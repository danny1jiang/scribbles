"use client";

import {useEffect, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";
import {CustomBasicInfoComponent} from "./components/CustomBasicInfo";
import {CustomDesignComponent} from "./components/CustomDesignComponent";

export default function ShirtPage() {
	const [formData, setFormData] = useState({
		quantity: 1,
		requestedDeliveryDate: new Date(),
		description: "",
		design: null,
		specialInstructions: "",
		payment: "",
		email: "",
	});

	const componentArray = [
		<CustomBasicInfoComponent
			key={0}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
		<CustomDesignComponent
			key={1}
			setFormData={setFormData}
			formData={formData}
			styles={styles}
		/>,
	];

	const titles = ["General Information", "Design", "Payment", "Confirmation"];
	const progressTitles = ["General", "Design", "Payment", "Confirmation"];
	const descriptions = [
		"Tell us about the basic information of your custom order.",
		"Upload a design for your custom order.",
		"Describe your desired payment method.",
		"Confirm your order details and submit the order form.",
	];
	const summaryInfo = [
		{
			header: "General Information",
			fields: ["Quantity", "Requested Delivery Date", "Description"],
			required: [true, true, true],
		},
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
			itemType={"custom"}
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
