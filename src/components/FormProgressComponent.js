"use client";

import {CustomText} from "@/components/CustomText";
import {useState, useEffect, useRef} from "react";

export function FormProgressComponent({steps, currentStep, onClick}) {
	// Track which circles should be highlighted
	const [highlightedCircles, setHighlightedCircles] = useState(
		Array(steps.length)
			.fill(false)
			.map((_, i) => i <= currentStep)
	);

	// Keep track of previous step to detect direction
	const prevStepRef = useRef(currentStep);

	// Update highlighted circles with delay based on progress bar animation
	useEffect(() => {
		const isMovingForward = currentStep > prevStepRef.current;
		const previousStep = prevStepRef.current;
		prevStepRef.current = currentStep;

		if (isMovingForward) {
			// Moving forward: animate with delay
			// Immediately update circles up to the previous step
			setHighlightedCircles((prev) => prev.map((_, i) => i < currentStep));

			// Add delay for the current circle to match the progress bar animation
			const timer = setTimeout(() => {
				setHighlightedCircles((prev) => prev.map((_, i) => i <= currentStep));
			}, 200);

			return () => clearTimeout(timer);
		} else {
			// Moving backward: unhighlight only the circles that need to change
			// Use the functional update pattern to avoid infinite loop
			setHighlightedCircles((prev) => {
				// First unhighlight everything past current step
				return prev.map((val, i) => {
					if (i > currentStep) {
						return false;
					}
					return val;
				});
			});

			// No need for a timer when going backward
		}
	}, [currentStep, steps.length]); // Remove highlightedCircles from dependencies

	return (
		<div className="flex flex-col items-center w-full mb-6">
			<div className="relative w-full max-w-4xl">
				{/* Progress lines - adjusted to align with circle centers */}
				<div className="absolute top-5 w-[calc(100%-8px)] left-[4px]">
					{/* Background line (gray) */}
					<div className="absolute h-1 bg-(--color-light-gray) w-full"></div>

					{/* Completed portion (blue) */}
					<div
						className="absolute h-1 bg-(--color-secondary)"
						style={{
							width: `${(currentStep / (steps.length - 1)) * 100}%`,
							transition: "width 0.3s ease",
						}}
					></div>
				</div>

				{/* Circles and labels */}
				<div className="flex justify-between w-full">
					{steps.map((step, index) => (
						<button
							key={index}
							onClick={() => {
								if (onClick) {
									onClick(index);
								}
							}}
							className={
								"relative flex flex-col items-center z-10 " +
								(onClick ? "cursor-pointer" : "")
							}
						>
							<div
								className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 border-6 border-white ${
									highlightedCircles[index]
										? "bg-(--color-secondary) text-white"
										: "bg-(--color-light-gray)"
								}`}
							/>

							<CustomText
								type={"small"}
								className={`text-center top-9 absolute transition-colors duration-200 select-none ${
									highlightedCircles[index]
										? "text-(--color-primary)"
										: "text-(--color-accent)"
								}`}
							>
								{step}
							</CustomText>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
