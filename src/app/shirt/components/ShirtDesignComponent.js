"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import {useState, useEffect} from "react";
import Image from "next/image";

export function ShirtDesignComponent({setFormData, formData, styles}) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [shirtColor, setShirtColor] = useState(formData.color || "White");

	const colorOptions = ["White", "Black", "Navy", "Red", "Green", "Gray", "Blue", "Yellow"];

	// Color hex values mapping for preview
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

	const handleFileChange = (file) => {
		setSelectedFile(file);
		setFormData({
			...formData,
			design: file,
		});

		// Create URL for preview
		if (file) {
			const fileUrl = URL.createObjectURL(file);
			setPreviewUrl(fileUrl);
		} else {
			setPreviewUrl(null);
		}
	};

	const handleColorChange = (color) => {
		setShirtColor(color);
		setFormData({
			...formData,
			color: color,
		});
	};

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	useEffect(() => {
		if (formData.design) {
			setSelectedFile(formData.design);
			const fileUrl = URL.createObjectURL(formData.design);
			setPreviewUrl(fileUrl);
		}

		if (formData.color) {
			setShirtColor(formData.color);
		}
	}, [formData.design, formData.color]);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-row w-full justify-between">
				{" "}
				{/* Remove items-stretch, let height be determined by children */}
				{/* Upload Section - This will adapt to the height of its sibling */}
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
						{colorOptions.map((color) => (
							<div
								key={color}
								onClick={() => handleColorChange(color)}
								className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${
									shirtColor === color ? "ring-2 ring-blue-500" : ""
								}`}
								style={{backgroundColor: colorHexMap[color]}}
								title={color}
							/>
						))}
					</div>
				</div>
				{/* Preview Section - This has fixed height and will determine parent height */}
				<div className="flex flex-col w-4/9 h-80">
					{" "}
					{/* Set specific height here */}
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
}
