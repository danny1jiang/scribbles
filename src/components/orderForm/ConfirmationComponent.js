"use client";

import {useState, useEffect} from "react";
import {CustomText} from "@/components/CustomText";

export function ConfirmationComponent({formData, setFormData}) {
	const [designPreviewUrl, setDesignPreviewUrl] = useState(null);
	const [instructions, setInstructions] = useState(formData?.specialInstructions || "");
	const [charCount, setCharCount] = useState(formData?.specialInstructions?.length || 0);
	const maxChars = 500;

	// Check which required fields are missing
	const isMissing = {
		quantity: !formData?.quantity,
		size: !formData?.size,
		material: !formData?.material,
		design: !formData?.design,
		email: !formData?.email,
		payment: !formData?.payment || formData.payment.trim() === "",
	};

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

	// Helper function for required field indicators
	const RequiredIndicator = () => <span className="text-[#CC0033] ml-1 font-bold">*</span>;

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col w-full">
				<div className="flex flex-col mb-6 rounded-lg gap-10">
					<div>
						<div className="flex items-center">
							<CustomText type={"medium"} className="text-lg">
								General Information
							</CustomText>
							{(isMissing.quantity || isMissing.size) && <RequiredIndicator />}
						</div>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<div className="flex items-center">
									<CustomText
										className={isMissing.quantity ? "text-[#CC0033]" : ""}
									>
										Quantity:
									</CustomText>
									{isMissing.quantity && <RequiredIndicator />}
								</div>
								<div className="flex items-center">
									<CustomText className={isMissing.size ? "text-[#CC0033]" : ""}>
										Size:
									</CustomText>
									{isMissing.size && <RequiredIndicator />}
								</div>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>
									{formData?.quantity || (
										<span className="text-[#CC0033]">Not provided</span>
									)}
								</CustomText>
								<CustomText>
									{formData?.size || (
										<span className="text-[#CC0033]">Not provided</span>
									)}
								</CustomText>
							</div>
						</div>
					</div>

					{/* Materials Section */}
					<div>
						<div className="flex items-center">
							<CustomText type={"medium"} className="text-lg">
								Materials
							</CustomText>
							{isMissing.material && <RequiredIndicator />}
						</div>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<div className="flex items-center">
									<CustomText
										className={isMissing.material ? "text-[#CC0033]" : ""}
									>
										Material:
									</CustomText>
									{isMissing.material && <RequiredIndicator />}
								</div>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>
									{formData?.material || (
										<span className="text-[#CC0033]">Not provided</span>
									)}
								</CustomText>
							</div>
						</div>
					</div>

					{/* Design Section */}
					<div>
						<div className="flex items-center">
							<CustomText type={"medium"} className="text-lg">
								Design
							</CustomText>
							{isMissing.design && <RequiredIndicator />}
						</div>
						<div className="border-(--color-light-gray) border-1 mb-2" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<div className="flex items-center">
									<CustomText
										className={isMissing.design ? "text-[#CC0033]" : ""}
									>
										Design File:
									</CustomText>
									{isMissing.design && <RequiredIndicator />}
								</div>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>
									{formData?.design ? (
										formData.design.name
									) : (
										<span className="text-[#CC0033]">No design uploaded</span>
									)}
								</CustomText>
							</div>
						</div>
						{designPreviewUrl && (
							<div className="mt-2 flex justify-center">
								<img
									src={designPreviewUrl}
									alt="Design Preview"
									className="max-h-32 object-contain"
								/>
							</div>
						)}
					</div>

					{/* Payment Details Section */}
					<div>
						<div className="flex items-center">
							<CustomText type={"medium"} className="text-lg">
								Payment Details
							</CustomText>
							{(isMissing.email || isMissing.payment) && <RequiredIndicator />}
						</div>
						<div className="border-(--color-light-gray) border-1" />
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-1 flex-col">
								<div className="flex items-center">
									<CustomText className={isMissing.email ? "text-[#CC0033]" : ""}>
										Email:
									</CustomText>
									{isMissing.email && <RequiredIndicator />}
								</div>
							</div>
							<div className="flex flex-1 flex-col">
								<CustomText>
									{formData?.email || (
										<span className="text-[#CC0033]">Not provided</span>
									)}
								</CustomText>
							</div>
						</div>
						<div className="mt-2">
							<div className="break-words overflow-hidden">
								<div className="flex items-center mb-1">
									<CustomText
										className={isMissing.payment ? "text-[#CC0033]" : ""}
									>
										Payment Details:
									</CustomText>
									{isMissing.payment && <RequiredIndicator />}
								</div>
								<CustomText>
									{formData?.payment ? (
										formData.payment
									) : (
										<span className="text-[#CC0033]">
											No payment details provided
										</span>
									)}
								</CustomText>
							</div>
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
