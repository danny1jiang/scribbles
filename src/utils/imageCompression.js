/**
 * Image compression utility for reducing file sizes before Google Sheets submission
 */

/**
 * Compresses a single image to reduce its file size
 * @param {string} base64Data - The base64 image data with data URL prefix
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} maxHeight - Maximum height in pixels (default: 1080)
 * @param {number} quality - JPEG quality (0.1 to 1.0, default: 0.8)
 * @returns {Promise<string>} - Compressed base64 image data
 */
export function compressImage(base64Data, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
	return new Promise((resolve, reject) => {
		try {
			const img = new Image();

			img.onload = function () {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				// Calculate new dimensions while maintaining aspect ratio
				let {width, height} = calculateDimensions(
					img.width,
					img.height,
					maxWidth,
					maxHeight
				);

				canvas.width = width;
				canvas.height = height;

				// Draw and compress the image
				ctx.drawImage(img, 0, 0, width, height);

				// Convert to base64 with compression
				const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
				resolve(compressedBase64);
			};

			img.onerror = function () {
				reject(new Error("Failed to load image for compression"));
			};

			img.src = base64Data;
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 * @param {number} originalWidth
 * @param {number} originalHeight
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns {object} New width and height
 */
function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
	let width = originalWidth;
	let height = originalHeight;

	// Scale down if width exceeds max
	if (width > maxWidth) {
		height = (height * maxWidth) / width;
		width = maxWidth;
	}

	// Scale down if height still exceeds max
	if (height > maxHeight) {
		width = (width * maxHeight) / height;
		height = maxHeight;
	}

	return {width: Math.round(width), height: Math.round(height)};
}

/**
 * Get the size of a base64 string in bytes
 * @param {string} base64String - Base64 encoded string
 * @returns {number} Size in bytes
 */
export function getBase64Size(base64String) {
	if (!base64String) return 0;

	// Remove data URL prefix if present
	const base64Data = base64String.split(",")[1] || base64String;

	// Calculate size: base64 encoding increases size by ~33%
	// Each base64 character represents 6 bits, so 4 chars = 3 bytes
	const paddingChars = (base64Data.match(/=/g) || []).length;
	return Math.floor((base64Data.length * 3) / 4) - paddingChars;
}

/**
 * Compress multiple images to fit within a total size limit
 * @param {object} formData - Form data containing image fields
 * @param {number} maxTotalSize - Maximum total size in bytes (default: 6MB)
 * @returns {Promise<object>} Form data with compressed images
 */
export async function compressFormImages(formData, maxTotalSize = 6 * 1024 * 1024) {
	const imageKeys = ["design", "front", "back", "frontPreview", "backPreview"];
	const compressedData = {...formData};

	// Early return if running on server-side (no document/Image available)
	if (typeof window === "undefined") {
		return compressedData;
	}

	// Find all images in the form data
	const images = [];
	imageKeys.forEach((key) => {
		if (formData[key] && formData[key].base64) {
			images.push({
				key,
				data: formData[key],
				originalSize: getBase64Size(formData[key].base64),
			});
		}
	});

	if (images.length === 0) {
		return {
			data: compressedData,
			compressionInfo: {
				wasCompressed: false,
				originalSize: 0,
				finalSize: 0,
				imageCount: 0,
			},
		};
	}

	// Calculate total current size
	let totalSize = images.reduce((sum, img) => sum + img.originalSize, 0);

	// If already under limit, no compression needed
	if (totalSize <= maxTotalSize) {
		return {
			data: compressedData,
			compressionInfo: {
				wasCompressed: false,
				originalSize: totalSize,
				finalSize: totalSize,
				imageCount: images.length,
			},
		};
	}

	// Compress images with progressively higher compression
	let compressionLevel = 0.8; // Start with 80% quality
	let attempts = 0;
	const maxAttempts = 5;

	while (totalSize > maxTotalSize && attempts < maxAttempts) {
		// Compress all images
		const compressionPromises = images.map(async (img) => {
			try {
				// Determine dimensions based on compression level
				const maxWidth =
					compressionLevel > 0.6 ? 1920 : compressionLevel > 0.4 ? 1280 : 960;
				const maxHeight =
					compressionLevel > 0.6 ? 1080 : compressionLevel > 0.4 ? 720 : 540;

				const compressed = await compressImage(
					img.data.base64,
					maxWidth,
					maxHeight,
					compressionLevel
				);
				return {
					...img,
					compressedBase64: compressed,
					compressedSize: getBase64Size(compressed),
				};
			} catch (error) {
				console.error(`Error compressing image ${img.key}:`, error);
				// Return original if compression fails
				return {
					...img,
					compressedBase64: img.data.base64,
					compressedSize: img.originalSize,
				};
			}
		});

		const compressedImages = await Promise.all(compressionPromises);
		totalSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);

		// If we've achieved the target size, apply the compression
		if (totalSize <= maxTotalSize) {
			compressedImages.forEach((img) => {
				compressedData[img.key] = {
					...img.data,
					base64: img.compressedBase64,
				};
			});

			const originalTotalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
			return {
				data: compressedData,
				compressionInfo: {
					wasCompressed: true,
					originalSize: originalTotalSize,
					finalSize: totalSize,
					imageCount: images.length,
					compressionRatio: (
						((originalTotalSize - totalSize) / originalTotalSize) *
						100
					).toFixed(1),
				},
			};
		}

		// Reduce quality more aggressively for next attempt
		compressionLevel = Math.max(0.2, compressionLevel - 0.2);
		attempts++;
	}

	// If still over limit after all attempts, apply final compression with lowest quality
	if (totalSize > maxTotalSize) {
		console.warn(`⚠ Images still exceed size limit after ${maxAttempts} compression attempts`);

		const finalCompressionPromises = images.map(async (img) => {
			try {
				// Very aggressive final compression
				const compressed = await compressImage(img.data.base64, 800, 600, 0.2);
				return {
					...img,
					compressedBase64: compressed,
				};
			} catch (error) {
				console.error(`Error in final compression for ${img.key}:`, error);
				// If even this fails, try to use the original but warn the user
				return {
					...img,
					compressedBase64: img.data.base64,
				};
			}
		});

		const finalCompressed = await Promise.all(finalCompressionPromises);
		finalCompressed.forEach((img) => {
			compressedData[img.key] = {
				...img.data,
				base64: img.compressedBase64,
			};
		});

		const finalSize = finalCompressed.reduce(
			(sum, img) => sum + getBase64Size(img.compressedBase64),
			0
		);

		if (finalSize > maxTotalSize) {
			console.error("⚠ Warning: Final compressed size still exceeds target limit");
		}

		const originalTotalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
		return {
			data: compressedData,
			compressionInfo: {
				wasCompressed: true,
				originalSize: originalTotalSize,
				finalSize: finalSize,
				imageCount: images.length,
				compressionRatio: (
					((originalTotalSize - finalSize) / originalTotalSize) *
					100
				).toFixed(1),
				warning:
					finalSize > maxTotalSize
						? "Images still exceed size limit after maximum compression"
						: null,
			},
		};
	}

	// Default return if no compression was needed
	const originalTotalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
	return {
		data: compressedData,
		compressionInfo: {
			wasCompressed: true,
			originalSize: originalTotalSize,
			finalSize: totalSize,
			imageCount: images.length,
			compressionRatio:
				totalSize < originalTotalSize
					? (((originalTotalSize - totalSize) / originalTotalSize) * 100).toFixed(1)
					: "0",
		},
	};
}
