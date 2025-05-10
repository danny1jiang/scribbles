"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import {useState, useEffect} from "react";
import Image from "next/image";

export function CustomDesignComponent({setFormData, formData, styles}) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleFileChange = (fileInfo) => {
		setSelectedFile(fileInfo);
		setFormData({
			...formData,
			design: fileInfo,
		});

		// Use the base64 data directly for preview
		if (fileInfo && fileInfo.base64) {
			setPreviewUrl(fileInfo.base64);
		} else {
			setPreviewUrl(null);
		}
	};

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			// Only revoke URLs if they're not base64 data
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

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
	}, [formData.design]);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col md:flex-row w-full justify-between">
				<div className="flex flex-col w-full md:w-4/9 mb-4 md:mb-0">
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
				</div>

				<div className="flex flex-col w-full md:w-4/9 h-80">
					<CustomText type={"medium"} className="mb-2">
						Preview
					</CustomText>
					<div className="flex flex-col items-center justify-center w-full h-full shadow-lg rounded-lg p-4 bg-white">
						<div className="relative w-full h-40 flex items-center justify-center">
							{/* Product shape with selected color */}
							<div className="relative w-32 h-40">
								{/* Design overlay */}
								{previewUrl && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div
											className="w-20 h-20 bg-contain bg-center bg-no-repeat"
											style={{
												backgroundImage: `url(${previewUrl})`,
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
