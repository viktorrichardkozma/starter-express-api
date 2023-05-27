import express from "express";
import moment from "moment"
import {google} from 'googleapis';
import {sendWelcomeMail} from "./mailservice.js";

const app = express();

import dotenv from 'dotenv'
dotenv.config()

// Provide the required configuration
const client_email = process.env.CLIENT_EMAIL;
const calendarId = process.env.CALENDAR_ID;

const fixedKey = process.env.KEY.replace(new RegExp("\\\\n", "\g"), "\n")

// Google calendar API settings
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    client_email,
    null,
    fixedKey,
    [
      'https://www.googleapis.com/auth/calendar'
    ]
);

const getTodayEvents = async () => {

  const startDate = moment().startOf('day').subtract(10, 'days').toISOString();
  const endDate = moment().endOf('day').toISOString();
/*   const endDate = moment().endOf('day').add(3, 'days').toISOString();
 */

  try {
      let response = await calendar.events.list({
          auth: auth,
          calendarId: calendarId,
          timeMin: startDate,
          timeMax: endDate,
          timeZone: "Europe/Budapest",
      });

      let items = response['data']['items'];

      return items;
  } catch (error) {
    console.log(error)
      return 0;
  }
};
 
app.get('/'+process.env.ENDPOINT, (req, res) => {
  
  getTodayEvents().then( events => {

    if(events.length>0){
      const summaries = events.map( ({summary}) => summary)
      res.send(summaries.join(', '))

    }
  })

})

app.listen(3000, () => {
  console.log("application listening.....");
});
