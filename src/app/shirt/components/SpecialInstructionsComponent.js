"use client";

import {useState} from "react";
import {CustomText} from "@/components/CustomText";

export function SpecialInstructionsComponent({setFormData, formData, onChange}) {
	const [instructions, setInstructions] = useState(formData.specialInstructions);
	const [charCount, setCharCount] = useState(0);
	const maxChars = 500;

	const handleInstructionsChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setInstructions(text);
			setFormData({...formData, specialInstructions: text});
			setCharCount(text.length);
			if (onChange) {
				onChange(text);
			}
		}
	};

	return (
		<div className={`flex flex-col items-start justify-center w-full`}>
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
	);
}
