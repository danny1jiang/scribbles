"use client";

import {useState, useEffect} from "react";
import {CustomText} from "@/components/CustomText";

export function ConfirmationComponent({formData, setFormData}) {
	const [designPreviewUrl, setDesignPreviewUrl] = useState(null);
	const [instructions, setInstructions] = useState(formData.specialInstructions);
	const [charCount, setCharCount] = useState(0);
	const maxChars = 500;

	useEffect(() => {
		// Create URL for design preview if design exists
		if (formData?.design) {
			const url = URL.createObjectURL(formData.design);
			setDesignPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
	}, [formData?.design]);

	const handleInstructionsChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setInstructions(text);
			setFormData({...formData, specialInstructions: text});
			setCharCount(text.length);
		}
	};

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col w-full">
				<div className="flex flex-col mb-6 rounded-lg gap-10">
					<div>
						<CustomText type={"header"} className="text-lg">
							General Information
						</CustomText>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<CustomText>Quantity:</CustomText>
								<CustomText>Size:</CustomText>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>{formData?.quantity || "Not provided"}</CustomText>
								<CustomText>{formData?.size || "Not provided"}</CustomText>
							</div>
						</div>
					</div>

					{/* Materials Section */}
					<div>
						<CustomText type={"header"} className="text-lg">
							Materials
						</CustomText>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<CustomText>Material:</CustomText>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>{formData?.material || "Not provided"}</CustomText>
							</div>
						</div>
					</div>

					{/* Design Section */}
					<div>
						<CustomText type={"header"} className="text-lg">
							Design
						</CustomText>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<CustomText>Design File:</CustomText>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>
									{formData?.design ? formData.design.name : "No design uploaded"}
								</CustomText>
							</div>
						</div>
					</div>

					{/* Payment Details Section */}
					<div>
						<CustomText type={"header"} className="text-lg">
							Payment Details
						</CustomText>
						<div className="border-(--color-light-gray) border-1" />
						<div className="mt-2">
							<CustomText>
								{formData?.payment
									? formData.payment
									: "No payment details provided"}
							</CustomText>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full">
					<CustomText type={"medium"} className="mb-2">
						Special Instructions
					</CustomText>

					<div className="w-full">
						<textarea
							value={instructions}
							onChange={handleInstructionsChange}
							placeholder="Add any special instructions or requests for your order here..."
							className="w-full h-40 p-2 border border-(--color-gray) rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-primary] resize-none"
						/>

						<div className="flex justify-end mt-2">
							<CustomText type={"small"} className="text-(--color-accent)">
								{charCount}/{maxChars} characters
							</CustomText>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
