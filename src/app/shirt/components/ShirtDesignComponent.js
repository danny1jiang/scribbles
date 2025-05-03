"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import Image from "next/image";
import {useState, useEffect, useMemo, useCallback, memo, useRef} from "react";
import {LongSleeveBack, LongSleeveFront, TshirtBack, TshirtFront} from "./ShirtOutlines";

// Memoize the component to prevent unnecessary re-renders
export const ShirtDesignComponent = memo(function ShirtDesignComponent({
	setFormData,
	formData,
	styles,
}) {
	// State for front/back view
	const [designView, setDesignView] = useState("front"); // 'front' or 'back'
	const [longSleeves, setLongSleeves] = useState(false);

	// State for files and previews for both views
	const [selectedFiles, setSelectedFiles] = useState({
		front: formData.front,
		back: formData.back,
	});
	const [previewUrls, setPreviewUrls] = useState({front: null, back: null});

	const [shirtColor, setShirtColor] = useState(formData.color || "White");

	// Define static data with useMemo to prevent recreation on each render
	const colorOptions = useMemo(() => ["White", "Gray", "Navy"], []);

	// Color hex values mapping for preview - created once
	const colorHexMap = useMemo(
		() => ({
			White: "#ffffff",
			Gray: "#999999",
			Navy: "#00467f",
		}),
		[]
	);

	function deleteDesign() {
		setFormData({...formData, [designView]: null});
	}

	// Use useCallback for event handlers to prevent recreation on each render
	const handleFileChange = useCallback(
		(fileInfo) => {
			// Update state for the current view
			setSelectedFiles((prev) => ({...prev, [designView]: fileInfo}));
			setFormData((prev) => ({
				...prev,
				// Store design based on view
				[designView === "front" ? "front" : "back"]: fileInfo,
			}));

			// Use the base64 data directly for preview
			if (fileInfo && fileInfo.base64) {
				setPreviewUrls((prev) => ({...prev, [designView]: fileInfo.base64}));
			} else {
				setPreviewUrls((prev) => ({...prev, [designView]: null}));
			}
		},
		[setFormData, designView] // Add designView dependency
	);

	const handleColorChange = useCallback(
		(color) => {
			setShirtColor(color);
			setFormData((prev) => ({
				...prev,
				color: color,
			}));
		},
		[setFormData]
	);

	// Clean up object URLs when component unmounts or URLs change
	useEffect(() => {
		const frontUrl = previewUrls.front;
		const backUrl = previewUrls.back;
		return () => {
			// Only revoke URLs if they're not base64 data
			if (frontUrl && frontUrl.startsWith("blob:")) {
				URL.revokeObjectURL(frontUrl);
			}
			if (backUrl && backUrl.startsWith("blob:")) {
				URL.revokeObjectURL(backUrl);
			}
		};
	}, [previewUrls]);

	// Load initial data only on mount or when essential props change
	useEffect(() => {
		const initialFiles = {front: null, back: null};
		const initialPreviews = {front: null, back: null};

		if (formData.front) {
			initialFiles.front = formData.front;
			if (formData.front.base64) {
				initialPreviews.front = formData.front.base64;
			} else if (formData.front instanceof File) {
				initialPreviews.front = URL.createObjectURL(formData.front);
			}
		}

		if (formData.back) {
			initialFiles.back = formData.back;
			if (formData.back.base64) {
				initialPreviews.back = formData.back.base64;
			} else if (formData.back instanceof File) {
				initialPreviews.back = URL.createObjectURL(formData.back);
			}
		}

		setSelectedFiles(initialFiles);
		setPreviewUrls(initialPreviews);

		if (formData.color) {
			setShirtColor(formData.color);
		}
		// Only depend on the initial formData properties, not the whole object
	}, [formData.front, formData.back, formData.color]);

	// Memoize color buttons to prevent recreation
	const colorButtons = useMemo(
		() =>
			colorOptions.map((color) => (
				<div
					key={color}
					onClick={() => handleColorChange(color)}
					className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${
						shirtColor === color ? "ring-2 ring-blue-500" : ""
					}`}
					style={{backgroundColor: colorHexMap[color]}}
					title={color}
				/>
			)),
		[colorOptions, colorHexMap, shirtColor, handleColorChange]
	);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-col w-4/9">
					<CustomText type={"medium"} className="mb-2">
						{/* Dynamically update title based on view */}
						Upload Your {designView === "front" ? "Front" : "Back"} Design
					</CustomText>
					<div className="flex-grow">
						<FileComponent
							className="h-full"
							onChange={handleFileChange}
							// Pass the file for the current view
							file={selectedFiles[designView]}
						/>
					</div>
				</div>

				{/* Pass the correct preview URL based on the view */}
				<ShirtDesign
					deleteDesign={deleteDesign}
					longSleeves={longSleeves}
					shirtColor={shirtColor}
					previewUrl={previewUrls[designView]}
					colorHexMap={colorHexMap}
					designView={designView} // Pass the view to the preview component
				/>
			</div>

			{/* Modern Toggle Switch for Front/Back View */}
			<div className="flex justify-start mt-4 mb-4 bg-(--color-light-gray) rounded-full pl-1 pr-1">
				<div className="relative flex w-40 pt-1 pb-1">
					<button
						onClick={() => setDesignView("front")}
						className={`relative z-10 flex-1 py-1 text-center rounded-full transition-colors duration-300 ease-in-out ${
							designView === "front" ? "text-white" : "text-gray-600"
						}`}
					>
						Front
					</button>
					<button
						onClick={() => setDesignView("back")}
						className={`relative z-10 flex-1 py-1 text-center rounded-full transition-colors duration-300 ease-in-out ${
							designView === "back" ? "text-white" : "text-gray-600"
						}`}
					>
						Back
					</button>
					<span
						className={`absolute top-1 bottom-1 w-1/2 bg-(--color-primary) rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
							designView === "front" ? "translate-x-0" : "translate-x-full"
						}`}
						aria-hidden="true"
					/>
				</div>
			</div>

			<div className="w-full z-10">
				<CustomText type={"medium"} className="mb-2 mt-4">
					Sleeve Length
				</CustomText>
				<SelectComponent
					className={styles.textBox + " " + styles.textBoxNormal}
					options={["Short Sleeve", "Long Sleeve"]}
					defaultValue={formData.sleeve}
					onChange={(value) => {
						if (value === "Short Sleeve") {
							setLongSleeves(false);
						} else {
							setLongSleeves(true);
						}
						setFormData((prev) => ({
							...prev,
							sleeve: value,
						}));
					}}
				/>
			</div>
			<div>
				<CustomText type={"medium"} className="mb-2 mt-4">
					Choose Shirt Color
				</CustomText>

				<div className="flex flex-row flex-wrap mt-2 mb-4 gap-2">{colorButtons}</div>
			</div>
		</div>
	);
});

// ... imports and ShirtDesignComponent ...

function ShirtDesign({shirtColor, previewUrl, colorHexMap, designView, longSleeves, deleteDesign}) {
	const containerRef = useRef(null);
	const imageRef = useRef(null);
	const interactionRef = useRef({
		// Store interaction details
		mode: null, // 'drag', 'scale', 'rotate'
		startX: 0,
		startY: 0, // Mouse start
		elementX: 0,
		elementY: 0, // Element start position
		startScale: 1,
		startRotation: 0,
		startDist: 0, // For scaling: initial distance from center to mouse
		startAngle: 0, // For rotation: initial angle from center to mouse
		centerX: 0,
		centerY: 0, // Element center on screen
		handle: null, // Which handle is being dragged ('tl', 'tr', 'bl', 'br', etc.)
	});

	const [position, setPosition] = useState({x: 0, y: 0});
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [isInteracting, setIsInteracting] = useState(false); // Single state for any interaction

	// --- Helper: Get Center ---
	const getCenter = useCallback(() => {
		if (!imageRef.current) return {x: 0, y: 0};
		const rect = imageRef.current.getBoundingClientRect();
		return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
	}, []);

	// --- Interaction Handlers ---
	const handleMouseDown = useCallback(
		(e, handleType = "drag") => {
			if (!previewUrl || !imageRef.current) return;
			e.preventDefault();
			e.stopPropagation();

			const center = getCenter();
			const dx = e.clientX - center.x;
			const dy = e.clientY - center.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const angle = Math.atan2(dy, dx) * (180 / Math.PI);

			let mode = "drag"; // Default to drag
			let cursor = "grabbing";

			// Determine mode based on handleType or proximity for rotation
			if (handleType.startsWith("handle-")) {
				mode = "scale";
			} else if (handleType === "rotate") {
				// If a dedicated rotation handle is clicked
				mode = "rotate";
			}
			// TODO: Add logic for detecting clicks "near" corners for rotation if no dedicated handle

			interactionRef.current = {
				mode: mode,
				startX: e.clientX,
				startY: e.clientY,
				elementX: position.x,
				elementY: position.y,
				startScale: scale,
				startRotation: rotation,
				startDist: dist,
				startAngle: angle,
				centerX: center.x,
				centerY: center.y,
				handle: handleType.startsWith("handle-") ? handleType.split("-")[1] : null,
			};

			setIsInteracting(true);
			imageRef.current.style.userSelect = "none";
		},
		[previewUrl, position.x, position.y, scale, rotation, getCenter]
	);

	useEffect(() => {
		setPosition({x: 0, y: 0});
		setScale(1);
		setRotation(0);
		setIsInteracting(false);
	}, [previewUrl]);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isInteracting) return;
			e.preventDefault();

			const {
				mode,
				startX,
				startY,
				elementX,
				elementY,
				startScale,
				startRotation,
				startDist,
				startAngle,
				centerX,
				centerY,
				handle,
			} = interactionRef.current;

			const currentDx = e.clientX - centerX;
			const currentDy = e.clientY - centerY;

			if (mode === "drag") {
				const dx = e.clientX - startX;
				const dy = e.clientY - startY;
				const imageRect = imageRef.current.getBoundingClientRect();
				const containerRect = containerRef.current.getBoundingClientRect();
				const offsetX = containerRect.width / 2 - imageRect.width / 2;
				const offsetY = containerRect.height / 2 - imageRect.height / 2;
				let finalX = elementX + dx;
				let finalY = elementY + dy;

				if (elementX + dx + offsetX < 0) {
					finalX = -offsetX; // Prevent dragging out of left bound
				}
				if (elementX + dx + offsetX + imageRect.width > containerRect.width) {
					finalX = containerRect.width - offsetX - imageRect.width; // Prevent dragging out of right bound
				}
				if (elementY + dy + offsetY < 0) {
					finalY = -offsetY;
				}
				if (elementY + dy + offsetY + imageRect.height > containerRect.height) {
					finalY = containerRect.height - offsetY - imageRect.height;
				}
				setPosition({x: finalX, y: finalY});
			} else if (mode === "scale" && handle) {
				// Scaling logic (simplified - scales proportionally from center based on distance change)
				const currentDist = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
				if (startDist > 0) {
					// Avoid division by zero
					let newScale = startScale * (currentDist / startDist);
					newScale = Math.max(0.1, Math.min(newScale, 5)); // Clamp scale
					setScale(newScale);
				}
			} else if (mode === "rotate") {
				const currentAngle = Math.atan2(currentDy, currentDx) * (180 / Math.PI);
				const angleDiff = currentAngle - startAngle;
				setRotation(startRotation + angleDiff);
			}
		},
		[isInteracting]
	); // Depend only on interaction state

	const handleMouseUp = useCallback(() => {
		if (isInteracting) {
			setIsInteracting(false);
			interactionRef.current.mode = null;
			if (imageRef.current) {
				imageRef.current.style.userSelect = "";
			}
		}
	}, [isInteracting]);

	// Effect for global listeners
	useEffect(() => {
		if (isInteracting) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isInteracting, handleMouseMove, handleMouseUp]);

	// Define handle positions (example for corners)
	const handles = ["tl", "tr", "bl", "br"]; // Top-left, Top-right, etc.

	return (
		// Remove onWheel from containerRef
		<div ref={containerRef} className="flex flex-col w-4/9 h-80">
			<CustomText type={"medium"} className="mb-2">
				{designView === "front" ? "Front" : "Back"} Preview
			</CustomText>
			<div className="flex items-center justify-center w-full h-full shadow-lg rounded-lg p-4 bg-white overflow-hidden relative select-none">
				<div className="flex flex-col gap-1 absolute pointer-events-none bottom-3 right-3 z-1">
					<button
						onClick={deleteDesign}
						className="pointer-events-auto cursor-pointer bg-blue-100 w-8 h-8 rounded-full"
					/>
					<button className="pointer-events-auto cursor-pointer bg-red-100 w-8 h-8 rounded-full" />
				</div>
				<div className="relative w-full h-full flex items-center justify-center">
					<ShirtOutline
						color={colorHexMap[shirtColor]}
						longSleeve={longSleeves}
						side={designView}
					/>

					{/* Interaction Layer */}
					{previewUrl && (
						<div // This outer div now helps position the image and handles together
							ref={imageRef} // Keep ref here for bounding box? Or move to inner? Needs testing.
							className="absolute cursor-grab" // Base cursor
							style={{
								top: "50%",
								left: "50%",
								// Apply transform to this container div
								transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg) scale(${scale})`,
								transformOrigin: "center center",
							}}
							onMouseDown={(e) => handleMouseDown(e, "drag")} // Default drag on image body
						>
							{/* The actual image */}
							<div
								className="w-20 h-20 bg-contain bg-center bg-no-repeat touch-none"
								style={{backgroundImage: `url(${previewUrl})`}}
							/>

							{/* Handles (only show when interacting or hovered?) */}
							{handles.map((handle) => (
								<div
									key={handle}
									// Basic positioning - needs refinement based on handle type (tl, tr, etc.)
									className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm ${
										handle.includes("t") ? "-top-1" : "-bottom-1"
									} ${handle.includes("l") ? "-left-1" : "-right-1"}`}
									// Apply specific cursor based on handle
									style={{
										cursor: `${
											handle === "tl" || handle === "br"
												? "nwse-resize"
												: "nesw-resize"
										}`,
									}}
									onMouseDown={(e) => handleMouseDown(e, `handle-${handle}`)}
								/>
							))}
							<div
								className="absolute left-1/2 -translate-x-1/2 -top-7 w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center cursor-grab shadow"
								// Pass specific rotate button type
								onMouseDown={(e) => handleMouseDown(e, "rotate")}
							></div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ShirtOutline({side, longSleeve, color}) {
	if (longSleeve) {
		if (side === "front") {
			return <LongSleeveFront color={color} />;
		}
		if (side === "back") {
			return <LongSleeveBack color={color} />;
		}
	} else {
		if (side === "front") {
			return <TshirtFront color={color} />;
		}
		if (side === "back") {
			return <TshirtBack color={color} />;
		}
	}
}
