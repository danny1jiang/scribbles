"use client";

import {useEffect, useState} from "react";
import {ConfirmationComponent} from "../ConfirmationComponent";
import {PaymentDetailsComponent} from "../PaymentDetailsComponent";

export function FormContentComponent({
	styles,
	summaryInfo,
	formData,
	setFormData,
	step,
	components,
}) {
	for (let i = 0; i < components.length; i++) {
		if (step === i) {
			return components[i];
		}
	}
	if (step === components.length) {
		return (
			<PaymentDetailsComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>
		);
	}
	if (step === components.length + 1) {
		return (
			<ConfirmationComponent
				summaryInfo={summaryInfo}
				setFormData={setFormData}
				formData={formData}
			/>
		);
	}
	return;
}
