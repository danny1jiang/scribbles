import {useRef, useState} from "react";

export function FileComponent({className, onChange}) {
	const fileInputRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);

	const handleClick = () => {
		fileInputRef.current.click();
	};

	const handleDrop = (event) => {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			setSelectedFile(event.dataTransfer.files[0]);
			onChange(event.dataTransfer.files[0]);
			event.dataTransfer.clearData();
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleFileChange = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
			onChange(event.target.files[0]);
		}
	};

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
			{selectedFile ? (
				<span className="text-center">{selectedFile.name}</span>
			) : (
				<span className="text-center">Drag & drop file here or click to select</span>
			)}
		</div>
	);
}
