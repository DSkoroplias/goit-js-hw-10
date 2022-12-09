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
  clearList();
  if (!inputValue) {
    return;
  }
  fetchCountries(inputValue)
    .then(res => {
      console.log('res :>> ', res);

      const resLength = res.length;
      if (resLength === 1) {
        createCountryMarkup(res);
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

function createCountryMarkup(countries) {
  const markup = countries
    .map(
      country =>
        `<div class="country-info-card">
        <img class="country-flag" src="${
          country.flags.svg
        }" width="33" height="30" alt="flag">
        <h1 class="country-name">${country.name.official}</h1>
            </div>
        <div> <ul class="country-list">
                <li class="country-item">
                <h4>Capital:</h4> <span>${country.capital}</span>
                </li>
                <li class="country-item">
                <h4>Population:</h4> <span>${country.population}</span>
                </li>
                <li class="country-item">
                <h4>Languages: </h4><span>${Object.values(
                  country.languages
                ).join(', ')}}</span>
                </li>
                </ul>
        </div>`
    )
    .join('');

  refs.countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

function createListCountry(countries) {
  const markup = countries
    .map(
      country =>
        `<li class="country-item"><img class="country-flag" src="${country.flags.svg}" alt="flag" width='20' height ='15' >${country.name.official}</li>`
    )
    .join('');

  refs.countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

function clearList() {
  refs.listEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
