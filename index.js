import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import moment from "moment"
import {google} from 'googleapis';
import {getColumnValues} from './spreadsheet.js'
/* import {sendWelcomeMail} from "./mailservice.js";
 */
const app = express();
// Provide the required configuration
const client_email = process.env.CLIENT_EMAIL;
const calendarId = process.env.CALENDAR_ID;
const fixedKey = (process.env.KEY_ZERO+"SwFpJcDM5UeApb4VP8baeXyeBjbitzwwhhGf+1C0E+ilbfn\nAJJR7DdaXj3S1NzMLq7TPHEN5LCrISXcelYU8553e9bVktlLZI1QjDsdIVW1pJqd\n8H0intTSt327gUJsK8eIjyRDzxnWCjnDmyyQJ15GcCyWHykmvPBemil94+OBxWwC\nxcCtkdogbeIBV2sZl3ReHOfwp7TKxqtp18yjIKZ+ma14lCi7SSdxPZ56WgE6ig6R\n3eFoPT6LpB8+KXt0JPzGBgIYaRHJ7EgQNX5qq4ECgYEA30wd7Wl1vKO5oBIBcmNY\nqJEvy4rlNQY3fruKQc44Wl0XV32dU56yw+Yssf2HFEXJ/RV7xg0fV2IY4I92PbVJ\nZeB74wdM8tAoslMQvZK/uZ6LzVah3srtXnuGzdYv8t7HrwU4ueA29fvoWsl53iLk\nLYoULjwPyzEzfEgIlbWKgw0CgYEAyUdo1vyPy6+RidXJWpbM/0aKnFz51dLaFq"+process.env.KEY_SECOND).replace(/\\n/g, '\n');
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
  const startDate = moment().startOf('day').subtract(1, 'days').toISOString();
  const endDate = moment().endOf('day').add(2, 'days').toISOString();

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
      const finsum = events.map( (event) => {
        const { summary } = event;
        const { start : {date : startDate}  = {} } = event;
        const { end : {date : endDate} = {}} = event;

        return {
          summary,
          startDate,
          endDate
        }
      })


      res.send(JSON.stringify({
        finsum
      },null, 2))
    }
    res.send(JSON.stringify(
      []
    ,null, 2))

})
}
)
app.listen(3000, () => {
  console.log("application listening.....");
});
