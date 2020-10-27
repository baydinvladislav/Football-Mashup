const key = 'ff1cf7c09emsh9d03a146d7f500ep1eccddjsn49ed21d9d25b';
const source = 'api-football-v1.p.rapidapi.com';
const urlAPI = 'https://api-football-v1.p.rapidapi.com/v2/topscorers/754';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

const strikersList = document.querySelector('#strikers')
const btn = document.querySelector('button');

// Make an AJAX requests
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
    if (url == urlAPI) { // API football requires setted request header
    xhr.setRequestHeader('x-rapidapi-host', source);
    xhr.setRequestHeader('x-rapidapi-key', key);
    }
    xhr.onerror = () => reject( Error('A network error occured') );
    xhr.send();
  });
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
    return getJSON(wikiUrl + json.api.topscorers[0].firstname + ' ' + json.api.topscorers[0].lastname);
}


btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...'

  getJSON(urlAPI)
    .then(getProfiles)
    .then(generateHTML)
    .catch( err => {
      strikersList.innerHTML = '<h3>Something went wrong!</h3>'
      console.log(err)
    })
    .finally( () =>  event.target.remove() )
});
