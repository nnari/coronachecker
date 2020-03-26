const axios = require('axios');
const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();
const terminalLink = require('terminal-link');

const SEARCHAREA = "Lappi";
let COUNTERS = {
  deaths: 0,
  confirmed: 0,
  recovered: 0
}

/* 
nnariToday at 3:49 AM
joo :D
kato
lisäsin uutiset
KertrudToday at 3:49 AM
joo
slick :smile:
nnariToday at 3:49 AM
vois mennä nukkuu
selkeesti liikaa aikaa
KertrudToday at 3:49 AM
sama...
=DDDDDDD */

const check = async () => {
  const response = await axios.get('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData');
  const news = await parser.parseURL('https://www.hs.fi/rss/kotimaa.xml');
  console.log("\033[0mKoronauutiset\n--------------------------------");
  

  let koronauutiset = news.items.filter(item => item.title.toLowerCase().includes("korona"));

  for(let i = 0; i < 5; i++) {
    let c = koronauutiset[i];
    const link = terminalLink(c.title, c.link);
    console.log(link);
  }
  console.log("--------------------------------");

  let confirmed = response.data.confirmed;
  let deaths = response.data.deaths;
  let recovered = response.data.recovered;
  


  if(confirmed.length > COUNTERS.confirmed) {
  confirmed.forEach(e => {
    let dt = new Date(e.date);
    let log = "";
    if(e.healthCareDistrict == SEARCHAREA) {
      log += `New reported case in ${SEARCHAREA} on ${dt.toUTCString()}`;
      if(e.infectionSourceCountry) {
        log += ` originating from ${e.infectionSourceCountry}.`;
      } else {
        log += ` from an unknown source country.`;
      }
      if(e.infectionSource != "unknown" && e.infectionSource != "related to earlier") {
        log += ` \n---- related to ${getInfectionSourceText(e.infectionSource, confirmed)}`;
      }

      console.log("\x1b[34m", log);
    }
  })
}

  if(deaths.length > COUNTERS.deaths) {
  deaths.forEach(e => {
    let dt = new Date(e.date);
    let log = "";
    if(e.healthCareDistrict == SEARCHAREA) {
      log += `New death in ${SEARCHAREA} on ${dt.toUTCString()} :(`;
      console.log("\x1b[31m", log);
    }
  })
}
  if(recovered.length > COUNTERS.recovered) {
  recovered.forEach(e => {
    let dt = new Date(e.date);
    let log = "";
    if(e.healthCareDistrict == SEARCHAREA) {
      log += `New recovery in ${SEARCHAREA} on ${dt.toUTCString()} :)`;
      console.log("\x1b[32m", log);
    }
  })
}

  COUNTERS.confirmed = confirmed.length;
  COUNTERS.deaths = deaths.length;
  COUNTERS.recovered = recovered.length;
}

const getInfectionSourceText = (id, infected) => {
  let related = infected.find(i => i.id = id);
  let dt = new Date(related.date);
  return `case reported on ${dt.toUTCString()} in ${related.healthCareDistrict}`;
}

const initCounters = () => {
  if(fs.existsSync("./counters.json"))
  fs.writeFile("test.txt", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
});
}


check();
setInterval(() => {
  check();
}, 1000 * 60 * 5);