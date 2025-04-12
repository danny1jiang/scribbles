"use client";

import {useState, useEffect} from "react";
import {CustomText} from "@/components/CustomText";

export function PaymentDetailsComponent({styles, setFormData, formData, onNext}) {
	const [paymentDetails, setPaymentDetails] = useState(formData.payment);
	const [email, setEmail] = useState(formData.email || "");
	const [charCount, setCharCount] = useState(paymentDetails ? paymentDetails.length : 0);
	const [emailError, setEmailError] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);
	const maxChars = 500;

	const validateEmail = (email) => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return regex.test(email);
	};

	const handleEmailChange = (e) => {
		const newEmail = e.target.value;
		setEmail(newEmail);

		if (newEmail.trim() === "") {
			setEmailError("");
			setIsEmailValid(true);
		} else if (!validateEmail(newEmail)) {
			setEmailError("Please enter a valid email address");
			setIsEmailValid(false);
		} else {
			setEmailError("");
			setIsEmailValid(true);
		}

		setFormData({...formData, email: newEmail});
	};

	const handlePaymentDetailsChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setFormData({...formData, payment: text});
			setPaymentDetails(text);
			setCharCount(text.length);
		}
	};

	// Validate email when component mounts or when formData.email changes
	useEffect(() => {
		if (formData.email) {
			setIsEmailValid(validateEmail(formData.email));
			if (!validateEmail(formData.email)) {
				setEmailError("Please enter a valid email address");
			}
		}
	}, []);

	return (
		<div className={`flex flex-col items-start justify-center w-full`}>
			<div className="flex flex-col w-full">
				<CustomText type={"medium"}>Email</CustomText>
				<input
					className={`${styles.textBox} ${styles.textBoxNormal} ${
						styles.textBoxPadding
					} ${!isEmailValid ? "border-[#CC0033]" : ""}`}
					value={email}
					onChange={handleEmailChange}
					placeholder="example@warriorlife.net"
				/>
				{emailError && <div className="mt-1 text-[#CC0033] text-sm">{emailError}</div>}

				<CustomText type={"medium"} className="mb-2 mt-5">
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
