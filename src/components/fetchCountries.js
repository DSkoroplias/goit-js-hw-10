const URL = 'https://restcountries.com/v3.1/name/';

export function fetchCountries(name) {
  return fetch(
    `${URL}${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    console.log('response :>> ', response);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}
