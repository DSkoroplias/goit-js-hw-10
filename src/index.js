import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './components/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));

function inputSearch(event) {
  const inputValue = event.target.value.trim();

  if (!inputValue) {
    clearInput();
    return;
  }
  fetchCountries(inputValue)
    .then(res => {
      console.log('res :>> ', res);

      const resLength = res.length;
      if (resLength === 1) {
        createCountryCard(res);
        return;
      }

      if (resLength > 2 && res.length <= 10) {
        createListCountry(res);
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCountryCard(resLength) {
  const countryCardMarkup = resLength
    .map(({ name, capital, population, flags, languages }) => {
      let lang = '';
      for (let key in languages) {
        lang = languages[key];
      }
      return `<div class="country-info-card">
        <img class="country-flag" src="${flags.svg}" width="33" height="30" alt="flag">
        <h1 class="country-name">${name.official}</h1>
            </div>
        <div> <ul class="country-list">
                <li class="country-item">
                <h4>Capital:</h4> <span>${capital}</span>
                </li>
                <li class="country-item">
                <h4>Population:</h4> <span>${population}</span>
                </li>
                <li class="country-item">
                <h4>Languages: </h4><span>${lang}</span>
                </li>
                </ul>
        </div>`;
    })
    .join('');

  refs.countryInfoEl.insertAdjacentHTML('beforeend', countryCardMarkup);
}

function createListCountry(resLength) {
  const countryListMarkup = resLength
    .map(({ name, flags }) => {
      return `
    <li class="country-item"><img class="country-flag" src="${flags.svg}" alt="flag" width='20' height ='15' >${name.official}</li>
    `;
    })
    .join('');

  refs.listEl.insertAdjacentHTML('beforeend', countryListMarkup);
}

function clearInput() {
  refs.listEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
