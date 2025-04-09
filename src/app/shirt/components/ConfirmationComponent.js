"use client";

import {useState} from "react";
import {CustomText} from "@/components/CustomText";

export function ConfirmationComponent({onNext, onBack, formData}) {
	const [agreed, setAgreed] = useState(false);

	const handleCheckboxChange = () => {
		setAgreed(!agreed);
	};

	const handleSubmit = () => {
		if (agreed) {
			console.log("Order submitted:", formData);
			if (onNext) onNext(formData);
		}
	};

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col w-full">
				<CustomText type={"medium"} className="mb-4">
					Order Summary
				</CustomText>

				<div className="bg-gray-50 p-4 rounded-md mb-6">
					<CustomText type={"small"} className="font-medium mb-2">
						General Information
					</CustomText>
					<div className="mb-4 pl-3">
						<p>
							<span className="font-medium">Name:</span>{" "}
							{formData?.generalInfo?.name || "Not provided"}
						</p>
						<p>
							<span className="font-medium">Email:</span>{" "}
							{formData?.generalInfo?.email || "Not provided"}
						</p>
						<p>
							<span className="font-medium">Phone:</span>{" "}
							{formData?.generalInfo?.phone || "Not provided"}
						</p>
						<p>
							<span className="font-medium">Address:</span>{" "}
							{formData?.generalInfo?.address || "Not provided"}
						</p>
					</div>

					<CustomText type={"small"} className="font-medium mb-2">
						Material Selection
					</CustomText>
					<div className="mb-4 pl-3">
						<p>
							<span className="font-medium">Material:</span>{" "}
							{formData?.material?.materialType || "Not selected"}
						</p>
						<p>
							<span className="font-medium">Color:</span>{" "}
							{formData?.material?.color || "Not selected"}
						</p>
						<p>
							<span className="font-medium">Quantity:</span>{" "}
							{formData?.material?.quantity || "Not specified"}
						</p>
					</div>

					<CustomText type={"small"} className="font-medium mb-2">
						Design Information
					</CustomText>
					<div className="mb-4 pl-3">
						<p>
							<span className="font-medium">Design Type:</span>{" "}
							{formData?.design?.designType || "Not provided"}
						</p>
						{formData?.design?.designImage && (
							<div className="mt-2">
								<p className="font-medium mb-1">Design Preview:</p>
								<div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded">
									<span className="text-xs text-gray-500">Image uploaded</span>
								</div>
							</div>
						)}
					</div>

					<CustomText type={"small"} className="font-medium mb-2">
						Special Instructions
					</CustomText>
					<div className="mb-4 pl-3">
						<p className="whitespace-pre-wrap">
							{formData?.specialInstructions || "No special instructions provided"}
						</p>
					</div>

					<CustomText type={"small"} className="font-medium mb-2">
						Payment Method
					</CustomText>
					<div className="mb-4 pl-3">
						<p className="whitespace-pre-wrap">
							{formData?.paymentMethod || "No payment method specified"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
