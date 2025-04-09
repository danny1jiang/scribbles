"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {useState, useEffect} from "react";
import Image from "next/image";

export function DesignComponent({styles}) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleFileChange = (file) => {
		setSelectedFile(file);

		// Create URL for preview
		if (file) {
			const fileUrl = URL.createObjectURL(file);
			setPreviewUrl(fileUrl);
		} else {
			setPreviewUrl(null);
		}
	};

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

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
						<FileComponent className="h-full" onChange={handleFileChange} />
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
							{/* T-shirt base image */}
							<div className="relative w-32 h-40">
								<div
									className="absolute inset-0 bg-gray-200 rounded-md"
									style={{
										clipPath:
											"polygon(25% 0%, 75% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
									}}
								>
									{/* This creates a simple t-shirt shape */}
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
