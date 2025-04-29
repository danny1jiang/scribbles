"use server";
import {google} from "googleapis";

export async function getSheetData() {
	const glAuth = await google.auth.getClient({
		projectId: process.env.PROJECT_ID,
		credentials: {
			type: "service_account",
			project_id: process.env.PROJECT_ID,
			private_key_id: process.env.PRIVATE_KEY_ID,
			private_key: process.env.PRIVATE_KEY,
			client_email: process.env.CLIENT_EMAIL,
			universe_domain: process.env.UNIVERSE_DOMAIN,
		},
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});

	const glSheets = google.sheets({version: "v4", auth: glAuth});

	const data = await glSheets.spreadsheets.values.get({
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: "Sheet1!A1:C1",
	});

	return {data: data.data.values};
}

export async function setSheetData(formData, itemType) {
	try {
		const glAuth = await google.auth.getClient({
			projectId: process.env.PROJECT_ID,
			credentials: {
				type: "service_account",
				project_id: process.env.PROJECT_ID,
				private_key_id: process.env.PRIVATE_KEY_ID,
				private_key: process.env.PRIVATE_KEY,
				client_email: process.env.CLIENT_EMAIL,
				universe_domain: process.env.UNIVERSE_DOMAIN,
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});

		const glSheets = google.sheets({version: "v4", auth: glAuth});

		let range = "Shirts!A1";
		if (itemType === "sticker") {
			range = "Stickers!A1";
		}
		if (itemType === "custom") {
			range = "Custom!A1";
		}

		// Extract sheet name and starting cell
		const [sheetName] = range.split("!");

		// First, append the row data without the base64 design content
		const response = await glSheets.spreadsheets.values.append({
			auth: glAuth,
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: range,
			valueInputOption: "USER_ENTERED",
			requestBody: {
				values: [
					[
						"",
						...Object.keys(formData).map((key) => {
							if (
								(key === "design" || key === "front" || key === "back") &&
								formData[key] !== null
							) {
								return "Design attached in note"; // Placeholder text in the cell
							} else {
								return formData[key];
							}
						}),
					],
				],
			},
		});

		// If there's design data, add it as a note
		let designDataArr = [];
		let designDataNames = [];
		if (formData.design && formData.design !== null) {
			designDataArr.push(formData.design);
			designDataNames.push("design");
		}
		if (formData.front && formData.front !== null) {
			designDataArr.push(formData.front);
			designDataNames.push("front");
		}
		if (formData.back && formData.back !== null) {
			designDataArr.push(formData.back);
			designDataNames.push("back");
		}
		for (let i = 0; i < designDataArr.length; i++) {
			const designData = designDataArr[i];
			const designDataName = designDataNames[i];
			// Get the row number of the newly added row
			const updatedRange = response.data.updates.updatedRange;

			// Updated regex to match patterns like "Shirts!A3:H3"
			const rowMatch = updatedRange.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)$/);

			if (rowMatch) {
				// Extract the ending row number (index 4 in the match array)
				const rowNumber = rowMatch[4];

				// Find the column index for design
				const designIndex = Object.keys(formData).indexOf(designDataName) + 1;

				// Get sheet ID
				const sheetId = await getSheetIdByName(
					glSheets,
					process.env.SPREADSHEET_ID,
					sheetName
				);

				// Add a note with the design data
				const batchUpdateResponse = await glSheets.spreadsheets.batchUpdate({
					auth: glAuth,
					spreadsheetId: process.env.SPREADSHEET_ID,
					requestBody: {
						requests: [
							{
								updateCells: {
									range: {
										sheetId: sheetId,
										startRowIndex: rowNumber - 1, // 0-based index
										endRowIndex: rowNumber,
										startColumnIndex: designIndex,
										endColumnIndex: designIndex + 1,
									},
									rows: [
										{
											values: [
												{
													note: designData.base64,
												},
											],
										},
									],
									fields: "note",
								},
							},
						],
					},
				});
			}
		}

		return {success: true};
	} catch (error) {
		throw error; // Re-throw to see the error in the server logs
	}
}

async function getSheetIdByName(sheetsApi, spreadsheetId, sheetName) {
	const response = await sheetsApi.spreadsheets.get({
		spreadsheetId: spreadsheetId,
	});

	const sheet = response.data.sheets.find((s) => s.properties.title === sheetName);

	return sheet ? sheet.properties.sheetId : null;
}
