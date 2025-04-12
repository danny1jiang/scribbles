"use client";

import {useEffect, useState} from "react";
import {FormWrapperComponent} from "../../components/orderForm/shared/FormWrapperComponent";

const maxSteps = 4;

export default function StickersPage() {
	const [formData, setFormData] = useState({
		quantity: 1,
		size: "Medium",
		material: "Cotton",
		design: null,
		specialInstructions: "",
		payment: "",
		email: "",
	});

	return (
		<FormWrapperComponent itemType={"sticker"} formData={formData} setFormData={setFormData} />
	);
}
