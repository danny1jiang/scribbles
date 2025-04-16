"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import {useState, useEffect, useMemo, useCallback, memo} from "react";

// Memoize the component to prevent unnecessary re-renders
export const ShirtDesignComponent = memo(function ShirtDesignComponent({
	setFormData,
	formData,
	styles
}) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [shirtColor, setShirtColor] = useState(formData.color || "White");

	// Define static data with useMemo to prevent recreation on each render
	const colorOptions = useMemo(() => ["White", "Black", "Navy", "Red", "Green", "Gray", "Blue", "Yellow"], []);

	// Color hex values mapping for preview - created once
	const colorHexMap = useMemo(() => ({
		White: "#FFFFFF",
		Black: "#000000",
		Navy: "#000080",
		Red: "#FF0000",
		Green: "#008000",
		Gray: "#808080",
		Blue: "#0000FF",
		Yellow: "#FFFF00",
	}), []);

	// Use useCallback for event handlers to prevent recreation on each render
	const handleFileChange = useCallback((fileInfo) => {
		setSelectedFile(fileInfo);
		setFormData(prev => ({
			...prev,
			design: fileInfo,
		}));

		// Use the base64 data directly for preview
		if (fileInfo && fileInfo.base64) {
			setPreviewUrl(fileInfo.base64);
		} else {
			setPreviewUrl(null);
		}
	}, [setFormData]);

	const handleColorChange = useCallback((color) => {
		setShirtColor(color);
		setFormData(prev => ({
			...prev,
			color: color,
		}));
	}, [setFormData]);

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			// Only revoke URLs if they're not base64 data
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	// Load initial data only on mount or when essential props change
	useEffect(() => {
		if (formData.design) {
			setSelectedFile(formData.design);
			// If it's already a base64 object with the proper format
			if (formData.design.base64) {
				setPreviewUrl(formData.design.base64);
			}
			// For backwards compatibility with old File objects
			else if (formData.design instanceof File) {
				const fileUrl = URL.createObjectURL(formData.design);
				setPreviewUrl(fileUrl);
			}
		}

		if (formData.color) {
			setShirtColor(formData.color);
		}
	}, [formData.design, formData.color]);

	// Memoize color buttons to prevent recreation
	const colorButtons = useMemo(() => (
		colorOptions.map((color) => (
			<div
				key={color}
				onClick={() => handleColorChange(color)}
				className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${
					shirtColor === color ? "ring-2 ring-blue-500" : ""
				}`}
				style={{backgroundColor: colorHexMap[color]}}
				title={color}
			/>
		))
	), [colorOptions, colorHexMap, shirtColor, handleColorChange]);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-col w-4/9">
					<CustomText type={"medium"} className="mb-2">
						Upload Your Design
					</CustomText>
					<div className="flex-grow">
						<FileComponent
							className="h-full"
							onChange={handleFileChange}
							file={formData.design}
						/>
					</div>

					<CustomText type={"medium"} className="mb-2 mt-4">
						Choose Shirt Color
					</CustomText>

					<div className="flex flex-row flex-wrap mt-2 gap-2">
						{colorButtons}
					</div>
				</div>
				
				<div className="flex flex-col w-4/9 h-80">
					<CustomText type={"medium"} className="mb-2">
						Preview
					</CustomText>
					<div className="flex flex-col items-center justify-center w-full h-full shadow-lg rounded-lg p-4 bg-white">
						<div className="relative w-full h-40 flex items-center justify-center">
							{/* T-shirt base image with selected color */}
							<div className="relative w-32 h-40">
								<div
									className={`absolute inset-0 rounded-md ${
										shirtColor === "White" ? "border border-gray-200" : ""
									}`}
									style={{
										backgroundColor: colorHexMap[shirtColor] || "#FFFFFF",
										clipPath:
											"polygon(25% 0%, 75% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
									}}
								>
									{/* This creates a simple t-shirt shape with selected color */}
								</div>

								{/* Design overlay */}
								{previewUrl && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div
											className="w-20 h-20 bg-contain bg-center bg-no-repeat"
											style={{
												backgroundImage: `url(${previewUrl})`,
												top: "25%",
												left: "20%",
											}}
										></div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
