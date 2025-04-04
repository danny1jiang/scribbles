"use client";

import {BasicInfoComponent} from "./BasicInfo";
import {MaterialsComponent} from "./MaterialsComponent";

export function ShirtFormComponent({step}) {
	switch (step) {
		case 0:
			return <BasicInfoComponent styles={styles} />;
		case 1:
			return <MaterialsComponent styles={styles} />;
	}
}

const styles = {
	textBox: "border-(--color-accent) border-solid border-1 resize-none rounded-lg",
	textBoxWide: "w-1/1 h-12",
	textBoxNormal: "w-1/1 h-12",
};
