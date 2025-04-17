"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FormProgressComponent} from "@/components/FormProgressComponent";
import {CustomButton} from "@/components/CustomButton";
import {CustomText} from "@/components/CustomText";
import {FormContentComponent} from "./FormContentComponent";
import {setSheetData} from "@/utils/spreadsheetHandler";

export function FormWrapperComponent({
	componentArray,
	textObj,
	summaryInfo,
	styles,
	itemType,
	formData,
	setFormData,
}) {
	const [step, setStep] = useState(0);
	const [title, setTitle] = useState("General Information");
	const [description, setDescription] = useState(
		"Tell us about the basic information of your shirt order."
	);
	const [formErrors, setFormErrors] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (step === componentArray.length + 1) {
			validateForm(formData, setFormErrors);
		}
	}, [step]);

	function handleNext() {
		setStep(step + 1);
		handleTitleChange(step + 1);
	}

	function handleSubmit() {
		setIsSubmitting(true);

		if (validateForm(formData, setFormErrors)) {
			// Form is valid, process the submission
			console.log("Form submitted successfully:", formData);
			// Here you would typically send the data to your backend
			alert("Your order has been submitted successfully!");
			setSheetData(formData, itemType);
			// Optionally reset the form or redirect
		} else {
			// Form has errors
			setIsSubmitting(false);
			// Focus back to the confirmation step to show errors
		}
	}

	function handleTitleChange(step) {
		setTitle(textObj.titles[step]);
		setDescription(textObj.descriptions[step]);
	}

	return (
		<div className="flex flex-col relative items-center justify-start h-screen">
			<div className="w-full mb-[1.5%] mt-[1.5%]">
				<FormProgressComponent
					onClick={(index) => {
						setStep(index);
						handleTitleChange(index);
					}}
					steps={textObj.progressTitles}
					currentStep={step} // Pass the current step index (0-based)
				/>
			</div>
			<div className="w-full h-1 bg-(--color-light-gray)" />
			<div className="flex flex-col w-full h-full pt-[2%] pb-[2%] items-center overflow-auto">
				<div className="flex flex-col items-start justify-center w-7/10 md:w-130">
					<motion.div
						className="w-full"
						key={step}
						transition={{duration: 0.5, type: "tween", delay: 0, ease: "easeOut"}}
						animate={{y: 0, opacity: 1}}
						initial={{y: 15, opacity: 0.5}}
					>
						<div className="mt-2">
							<CustomText type={"header"}>{title}</CustomText>
							<CustomText type={"medium"}>{description}</CustomText>
						</div>
						<motion.div
							transition={{duration: 0.5, type: "tween", delay: 0.1, ease: "easeOut"}}
							animate={{y: 0, opacity: 1}}
							initial={{y: 5, opacity: 0.5}}
							className="pt-8 pb-12"
						>
							<FormContentComponent
								styles={styles}
								summaryInfo={summaryInfo}
								components={componentArray}
								formData={formData}
								setFormData={setFormData}
								step={step}
							/>
						</motion.div>
					</motion.div>
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
						{step === componentArray.length + 1 ? (
							<div className="ml-5">
								<CustomButton
									type={formErrors.length === 0 ? "primary" : "disabled"}
									text={isSubmitting ? "Submitting..." : "Submit"}
									onClick={handleSubmit}
									disabled={isSubmitting}
								/>
							</div>
						) : (
							<div className="ml-5">
								<CustomButton type={"primary"} text={"Next"} onClick={handleNext} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function validateForm(formData, setFormErrors) {
	return true;
	const errors = [];

	if (!formData.quantity || formData.quantity < 1) {
		errors.push("Please specify a valid quantity");
	}

	if (!formData.size) {
		errors.push("Please select a size");
	}

	if (!formData.material) {
		errors.push("Please select a material");
	}

	if (
		!formData.email ||
		!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
	) {
		errors.push("Please provide a valid email address");
	}

	if (!formData.payment || formData.payment.trim() === "") {
		errors.push("Please provide payment details");
	}

	setFormErrors(errors);
	return errors.length === 0;
}
