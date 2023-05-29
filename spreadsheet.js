import {google} from 'googleapis';
import moment from "moment"

import * as dotenv from 'dotenv'
dotenv.config()

const client_email = process.env.CLIENT_EMAIL_XLS;
const spreadsheetId = process.env.SPREADSHEET_ID;
const fixedKey = process.env.PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n")

async function getColumnValues(startDate, endDate) {

const formattedStartDate = moment(startDate, 'YYYY-MM-DD')
const formattedEndDate = moment(endDate, 'YYYY-MM-DD')
const credentials = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL_XLS,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
}

const fixedKey = process.env.PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n")

    const client = new google.auth.JWT(
        process.env.CLIENT_EMAIL_XLS,
        null,
        fixedKey,
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    await client.authorize((err, tokens) => {
      
            google.options({
                auth: client
            });
        
    });

     // Instance of Google Sheets API
     const googleSheets = google.sheets({ version: "v4", auth: client });

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
