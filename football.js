const key = 'ff1cf7c09emsh9d03a146d7f500ep1eccddjsn49ed21d9d25b';
const source = 'api-football-v1.p.rapidapi.com';
const urlAPI = 'https://api-football-v1.p.rapidapi.com/v2/topscorers/64';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

const strikersList = document.querySelector('#strikers')
const btn = document.querySelector('button');

// Make an AJAX request
function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      console.log(data);
      callback(data);
    }
  };
  if (url == urlAPI) { // API football requires setted request header
  xhr.setRequestHeader('x-rapidapi-host', source);
  xhr.setRequestHeader('x-rapidapi-key', key);
  }
  xhr.send();
}

// Generate HTML
function generateHTML(data) {
  const section = document.createElement('section')
  strikersList.appendChild(section);
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
}

// Receive information from Wiki
function getProfiles(json) {
    getJSON(wikiUrl + json.api.topscorers[0].firstname + ' ' + json.api.topscorers[0].lastname, generateHTML);
}


getJSON(urlAPI, getProfiles)
