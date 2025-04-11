"use client";

import {CustomButton} from "@/components/CustomButton";
import {CustomText} from "@/components/CustomText";
import Link from "next/link";
import {BasicInfoComponent} from "./components/BasicInfo";
import {useEffect, useState} from "react";
import {ShirtFormComponent} from "./components/ShirtFormComponent";
import {motion} from "framer-motion";
import {ProgressBar} from "@/components/ProgressBar";
import {FormProgressComponent} from "@/components/FormProgressComponent";

const maxSteps = 5;

export default function ShirtPage() {
	const [step, setStep] = useState(0);
	const [title, setTitle] = useState("General Information");
	const [description, setDescription] = useState(
		"Tell us about the basic information of your shirt order."
	);

	const [formData, setFormData] = useState({
		quantity: 1,
		size: "Medium",
		material: "Cotton",
		design: null,
		specialInstructions: "",
		payment: "",
	});

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
				setDescription("Choose from the following materials for your shirt.");
				break;
			case 2:
				setTitle("Design");
				setDescription("Upload your design and see how it will look on your shirt.");
				break;
			case 3:
				setTitle("Special Instructions");
				setDescription("Add any special instructions or notes for your order.");
				break;
			case 4:
				setTitle("Payment");
				setDescription("Describe your desired payment method.");
				break;
			case 5:
				setTitle("Confirmation");
				setDescription("Confirm your order details and submit the order form.");
				break;
			default:
				setTitle("General Information");
		}
	}

	return (
		<div className="flex flex-col relative items-center justify-start h-screen">
			<div className="w-full mb-[1.5%] mt-[1.5%]">
				<FormProgressComponent
					onClick={(index) => {
						setStep(index);
						handleTitleChange(index);
					}}
					steps={[
						"General",
						"Materials",
						"Design",
						"Instructions",
						"Payment",
						"Confirmation",
					]}
					currentStep={step} // Pass the current step index (0-based)
				/>
			</div>
			{/*<div className="w-full mb-[2%] flex flex-col justify-end">
				<ProgressBar progress={step / maxSteps} />
			</div>*/}
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
							<ShirtFormComponent
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
						{step === maxSteps ? (
							<div className="ml-5">
								<CustomButton type={"primary"} text={"Submit"} onClick={() => {}} />
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
