"use client";

import {CustomText} from "@/components/CustomText";
import {FileComponent} from "@/components/FileComponent";
import {SelectComponent} from "@/components/SelectComponent";
import Image from "next/image";
import {useState, useEffect, useMemo, useCallback, memo, useRef} from "react";
import {LongSleeveBack, LongSleeveFront, TshirtBack, TshirtFront} from "./ShirtOutlines";
import {toPng} from "html-to-image";
import {X} from "lucide-react";

// Memoize the component to prevent unnecessary re-renders
export const ShirtDesignComponent = memo(function ShirtDesignComponent({
	metadata,
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
		metadata.current[designView + "Position"] = {x: 0, y: 0};
		metadata.current[designView + "Scale"] = 1;
		metadata.current[designView + "Rotation"] = 0;
		metadata.current[designView + "BoundingBox"] = null;
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
						shirtColor === color ? "ring-2 ring-(--color-secondary)" : ""
					}`}
					style={{backgroundColor: colorHexMap[color]}}
					title={color}
				/>
			)),
		[colorOptions, colorHexMap, shirtColor, handleColorChange]
	);

	return (
		<div className="flex flex-col items-start justify-center w-full">
			<div className="flex flex-col md:flex-row w-full justify-between">
				<div className="flex flex-col w-full md:w-4/9 mb-4 md:mb-0">
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
					metadata={metadata}
					setFormData={setFormData}
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

function ShirtDesign({
	setFormData,
	metadata,
	shirtColor,
	previewUrl,
	colorHexMap,
	designView,
	longSleeves,
	deleteDesign,
}) {
	const containerRef = useRef(null);
	const selectionRef = useRef(null);
	const imageRef = useRef(null);

	const [position, setPosition] = useState(
		metadata.current[designView + "Position"] || {x: 0, y: 0}
	);
	const [scale, setScale] = useState(metadata.current[designView + "Scale"] || 1);
	const [rotation, setRotation] = useState(metadata.current[designView + "Rotation"] || 0);
	const [isInteracting, setIsInteracting] = useState(false); // Single state for any interaction
	const [boundingBox, setBoundingBox] = useState(
		metadata.current[designView + "BoundingBox"] || {top: 0, left: 0, width: 0, height: 0}
	);

	const [isSelected, setIsSelected] = useState(true);

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

	// --- Helper: Get Center ---
	const getCenter = useCallback(() => {
		if (!imageRef.current) return {x: 0, y: 0};
		const rect = imageRef.current.getBoundingClientRect();
		return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
	}, []);

	// --- Interaction Handlers ---
	const handleMouseDown = useCallback(
		(eventData, handleType = "drag") => {
			// Changed 'e' to 'eventData'
			if (!previewUrl || !imageRef.current) return;
			// e.preventDefault(); // REMOVED - To be handled by the actual event listener
			// e.stopPropagation(); // REMOVED - To be handled by the actual event listener

			const center = getCenter();
			const dx = eventData.clientX - center.x; // Use eventData
			const dy = eventData.clientY - center.y; // Use eventData
			const dist = Math.sqrt(dx * dx + dy * dy);
			const angle = Math.atan2(dy, dx) * (180 / Math.PI);

			let mode = "drag"; // Default to drag

			// Determine mode based on handleType or proximity for rotation
			if (handleType.startsWith("handle-")) {
				mode = "scale";
			} else if (handleType === "rotate") {
				mode = "rotate";
			}

			interactionRef.current = {
				mode: mode,
				startX: eventData.clientX, // Use eventData
				startY: eventData.clientY, // Use eventData
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

	const handleMouseMove = useCallback(
		(e) => {
			if (!isInteracting) return;

			// Prevent default scroll/zoom behavior on touch devices
			// More robust check for preventDefault
			if (e && typeof e.preventDefault === "function") {
				if (e.touches) {
					// Check if it's a touch-like event that might scroll
					e.preventDefault();
				}
			}

			const event = e && e.touches ? e.touches[0] : e;
			// If, after potentially accessing e.touches[0], event is null or undefined, bail out.
			if (
				!event ||
				typeof event.clientX === "undefined" ||
				typeof event.clientY === "undefined"
			) {
				// console.warn('MouseMove: Invalid event object', e, event);
				return;
			}

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

			const currentDx = event.clientX - centerX;
			const currentDy = event.clientY - centerY;

			const imageRect = imageRef.current.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();

			if (mode === "drag") {
				const dx = event.clientX - startX;
				const dy = event.clientY - startY;
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
				if (finalX !== position.x || finalY !== position.y) {
					setPosition({x: finalX, y: finalY});
				}
				metadata.current[designView + "Position"] = {x: finalX, y: finalY}; // Update metadata
			} else if (mode === "scale" && handle) {
				// Scaling logic (simplified - scales proportionally from center based on distance change)
				const currentDist = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
				if (startDist > 0) {
					// Avoid division by zero
					let newScale = startScale * (currentDist / startDist);
					newScale = Math.max(0.1, Math.min(newScale, 5)); // Clamp scale
					setScale(newScale);
					metadata.current[designView + "Scale"] = newScale; // Update metadata
				}
			} else if (mode === "rotate") {
				const currentAngle = Math.atan2(currentDy, currentDx) * (180 / Math.PI);
				const angleDiff = currentAngle - startAngle;
				setRotation(startRotation + angleDiff);
				metadata.current[designView + "Rotation"] = startRotation + angleDiff; // Update metadata
			}
			const newBoundingBox = {
				top:
					imageRect.y - containerRect.y - containerRect.height / 2 + imageRect.height / 2,
				left:
					imageRect.left -
					containerRect.left -
					containerRect.width / 2 +
					imageRect.width / 2,
				width: imageRect.width,
				height: imageRect.height,
			};
			setBoundingBox(newBoundingBox);
			metadata.current[designView + "BoundingBox"] = newBoundingBox;
		},
		[isInteracting, position]
	); // Depend only on interaction state

	const handleMouseUp = useCallback(() => {
		if (isInteracting) {
			setFormDataPreview(containerRef.current);

			setIsInteracting(false);
			interactionRef.current.mode = null;
			if (imageRef.current) {
				imageRef.current.style.userSelect = "";
				// Re-enable touch actions on the image if needed, though usually handled by browser
			}
		}
	}, [isInteracting, setFormData, designView]);

	const handleImageClick = useCallback(
		(e) => {
			e.stopPropagation(); // Prevent click outside listener when clicking image itself
			if (!isInteracting) {
				// Only toggle selection if not currently dragging/scaling/rotating
				setIsSelected(true); // Select when clicked
			}
		},
		[isInteracting]
	);

	const handleClickOutside = useCallback((event) => {
		// Deselect if clicked outside the image wrapper and its handles
		if (
			selectionRef.current &&
			!selectionRef.current.contains(event.target) &&
			imageRef.current &&
			!imageRef.current.contains(event.target)
		) {
			// Check if the click is on a handle (which are technically outside imageRef but part of the controls)
			// A simpler approach for now: just check if outside imageRef.
			// If clicking handles should NOT deselect, more complex logic is needed here or stopPropagation in handleMouseDown.
			setIsSelected(false);
		}
	}, []);

	useEffect(() => {
		setIsSelected(true);
		setPosition(metadata.current[designView + "Position"] || {x: 0, y: 0});
		setScale(metadata.current[designView + "Scale"] || 1);
		setRotation(metadata.current[designView + "Rotation"] || 0);
		setIsInteracting(false);
		// Reset bounding box on URL change too
		if (imageRef.current && containerRef.current) {
			if (previewUrl !== null) {
				setFormDataPreview(containerRef.current);
			}
			if (!metadata.current[designView + "BoundingBox"]) {
				// Temporarily set scale/rotation to defaults to measure base size
				const originalTransform = imageRef.current.style.transform;
				imageRef.current.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
				const imageRect = imageRef.current.getBoundingClientRect();
				const containerRect = containerRef.current.getBoundingClientRect();
				imageRef.current.style.transform = originalTransform; // Restore original

				setBoundingBox({
					top:
						imageRect.top -
						containerRect.top -
						containerRect.height / 2 +
						imageRect.height / 2,
					left:
						imageRect.left -
						containerRect.left -
						containerRect.width / 2 +
						imageRect.width / 2,
					width: imageRect.width,
					height: imageRect.height,
				});
			} else {
				setBoundingBox(metadata.current[designView + "BoundingBox"]);
			}
		}
	}, [previewUrl]);

	useEffect(() => {
		if (containerRef.current && previewUrl !== null) {
			setFormDataPreview(containerRef.current);
		}
	}, [longSleeves, shirtColor]);

	// Effect for global listeners
	useEffect(() => {
		const touchMoveOptions = {passive: false}; // Define options once

		if (isInteracting) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchmove", handleMouseMove, touchMoveOptions);
			window.addEventListener("touchend", handleMouseUp);
			window.addEventListener("touchcancel", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove, touchMoveOptions); // Use options for removal
			window.removeEventListener("touchend", handleMouseUp);
			window.removeEventListener("touchcancel", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove, touchMoveOptions); // Use options for removal in cleanup
			window.removeEventListener("touchend", handleMouseUp);
			window.removeEventListener("touchcancel", handleMouseUp);
		};
	}, [isInteracting, handleMouseMove, handleMouseUp]);

	useEffect(() => {
		if (isSelected) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchstart", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [isSelected, handleClickOutside]);

	async function setFormDataPreview(ref) {
		if (!ref) return;

		const filter = (node) => {
			// Check if the node is an element and has the class
			if (node.title === "boundingBox") {
				return false; // Ignore bounding box
			}
			return true;
		};

		const base64String = await toPng(ref, {filter: filter});
		setFormData((prev) => ({
			...prev,
			[designView + "Preview"]: {base64: base64String},
		}));
	}

	// Define handle positions (example for corners)
	const handles = ["tl", "tr", "bl", "br"]; // Top-left, Top-right, etc.

	return (
		// Remove onWheel from containerRef
		<div className="flex relative flex-col w-full md:w-4/9 h-80">
			<CustomText type={"medium"} className="mb-2">
				{designView === "front" ? "Front" : "Back"} Preview
			</CustomText>
			<button
				onClick={deleteDesign}
				className="hover:bg-[#f8f8f8] active:bg-[#f1f1f1] flex justify-center items-center absolute bottom-3 right-3 z-1 cursor-pointer bg-white shadow-md border border-(--color-light-gray) w-8 h-8 rounded-full"
			>
				<X strokeWidth={1.5} color="#999999" />
			</button>
			<div
				ref={containerRef}
				className="flex items-center justify-center h-full shadow-lg rounded-lg p-0 bg-white overflow-hidden relative select-none"
			>
				<div className="relative w-50 h-full flex items-center justify-center">
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
								touchAction: "none", // Prevent default touch actions like scrolling
								overscrollBehavior: "contain", // Prevent scroll chaining
							}}
							onMouseDown={(e) => {
								// e is MouseEvent
								e.preventDefault();
								e.stopPropagation();
								if (!isSelected) {
									handleImageClick(e); // e is MouseEvent
								}
								handleMouseDown(e, "drag");
							}} // Default drag on image body
							onTouchStart={(e) => {
								// e is TouchEvent
								e.preventDefault();
								e.stopPropagation();
								if (!isSelected) {
									handleImageClick(e); // e is TouchEvent
								}
								handleMouseDown(e.touches[0], "drag");
							}} // Default drag on image body
						>
							{/* Design image */}
							<img
								src={previewUrl}
								alt="Design Preview"
								style={{width: "auto", height: "auto"}}
							/>
						</div>
					)}

					{/* Unrotated Handle/Bounding Box Layer */}
					{isSelected && previewUrl && boundingBox.width > 0 && (
						<div
							title="boundingBox"
							ref={selectionRef}
							className="absolute border border-(--color-secondary) pointer-events-none" // Border for visualization, disable pointer events
							style={{
								top: "50%",
								left: "50%",
								//left: `calc(-50% + ${boundingBox.left}px)`,
								//top: `calc(-50% + ${boundingBox.top}px)`,
								width: `${boundingBox.width}px`,
								height: `${boundingBox.height}px`,
								//transform: `translate(calc(-50% + ${boundingBox.left}px), calc(-50% + ${boundingBox.top}px)))`,
								//transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg) scale(${scale})`,
								transform: `translate(calc(-50% + ${boundingBox.left}px), calc(-50% + ${boundingBox.top}px))`,
							}}
						>
							{/* Scale Handles (positioned relative to this bounding box) */}
							{handles.map((handle) => {
								const isTop = handle.includes("t");
								const isLeft = handle.includes("l");
								return (
									<div
										key={handle}
										className="absolute w-3 h-3 bg-(--color-secondary) border border-white rounded-sm pointer-events-auto" // Enable pointer events
										style={{
											top: isTop ? "-0.375rem" : "auto", // Offset half the handle size
											bottom: !isTop ? "-0.375rem" : "auto",
											left: isLeft ? "-0.375rem" : "auto",
											right: !isLeft ? "-0.375rem" : "auto",
											cursor: `${
												handle === "tl" || handle === "br"
													? "nwse-resize"
													: "nesw-resize"
											}`,
										}}
										onMouseDown={(e) => {
											// e is MouseEvent
											e.preventDefault();
											e.stopPropagation();
											handleMouseDown(e, `handle-${handle}`);
										}}
										onTouchStart={(e) => {
											// e is TouchEvent
											e.preventDefault();
											e.stopPropagation(); // Prevent triggering drag on image itself
											handleMouseDown(e.touches[0], `handle-${handle}`);
										}}
									/>
								);
							})}

							{/* Rotation Handle (positioned relative to this bounding box) */}
							<div
								className="absolute w-5 h-5 rounded-full bg-(--color-secondary) border border-white flex items-center justify-center shadow pointer-events-auto" // Enable pointer events
								style={{
									top: "-0.625rem", // Offset half handle size
									left: "50%",
									transform: "translateX(-50%) translateY(-100%)", // Position above the top-center edge
									cursor: "grab", // Changed from 'grabbing' to 'grab' for consistency
								}}
								onMouseDown={(e) => {
									// e is MouseEvent
									e.preventDefault();
									e.stopPropagation();
									handleMouseDown(e, "rotate");
								}} // Ensure correct type
								onTouchStart={(e) => {
									// e is TouchEvent
									e.preventDefault();
									e.stopPropagation(); // Prevent triggering drag on image itself
									handleMouseDown(e.touches[0], "rotate");
								}}
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
