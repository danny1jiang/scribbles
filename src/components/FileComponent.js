import {useEffect, useRef, useState, useCallback, memo} from "react";

// Memoize the component to prevent unnecessary re-renders
export const FileComponent = memo(function FileComponent({className, onChange, file}) {
	const fileInputRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(file || null);
	const [isConverting, setIsConverting] = useState(false);

	// Memoize the conversion function
	const convertToBase64 = useCallback((file) => {
		return new Promise((resolve, reject) => {
			// Skip conversion for very large files or if already converting
			if (isConverting || (file.size > 5 * 1024 * 1024)) {
				resolve({
					name: file.name,
					type: file.type,
					size: file.size,
					lastModified: file.lastModified,
					// For large files, just store metadata
					tooLarge: file.size > 5 * 1024 * 1024
				});
				return;
			}
			
			setIsConverting(true);
			
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const fileInfo = {
					name: file.name,
					type: file.type,
					size: file.size,
					base64: reader.result,
					lastModified: file.lastModified,
				};
				setIsConverting(false);
				resolve(fileInfo);
			};
			reader.onerror = (error) => {
				setIsConverting(false);
				reject(error);
			};
		});
	}, [isConverting]);

	const handleDrop = useCallback(async (event) => {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			setSelectedFile(file);

			try {
				const fileInfo = await convertToBase64(file);
				onChange(fileInfo);
			} catch (error) {
				console.error("Error converting file to base64:", error);
			}

			event.dataTransfer.clearData();
		}
	}, [convertToBase64, onChange]);

	const handleDragOver = useCallback((event) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(async (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setSelectedFile(file);

			try {
				const fileInfo = await convertToBase64(file);
				onChange(fileInfo);
			} catch (error) {
				console.error("Error converting file to base64:", error);
			}
		}
	}, [convertToBase64, onChange]);

	// Update selectedFile when file prop changes
	useEffect(() => {
		if (file && file !== selectedFile) {
			setSelectedFile(file);
		}
	}, [file, selectedFile]);

	return (
		<div
			className={
				"relative p-5 w-full border border-dashed border-(--color-accent) rounded-lg h-25 flex items-center justify-center cursor-pointer " +
				className
			}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onClick={handleClick}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>
				{isConverting ? (
				<span className="text-center">Processing file...</span>
			) : selectedFile ? (
				<span className="text-center">
					{typeof selectedFile === "object" && "name" in selectedFile
						? selectedFile.name
						: selectedFile.name || "File selected"}
				</span>
			) : (
				<span className="text-center">Drag & drop file here or click to select</span>
			)}
		</div>
	);
});
