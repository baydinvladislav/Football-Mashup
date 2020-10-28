const key = 'ff1cf7c09emsh9d03a146d7f500ep1eccddjsn49ed21d9d25b';
const source = 'api-football-v1.p.rapidapi.com';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const idLeague = [775, 524, 754, 891, 766, 534, 566];
const urlAPI = 'https://api-football-v1.p.rapidapi.com/v2/topscorers/754';
const strikersList = document.querySelector('#strikers');
const btn = document.querySelector('button');
let championats = {
  'https://media.api-sports.io/football/leagues/39.png': 524, // England
  'https://media.api-sports.io/football/leagues/94.png': 766, // Portugal
  'https://media.api-sports.io/football/leagues/135.png': 891, // Italy
  'https://media.api-sports.io/football/leagues/78.png': 754, // Germany
  'https://media.api-sports.io/football/leagues/140.png': 775, // Spain
  'https://media.api-sports.io/football/leagues/333.png': 534, // Ukraine
  'https://media.api-sports.io/football/leagues/88.png': 566, // Netherlands
};




// Make an AJAX request for receive logos
function getLogos(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let logo = data.api.leagues[0].logo;
      callback(logo);
    }
  };
  xhr.setRequestHeader('x-rapidapi-host', source);
  xhr.setRequestHeader('x-rapidapi-key', key);
  xhr.send();
}

// Generate HTML for leagues
function generateLogos (picture) {
  const league = document.createElement('button');
  strikersList.appendChild(league);
  league.innerHTML = `
  <img src="${picture}" class="${picture}">
  `;
    league.addEventListener('click', (event) => {
      let id = event.target.className;
      while (strikersList.firstChild) {
        strikersList.removeChild(strikersList.firstChild);
      }
      getJSON(`https://api-football-v1.p.rapidapi.com/v2/topscorers/${String(championats[id])}`)
        .then(getProfiles)
        .then(generateHTML)
        .then(btn.remove())
        .catch( err => {
          strikersList.innerHTML = '<h3>Something went wrong!</h3>';
          console.log(err);
        })
        .finally( () =>  event.target.remove() );
      });
}

// Show available leagues
btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading... Wait...';
  // Timeout allows to avoid frequent query errors
  for (let i = 0; i < idLeague.length; i++) {
    setTimeout( () => { getLogos(`https://api-football-v1.p.rapidapi.com/v2/leagues/league/${idLeague[i]}`, generateLogos) }, 2000);
  }
});

// Make AJAX requests to Football API and Wiki API
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject( Error(xhr.statusText) );
      }
    };
    let checker = url.indexOf('api-football')
    if (checker !== -1) { // API football requires setted request header but Wiki gave error, use statement condition
    xhr.setRequestHeader('x-rapidapi-host', source);
    xhr.setRequestHeader('x-rapidapi-key', key);
    }
    xhr.onerror = () => reject( Error('A network error occured') );
    xhr.send();
  });
}

// Create HTML elements for our strikers
function generateHTML(data) {
  const section = document.createElement('section');
  strikersList.appendChild(section);
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
}

// Receive biography information from Wiki
function getProfiles(json) {
    return getJSON(wikiUrl + json.api.topscorers[0].firstname + ' ' + json.api.topscorers[0].lastname);
}
