"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FormProgressComponent} from "@/components/FormProgressComponent";
import {CustomButton} from "@/components/CustomButton";
import {CustomText} from "@/components/CustomText";
import {FormContentComponent} from "./FormContentComponent";

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
	const [description, setDescription] = useState(getDefaultDescription(itemType));

	function handleNext() {
		setStep(step + 1);
		handleTitleChange(step + 1);
	}

	function handleBack() {
		setStep(step - 1);
		handleTitleChange(step - 1);
	}

	function handleTitleChange(step) {
		setTitle(textObj.titles[step]);
		setDescription(textObj.descriptions[step]);
	}

	function getDefaultDescription(itemType) {
		switch (itemType) {
			case "shirt":
				return "Tell us about the basic information of your shirt order.";
			case "sticker":
				return "Tell us about the basic information of your sticker order.";
			case "custom":
				return "Tell us about the basic information of your custom order.";
			default:
				return "Tell us about the basic information of your order.";
		}
	}

	// Generate the content based on the current step
	const generateContent = () => {
		// If we're at the confirmation step, render the ConfirmationComponent with all required props
		if (step === componentArray.length + 1) {
			return (
				<div className="pt-8 pb-12">
					<FormContentComponent
						styles={styles}
						summaryInfo={summaryInfo}
						components={componentArray}
						formData={formData}
						setFormData={setFormData}
						step={step}
						itemType={itemType}
						onBack={handleBack}
					/>
				</div>
			);
		}

		// For all other steps
		return (
			<div className="pt-8 pb-12">
				<FormContentComponent
					styles={styles}
					summaryInfo={summaryInfo}
					components={componentArray}
					formData={formData}
					setFormData={setFormData}
					step={step}
					itemType={itemType}
				/>

				<div className="flex flex-row justify-end items-center w-full mt-10">
					{step === 0 ? (
						<CustomButton text={"Back"} href={"/"} />
					) : (
						<CustomButton text={"Back"} onClick={handleBack} />
					)}
					<div className="ml-5">
						<CustomButton type={"primary"} text={"Next"} onClick={handleNext} />
					</div>
				</div>
			</div>
		);
	};

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
						>
							{generateContent()}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
