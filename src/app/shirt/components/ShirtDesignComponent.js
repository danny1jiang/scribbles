"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import {useState, useEffect, useMemo, useCallback, memo} from "react";

// Memoize the component to prevent unnecessary re-renders
export const ShirtDesignComponent = memo(function ShirtDesignComponent({
	setFormData,
	formData,
	styles,
}) {
	// State for front/back view
	const [designView, setDesignView] = useState("front"); // 'front' or 'back'

	// State for files and previews for both views
	const [selectedFiles, setSelectedFiles] = useState({
		front: formData.front,
		back: formData.back,
	});
	const [previewUrls, setPreviewUrls] = useState({front: null, back: null});

	const [shirtColor, setShirtColor] = useState(formData.color || "White");

	// Define static data with useMemo to prevent recreation on each render
	const colorOptions = useMemo(() => ["White", "Gray", "Navy"], []);

	// Color hex values mapping for preview - created once
	const colorHexMap = useMemo(
		() => ({
			White: "#ffffff",
			Gray: "#999999",
			Navy: "#00467f",
		}),
		[]
	);

	// Use useCallback for event handlers to prevent recreation on each render
	const handleFileChange = useCallback(
		(fileInfo) => {
			// Update state for the current view
			setSelectedFiles((prev) => ({...prev, [designView]: fileInfo}));
			setFormData((prev) => ({
				...prev,
				// Store design based on view
				[designView === "front" ? "front" : "back"]: fileInfo,
			}));

			// Use the base64 data directly for preview
			if (fileInfo && fileInfo.base64) {
				setPreviewUrls((prev) => ({...prev, [designView]: fileInfo.base64}));
			} else {
				setPreviewUrls((prev) => ({...prev, [designView]: null}));
			}
		},
		[setFormData, designView] // Add designView dependency
	);

	const handleColorChange = useCallback(
		(color) => {
			setShirtColor(color);
			setFormData((prev) => ({
				...prev,
				color: color,
			}));
		},
		[setFormData]
	);

	// Clean up object URLs when component unmounts or URLs change
	useEffect(() => {
		const frontUrl = previewUrls.front;
		const backUrl = previewUrls.back;
		return () => {
			// Only revoke URLs if they're not base64 data
			if (frontUrl && frontUrl.startsWith("blob:")) {
				URL.revokeObjectURL(frontUrl);
			}
			if (backUrl && backUrl.startsWith("blob:")) {
				URL.revokeObjectURL(backUrl);
			}
		};
	}, [previewUrls]);

	// Load initial data only on mount or when essential props change
	useEffect(() => {
		const initialFiles = {front: null, back: null};
		const initialPreviews = {front: null, back: null};

		if (formData.front) {
			initialFiles.front = formData.front;
			if (formData.front.base64) {
				initialPreviews.front = formData.front.base64;
			} else if (formData.front instanceof File) {
				initialPreviews.front = URL.createObjectURL(formData.front);
			}
		}

		if (formData.back) {
			initialFiles.back = formData.back;
			if (formData.back.base64) {
				initialPreviews.back = formData.back.base64;
			} else if (formData.back instanceof File) {
				initialPreviews.back = URL.createObjectURL(formData.back);
			}
		}

		setSelectedFiles(initialFiles);
		setPreviewUrls(initialPreviews);

		if (formData.color) {
			setShirtColor(formData.color);
		}
		// Only depend on the initial formData properties, not the whole object
	}, [formData.front, formData.back, formData.color]);

	// Memoize color buttons to prevent recreation
	const colorButtons = useMemo(
		() =>
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
			)),
		[colorOptions, colorHexMap, shirtColor, handleColorChange]
	);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-col w-4/9">
					<CustomText type={"medium"} className="mb-2">
						{/* Dynamically update title based on view */}
						Upload Your {designView === "front" ? "Front" : "Back"} Design
					</CustomText>
					<div className="flex-grow">
						<FileComponent
							className="h-full"
							onChange={handleFileChange}
							// Pass the file for the current view
							file={selectedFiles[designView]}
						/>
					</div>
				</div>

				{/* Pass the correct preview URL based on the view */}
				<ShirtDesign
					shirtColor={shirtColor}
					previewUrl={previewUrls[designView]}
					colorHexMap={colorHexMap}
					designView={designView} // Pass the view to the preview component
				/>
			</div>

			{/* Modern Toggle Switch for Front/Back View */}
			<div className="flex justify-start mt-4 mb-4 bg-(--color-light-gray) rounded-full pl-1 pr-1">
				<div className="relative flex w-40 pt-1 pb-1">
					<button
						onClick={() => setDesignView("front")}
						className={`relative z-10 flex-1 py-1 text-center rounded-full transition-colors duration-300 ease-in-out ${
							designView === "front" ? "text-white" : "text-gray-600"
						}`}
					>
						Front
					</button>
					<button
						onClick={() => setDesignView("back")}
						className={`relative z-10 flex-1 py-1 text-center rounded-full transition-colors duration-300 ease-in-out ${
							designView === "back" ? "text-white" : "text-gray-600"
						}`}
					>
						Back
					</button>
					<span
						className={`absolute top-1 bottom-1 w-1/2 bg-(--color-primary) rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
							designView === "front" ? "translate-x-0" : "translate-x-full"
						}`}
						aria-hidden="true"
					/>
				</div>
			</div>

			<div className="w-full z-10">
				<CustomText type={"medium"} className="mb-2 mt-4">
					Sleeve Length
				</CustomText>
				<SelectComponent
					className={styles.textBox + " " + styles.textBoxNormal}
					options={["Short Sleeve", "Long Sleeve"]}
					defaultValue={formData.sleeve}
					onChange={(value) => {
						setFormData((prev) => ({
							...prev,
							sleeve: value,
						}));
					}}
				/>
			</div>
			<div>
				<CustomText type={"medium"} className="mb-2 mt-4">
					Choose Shirt Color
				</CustomText>

				<div className="flex flex-row flex-wrap mt-2 mb-4 gap-2">{colorButtons}</div>
			</div>
		</div>
	);
});

function ShirtDesign({shirtColor, previewUrl, colorHexMap, designView}) {
	return (
		<div className="flex flex-col w-4/9 h-80">
			<CustomText type={"medium"} className="mb-2">
				{/* Update preview title based on view */}
				{designView === "front" ? "Front" : "Back"} Preview
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
	);
}
