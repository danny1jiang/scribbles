"use client";

import {CustomButton} from "@/components/CustomButton";
import {CustomText} from "@/components/CustomText";
import Link from "next/link";
import {BasicInfoComponent} from "./components/BasicInfo";
import {useEffect, useState} from "react";
import {ShirtFormComponent} from "./components/ShirtFormComponent";

const maxSteps = 4;

export default function ShirtPage() {
	const [step, setStep] = useState(0);
	const [title, setTitle] = useState("General Information");
	const [description, setDescription] = useState(
		"Tell us about the basic information of your shirt order."
	);

	function handleNext() {
		setStep(step + 1);
		handleTitleChange(step + 1);
	}

	function handleTitleChange(step) {
		switch (step) {
			case 0:
				setTitle("General Information");
				setDescription("Tell us about the basic information of your shirt order.");
				break;
			case 1:
				setTitle("Material");
				setDescription("Please choose from the following materials for your shirt.");
				break;
			case 2:
				setTitle("Shipping");
				break;
			case 3:
				setTitle("Payment");
				break;
			default:
				setTitle("General Information");
		}
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="flex flex-col items-start justify-center w-7/10 md:w-130">
				<CustomText className={"text-(--color-primary)"} type={"medium"}>
					Step {step + 1} of {maxSteps}
				</CustomText>
				<div className="mt-2">
					<CustomText type={"header"}>{title}</CustomText>
					<CustomText type={"medium"}>{description}</CustomText>
				</div>
				<ShirtFormComponent step={step} />
				<div className="flex flex-row justify-end items-center w-full">
					{step === 0 ? (
						<CustomButton text={"Back"} href={"/"} />
					) : (
						<CustomButton
							text={"Back"}
							onClick={() => {
								setStep(step - 1);
								handleTitleChange(step - 1);
							}}
						/>
					)}
					<div className="ml-5">
						<CustomButton type={"primary"} text={"Next"} onClick={handleNext} />
					</div>
				</div>
			</div>
		</div>
	);
}
