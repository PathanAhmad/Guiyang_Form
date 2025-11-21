import { Country, State, City } from 'country-state-city';

export const getCountryOptions = () =>
  Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

export const getProvinceOptions = (countryIsoCode) => {
  if (!countryIsoCode) return [];
  return State.getStatesOfCountry(countryIsoCode).map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));
};

export const getCityOptions = (countryIsoCode, stateIsoCode) => {
  if (!countryIsoCode || !stateIsoCode) return [];
  return City.getCitiesOfState(countryIsoCode, stateIsoCode).map((city) => ({
    value: city.name,
    label: city.name,
  }));
};

// Helper functions for getting names from codes
export const getCountryNameByCode = (isoCode) => {
  const country = Country.getCountryByCode(isoCode);
  return country ? country.name : '';
};

export const getProvinceNameByCode = (countryIsoCode, provinceIsoCode) => {
  if (!countryIsoCode || !provinceIsoCode) return '';
  const province = State.getStateByCodeAndCountry(provinceIsoCode, countryIsoCode);
  return province ? province.name : '';
};


