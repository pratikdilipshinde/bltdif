import { google } from "googleapis";

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is missing.");
  }

  if (!privateKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is missing.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendOrderToSheet(row: (string | number)[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is missing.");
  }

  try {
    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Orders!A:P",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("Google Sheet append success:", response.data.updates);
    return response.data;
  } catch (error: any) {
    console.error(
      "Google Sheet append failed:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
}