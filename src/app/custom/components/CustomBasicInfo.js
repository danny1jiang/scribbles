import {CustomText} from "@/components/CustomText";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const maxChars = 500;

export function CustomBasicInfoComponent({setFormData, formData, styles}) {
	const [description, setDescription] = useState(formData.description || "");
	const [charCount, setCharCount] = useState(description.length);

	const handleDescriptionChange = (e) => {
		const text = e.target.value;
		if (text.length <= maxChars) {
			setDescription(text);
			setFormData({...formData, description: text});
			setCharCount(text.length);
		}
	};

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Quantity</CustomText>
			<input
				className={
					styles.textBox + " " + styles.textBoxNormal + " " + styles.textBoxPadding
				}
				type="text"
				value={formData.quantity}
				onChange={(e) => {
					setFormData({...formData, quantity: e.target.value.replace(/[^0-9]/g, "")});
				}}
			/>

			<CustomText className={"mt-5"} type={"medium"}>
				Requested Delivery Date
			</CustomText>
			<DatePicker
				className={
					styles.textBox + " " + styles.textBoxNormal + " " + styles.textBoxPadding
				}
				wrapperClassName={"w-full"}
				popperPlacement="bottom-start"
				showPopperArrow={false}
				selected={formData.requestedDeliveryDate || new Date()}
				onChange={(date) => setFormData({...formData, requestedDeliveryDate: date})}
			/>

			<div className="mt-5 flex flex-col w-full">
				<CustomText type={"medium"} className="mb-2">
					Item Description
				</CustomText>

				<div className="w-full">
					<textarea
						value={description}
						onChange={handleDescriptionChange}
						placeholder="Describe the specifications for your custom order here..."
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
