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
	await glSheets.spreadsheets.values.append({
		auth: glAuth,
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: range,
		valueInputOption: "USER_ENTERED",
		requestBody: {
			values: [
				Object.keys(formData).map((key) => {
					if (key === "design" && formData[key] !== null) {
						return formData[key].name;
					} else {
						return formData[key];
					}
				}),
			],
		},
	});
}
