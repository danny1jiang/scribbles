"use client";

import {useEffect, useState} from "react";
import {BasicInfoComponent} from "./BasicInfo";
import {ConfirmationComponent} from "./ConfirmationComponent";
import {DesignComponent} from "./DesignComponent";
import {MaterialsComponent} from "./MaterialsComponent";
import {PaymentDetailsComponent} from "./PaymentDetailsComponent";
import {SpecialInstructionsComponent} from "./SpecialInstructionsComponent";

export function ShirtFormComponent({formData, setFormData, step}) {
	switch (step) {
		case 0:
			return (
				<BasicInfoComponent setFormData={setFormData} formData={formData} styles={styles} />
			);
		case 1:
			return (
				<MaterialsComponent setFormData={setFormData} formData={formData} styles={styles} />
			);
		case 2:
			return (
				<DesignComponent setFormData={setFormData} formData={formData} styles={styles} />
			);
		case 3:
			return <SpecialInstructionsComponent setFormData={setFormData} formData={formData} />;
		case 4:
			return <PaymentDetailsComponent setFormData={setFormData} formData={formData} />;
		case 5:
			return <ConfirmationComponent setFormData={setFormData} formData={formData} />;
	}
}

const styles = {
	textBox: "border-(--color-gray) border-solid border-1 resize-none rounded-lg",
	textBoxPadding: "pl-2",
	textBoxWide: "w-1/1 h-12",
	textBoxNormal: "w-1/1 h-12",
};
