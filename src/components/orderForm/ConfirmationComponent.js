"use client";

import {useState, useEffect, useMemo} from "react";
import {CustomText} from "@/components/CustomText";
import {CustomButton} from "@/components/CustomButton";
import {setSheetData} from "@/utils/spreadsheetHandler";
import {useRouter} from "next/navigation";

export function ConfirmationComponent({summaryInfo, formData, setFormData, itemType, onBack}) {
	const [instructions, setInstructions] = useState(formData?.specialInstructions || "");
	const [charCount, setCharCount] = useState(formData?.specialInstructions?.length || 0);
	const maxChars = 500;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formErrors, setFormErrors] = useState([]);
	const [showErrorBanner, setShowErrorBanner] = useState(false);
	const [submissionSuccess, setSubmissionSuccess] = useState(false);
	const router = useRouter();

	// Email validation function
	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Dynamically build the isMissing object based on summaryInfo
	const isMissing = useMemo(() => {
		const result = {email: !formData?.email || !validateEmail(formData?.email)}; // Always include email validation

		// Extract all fields from summaryInfo and check if they're missing
		summaryInfo.forEach((section) => {
			section.fields.forEach((field, index) => {
				const fieldName = field.toLowerCase();
				const isRequired = section.required[index];

				if (!isRequired) {
					result[fieldName] = false; // Not required, so not missing
				} else if (fieldName === "payment") {
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

	// Check if form is valid
	const isFormValid = useMemo(() => {
		return !Object.values(isMissing).some((value) => value === true);
	}, [isMissing]);

	// Validate form and set errors
	useEffect(() => {
		const errors = [];

		// Check email specifically
		if (formData?.email && !validateEmail(formData.email)) {
			errors.push("Please enter a valid email address");
		}

		// Add generic error for required fields
		if (!isFormValid) {
			errors.push("Please fill in all required fields (*)");
		}

		setFormErrors(errors);

		// Show error banner if there are errors and the user has tried to submit
		if (errors.length > 0) {
			setShowErrorBanner(true);
		}
	}, [formData, isFormValid]);

	const handleInstructionsChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setInstructions(text);
			setFormData({...formData, specialInstructions: text});
			setCharCount(text.length);
		}
	};

	// Form submission handler
	const handleSubmit = async () => {
		if (!isFormValid) {
			setShowErrorBanner(true);
			return;
		}

		setIsSubmitting(true);

		try {
			// Clone form data to avoid modifying the original
			const submissionData = {...formData};

			// Submit the data
			await setSheetData(submissionData, itemType);

			// Handle success
			setSubmissionSuccess(true);
			setShowErrorBanner(false);

			// Show success alert
			//alert("You have successfully submitted your order form!");
			setTimeout(() => {
				router.back();
			}, 1000);
		} catch (error) {
			console.error("Error submitting form:", error);
			setFormErrors([
				...formErrors,
				"There was an error submitting your order. Please try again.",
			]);
			setShowErrorBanner(true);
		} finally {
			setIsSubmitting(false);
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
		const isMissingField = isMissing[fieldName];

		if (fieldName === "design" && value) {
			return value.name;
		}

		// Special handling for displaying color with visual indicator
		if (fieldName === "color" && value) {
			// Color hex values mapping for visual indicators
			const colorHexMap = {
				White: "#FFFFFF",
				Black: "#000000",
				Navy: "#000080",
				Red: "#FF0000",
				Green: "#008000",
				Gray: "#808080",
				Blue: "#0000FF",
				Yellow: "#FFFF00",
			};

			return (
				<div className="flex items-center">
					<div
						className={`w-4 h-4 rounded-full mr-2 ${
							value === "White" ? "border border-gray-300" : ""
						}`}
						style={{backgroundColor: colorHexMap[value] || "#FFFFFF"}}
					></div>
					<CustomText>{value}</CustomText>
				</div>
			);
		}

		if (value) {
			return <CustomText>{value}</CustomText>;
		} else {
			return <CustomText className="text-[#CC0033]">Not Provided</CustomText>;
		}
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
											{getFieldValue(field)}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>

				{showErrorBanner && formErrors.length > 0 && (
					<div className="bg-[#FFEEEE] border border-[#CC0033] p-4 rounded-lg mb-8">
						{formErrors.map((error, index) => (
							<CustomText key={index} type="medium" className="text-[#CC0033]">
								{error}
							</CustomText>
						))}
					</div>
				)}

				{submissionSuccess && (
					<div className="bg-[#EEFFEE] border border-[#00CC33] p-4 rounded-lg mb-8">
						<CustomText type="medium" className="text-[#00CC33]">
							Your order has been submitted successfully!
						</CustomText>
					</div>
				)}

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

				{/* Form Buttons */}
				<div className="flex flex-row justify-end items-center w-full mt-6">
					<CustomButton text={"Back"} onClick={onBack} />
					<div className="ml-5">
						<CustomButton
							type={isFormValid ? "primary" : "disabled"}
							text={isSubmitting ? "Submitting..." : "Submit"}
							onClick={handleSubmit}
							disabled={isSubmitting || !isFormValid}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
