"use client";

import {useEffect, useLayoutEffect, useState} from "react";
import {motion} from "framer-motion";
import {FormProgressComponent} from "@/components/FormProgressComponent";
import {CustomButton} from "@/components/CustomButton";
import {CustomText} from "@/components/CustomText";
import {FormContentComponent} from "./FormContentComponent";
import {ShirtBasicInfoComponent} from "@/app/shirt/components/ShirtBasicInfo";
import {ShirtMaterialsComponent} from "@/app/shirt/components/ShirtMaterialsComponent";
import {ShirtDesignComponent} from "@/app/shirt/components/ShirtDesignComponent";
import {StickerBasicInfoComponent} from "@/app/stickers/components/StickerBasicInfo";
import {StickerMaterialsComponent} from "@/app/stickers/components/StickerMaterialsComponent";
import {StickerDesignComponent} from "@/app/stickers/components/StickerDesignComponent";

const maxSteps = 4;
export function FormWrapperComponent({itemType, formData, setFormData}) {
	const [step, setStep] = useState(0);
	const [title, setTitle] = useState("General Information");
	const [description, setDescription] = useState(
		"Tell us about the basic information of your shirt order."
	);
	const [formErrors, setFormErrors] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [componentArray, setComponentArray] = useState([]);

	useEffect(() => {
		if (step === maxSteps) {
			validateForm(formData, setFormErrors);
		}
	}, [step]);

	useLayoutEffect(() => {
		const shirtComponents = [
			<ShirtBasicInfoComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>,
			<ShirtMaterialsComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>,
			<ShirtDesignComponent setFormData={setFormData} formData={formData} styles={styles} />,
		];

		const stickerComponents = [
			<StickerBasicInfoComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>,
			<StickerMaterialsComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>,
			<StickerDesignComponent
				setFormData={setFormData}
				formData={formData}
				styles={styles}
			/>,
		];

		if (itemType === "shirt") {
			setComponentArray(shirtComponents);
		} else if (itemType === "sticker") {
			setComponentArray(stickerComponents);
		}
	}, []);

	function handleNext() {
		setStep(step + 1);
		handleTitleChange(step + 1, setTitle, setDescription);
	}

	function handleSubmit() {
		setIsSubmitting(true);

		if (validateForm(formData, setFormErrors)) {
			// Form is valid, process the submission
			console.log("Form submitted successfully:", formData);
			// Here you would typically send the data to your backend
			alert("Your order has been submitted successfully!");
			// Optionally reset the form or redirect
		} else {
			// Form has errors
			setIsSubmitting(false);
			// Focus back to the confirmation step to show errors
		}
	}

	return (
		<div className="flex flex-col relative items-center justify-start h-screen">
			<div className="w-full mb-[1.5%] mt-[1.5%]">
				<FormProgressComponent
					onClick={(index) => {
						setStep(index);
						handleTitleChange(index, setTitle, setDescription);
					}}
					steps={["General", "Materials", "Design", "Payment", "Confirmation"]}
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
									handleTitleChange(step - 1, setTitle, setDescription);
								}}
							/>
						)}
						{step === maxSteps ? (
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

function handleTitleChange(step, setTitle, setDescription) {
	switch (step) {
		case 0:
			setTitle("General Information");
			setDescription("Tell us about the basic information of your shirt order.");
			break;
		case 1:
			setTitle("Material");
			setDescription("Choose from the following materials for your shirt.");
			break;
		case 2:
			setTitle("Design");
			setDescription("Upload your design and see how it will look on your shirt.");
			break;
		case 3:
			setTitle("Payment");
			setDescription("Describe your desired payment method.");
			break;
		case 4:
			setTitle("Confirmation");
			setDescription("Confirm your order details and submit the order form.");
			break;
		default:
			setTitle("General Information");
	}
}

function validateForm(formData, setFormErrors) {
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

	if (!formData.design) {
		errors.push("Please upload a design file");
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

const styles = {
	textBox: "border-(--color-gray) border-solid border-1 resize-none rounded-lg",
	textBoxPadding: "pl-2",
	textBoxWide: "w-1/1 h-12",
	textBoxNormal: "w-1/1 h-12",
};
