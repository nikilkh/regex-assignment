const fs = require("fs");

const nameReg = /\">[A-Za-z]{3,}\s[\s]?[A-Za-z]{3,}/g;
const statusReg = /[A-Z]{9}/g;
const referenceReg = /[A-Z]{2}\d{8}-\d{5}/g;
const PhoneReg = /\(\d{3}\)\s\d{3}-\d{4}/g;
const trackingReg = />\s\d{5,}/g;
const addressReg =
  /(\w{1,}\s*\w{1,}\s\w{1,},\s)?(\w{1,}\s)?(\w{1,},\s)?(\w(1,)\s)?(\w{1,}\s)?(\w{1,}\s)?(\w{1,}\s\w{1,},\s)?\w{1,},\s*(\s*|\w{1,})\s\w{1,},\s\w{1,},.\d{5}/g;
const dateReg = /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}\s[A-Z]{2}/g;
const htmlData =
  /<tr>(\s*<td.{1,}\s*.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*)\s*<\/tr>/g;

let patientNames = [];
let agentNames = [];
let patientAdrresses = [];
let patientPhones = [];
let appointmentReferences = [];
let appointmentStatuses = [];
let trackings = [];
let appointmentDates = [];

let requiredData = "";

fs.readFile("sample-example.html", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const htmlTableData = data.match(htmlData);

  htmlTableData.map((row) => {
    let names = row.match(nameReg);
    let addresses = row.match(addressReg);
    let phones = row.match(PhoneReg);
    let References = row.match(referenceReg);
    let statuses = row.match(statusReg);
    let tracks = row.match(trackingReg);
    let dates = row.match(dateReg);

    patientNames.push(names[0].substring(2));

    if (names.length === 1) {
      agentNames.push("N/A");
    } else {
      agentNames.push(names[1].substring(2));
    }

    patientAdrresses.push(addresses[0]);

    patientPhones.push(phones[0]);

    appointmentReferences.push(References[0]);

    appointmentStatuses.push(statuses[0]);

    if (tracks === null) {
      trackings.push("n/a");
    } else {
      trackings.push(tracks[0].substring(1));
    }

    appointmentDates.push(dates[0]);
  });

  for (let i = 0; i < 33; i++) {
    requiredData +=
      appointmentReferences[i] +
      " " +
      patientNames[i] +
      " " +
      patientAdrresses[i] +
      " " +
      patientPhones[i] +
      " " +
      agentNames[i] +
      " " +
      appointmentStatuses[i] +
      " " +
      trackings[i] +
      " " +
      appointmentDates[i] +
      "\n";
  }

  fs.writeFile("Output.txt", requiredData, (error) => {
    if (error) throw error;
  });
});
