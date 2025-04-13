"use client";

import {useState, useEffect, useMemo} from "react";
import {CustomText} from "@/components/CustomText";

export function ConfirmationComponent({summaryInfo, formData, setFormData}) {
	const [designPreviewUrl, setDesignPreviewUrl] = useState(null);
	const [instructions, setInstructions] = useState(formData?.specialInstructions || "");
	const [charCount, setCharCount] = useState(formData?.specialInstructions?.length || 0);
	const maxChars = 500;

	// Dynamically build the isMissing object based on summaryInfo
	const isMissing = useMemo(() => {
		const result = {email: !formData?.email}; // Always include email as it's not always in summaryInfo

		// Extract all fields from summaryInfo and check if they're missing
		summaryInfo.forEach((section) => {
			section.fields.forEach((field) => {
				const fieldName = field.toLowerCase();
				if (fieldName === "payment") {
					result[fieldName] = !formData?.[fieldName] || formData[fieldName].trim() === "";
				} else if (fieldName === "design") {
					result[fieldName] = !formData?.[fieldName];
				} else {
					result[fieldName] = !formData?.[fieldName];
				}
			});
		});

		return result;
	}, [formData, summaryInfo]);

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

	// Helper function to format field name for display
	const formatFieldName = (field) => {
		return field.charAt(0).toUpperCase() + field.slice(1) + ":";
	};

	// Helper function to get field value with proper formatting
	const getFieldValue = (field) => {
		const fieldName = field.toLowerCase();
		const value = formData?.[fieldName];

		if (fieldName === "design" && value) {
			return value.name;
		}

		return value || <span>Not provided</span>;
	};

	// Check if any field in a section is missing
	const isSectionMissing = (fields) => {
		return fields.some((field) => isMissing[field.toLowerCase()]);
	};

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col w-full">
				<div className="flex flex-col mb-6 rounded-lg gap-10">
					{summaryInfo.map((section, sectionIndex) => (
						<div key={sectionIndex}>
							<div className="flex items-center">
								<CustomText type={"medium"} className="text-lg">
									{section.header}
								</CustomText>
								{isSectionMissing(section.fields)}
							</div>
							<div className="border-(--color-light-gray) border-1 mb-2" />
							<div className="flex flex-row justify-between items-start">
								{/* Labels column */}
								<div className="flex flex-1 flex-col">
									{section.fields.map((field, fieldIndex) => (
										<div key={fieldIndex} className="flex items-center">
											<CustomText>{formatFieldName(field)}</CustomText>
											{section.required[fieldIndex] && <RequiredIndicator />}
										</div>
									))}
								</div>
								{/* Values column - fixed the text wrapping */}
								<div className="flex flex-1 flex-col">
									{section.fields.map((field, fieldIndex) => (
										<div
											key={fieldIndex}
											className="whitespace-pre-wrap wrap-break-word pr-2 max-w-full"
											style={{
												overflowWrap: "break-word",
												hyphens: "auto",
											}}
										>
											<CustomText>{getFieldValue(field)}</CustomText>
										</div>
									))}
								</div>
							</div>
							{section.header.includes("Design") && designPreviewUrl && (
								<div className="mt-2 flex justify-center">
									<img
										src={designPreviewUrl}
										alt="Design Preview"
										className="max-h-32 object-contain"
									/>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Special Instructions Section - Always at the end */}
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
