"use client";

import {BasicInfoComponent} from "./BasicInfo";
import {ConfirmationComponent} from "./ConfirmationComponent";
import {DesignComponent} from "./DesignComponent";
import {MaterialsComponent} from "./MaterialsComponent";
import {PaymentDetailsComponent} from "./PaymentDetailsComponent";
import {SpecialInstructionsComponent} from "./SpecialInstructionsComponent";

export function ShirtFormComponent({step}) {
	switch (step) {
		case 0:
			return <BasicInfoComponent styles={styles} />;
		case 1:
			return <MaterialsComponent styles={styles} />;
		case 2:
			return <DesignComponent styles={styles} />;
		case 3:
			return <SpecialInstructionsComponent />;
		case 4:
			return <PaymentDetailsComponent />;
		case 5:
			return <ConfirmationComponent />;
	}
}

const styles = {
	textBox: "border-(--color-gray) border-solid border-1 resize-none rounded-lg",
	textBoxWide: "w-1/1 h-12",
	textBoxNormal: "w-1/1 h-12",
};
