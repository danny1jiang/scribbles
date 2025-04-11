"use client";

import {useState} from "react";
import {CustomText} from "@/components/CustomText";

export function PaymentDetailsComponent({setFormData, formData, onNext}) {
	const [paymentDetails, setPaymentDetails] = useState(formData.payment);
	const [charCount, setCharCount] = useState(0);
	const maxChars = 500;

	const handlePaymentDetailsChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setFormData({...formData, payment: text});
			setPaymentDetails(text);
			setCharCount(text.length);
		}
	};

	return (
		<div className={`flex flex-col items-start justify-center w-full`}>
			<div className="flex flex-col w-full">
				<CustomText type={"medium"} className="mb-2">
					Payment Details
				</CustomText>

				<div className="w-full">
					<textarea
						value={paymentDetails}
						onChange={handlePaymentDetailsChange}
						placeholder="Describe your preferred payment method here..."
						className="w-full p-2 py-2 border border-(--color-gray) rounded-lg h-32 resize-none"
					/>
					<div className="mt-1 text-right text-(--color-accent)">
						{charCount}/{maxChars} characters
					</div>
				</div>
			</div>
		</div>
	);
}
