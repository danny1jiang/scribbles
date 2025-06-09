import {CustomText} from "@/components/CustomText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function ShirtBasicInfoComponent({setFormData, formData, styles}) {
	const sizes = [
		"Youth Small",
		"Youth Medium",
		"Youth Large",
		"Adult Small",
		"Adult Medium",
		"Adult Large",
		"Adult 2XL",
		"Adult 3XL",
	];

	// Initialize sizes object if it doesn't exist
	const initializeSizes = () => {
		if (!formData.sizes || typeof formData.sizes !== "object") {
			const initialSizes = {};
			sizes.forEach((size) => {
				initialSizes[size] = 0;
			});
			setFormData({...formData, sizes: initialSizes});
		}
	};

	// Initialize sizes on component mount
	if (!formData.sizes) {
		initializeSizes();
	}

	const handleQuantityChange = (size, quantity) => {
		const numericQuantity = parseInt(quantity.replace(/[^0-9]/g, "")) || 0;
		setFormData({
			...formData,
			sizes: {
				...formData.sizes,
				[size]: numericQuantity,
			},
		});
	};

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<CustomText type={"medium"}>Size and Quantity Selection</CustomText>
			<div className="w-full mt-3 overflow-hidden rounded-lg border border-(--color-gray)">
				<table className="w-full">
					<thead>
						<tr className="bg-(--color-light-gray)">
							<th className="text-left py-3 px-4 font-medium text-lg">Size</th>
							<th className="text-left py-3 px-4 font-medium text-lg">Quantity</th>
						</tr>
					</thead>
					<tbody>
						{sizes.map((size, index) => (
							<tr
								key={size}
								className={`${
									index % 2 === 0 ? "bg-white" : "bg-gray-50"
								} hover:bg-blue-50 transition-colors duration-150`}
							>
								<td className="py-3 px-4 border-t border-(--color-light-gray)">
									<CustomText>{size}</CustomText>
								</td>
								<td className="py-3 px-4 border-t border-(--color-light-gray)">
									<input
										className={`${styles.textBox} ${styles.textBoxPadding} w-20 h-10 text-center`}
										type="text"
										value={formData.sizes?.[size] || 0}
										onChange={(e) => handleQuantityChange(size, e.target.value)}
										placeholder="0"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

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
		</div>
	);
}
