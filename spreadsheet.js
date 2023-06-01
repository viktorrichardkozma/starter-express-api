import {google} from 'googleapis';
import moment from "moment"

import * as dotenv from 'dotenv'
dotenv.config()

const client_email = process.env.CLIENT_EMAIL_XLS;
const spreadsheetId = process.env.SPREADSHEET_ID;

async function getColumnValues(startDate, endDate) {

const formattedStartDate = moment(startDate, 'YYYY-MM-DD')
const formattedEndDate = moment(endDate, 'YYYY-MM-DD')

const fixedKey = (process.env.KEY_XLS_FIRST + process.env.KEY_XLS_SECOND).replace(/\\n/g, '\n');
    
    console.log("FIXEDKEYSPREADSHEET",fixedKey);

const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL_XLS,
      private_key: fixedKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

     // Instance of Google Sheets API

  try {
        // Read rows from spreadsheet
    
        const metaData = await googleSheets.spreadsheets.get({
            auth: client,
            spreadsheetId,
          });

        const allDataRowCount = metaData.data.sheets[0].properties.gridProperties.rowCount;
        const range = `A${1}:I${allDataRowCount}`;
        
        const {data : {values}} = await googleSheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId,
            range: range
        });

        const filteredGuests = values?.filter( value => {
            return moment(formattedStartDate, 'YYYY-MM-DD')<=moment(value[1], 'DD/MM/YYYY') && moment(value[2], 'DD/HH/YYYY')<=formattedEndDate 
        })

        return filteredGuests;

  } catch (err) {
    console.error('The API returned an error:', err);
  }
}


export {
    getColumnValues,
}
