// Minimal hierarchical location data for cascading Country → Province/State → City dropdowns.
// Designed to be small, readable, and easy to extend over time.
//
// NOTE: This is intentionally not exhaustive. It covers a handful of
// commonly used countries and regions relevant to current deployments.

export const locationData = {
  China: {
    provinces: {
      Yunnan: ['Kunming', 'Dali', 'Lijiang'],
      Beijing: ['Beijing'],
      Shanghai: ['Shanghai'],
      Guangdong: ['Guangzhou', 'Shenzhen', 'Foshan'],
      Sichuan: ['Chengdu', 'Mianyang'],
    },
  },
  'United States': {
    provinces: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego'],
      'New York': ['New York City', 'Buffalo'],
      'Texas': ['Houston', 'Dallas', 'Austin'],
      'Washington': ['Seattle'],
    },
  },
  Canada: {
    provinces: {
      'British Columbia': ['Vancouver', 'Victoria'],
      Ontario: ['Toronto', 'Ottawa'],
      Quebec: ['Montreal', 'Quebec City'],
    },
  },
  'United Kingdom': {
    provinces: {
      England: ['London', 'Manchester', 'Birmingham'],
      Scotland: ['Edinburgh', 'Glasgow'],
      Wales: ['Cardiff', 'Swansea'],
    },
  },
  Australia: {
    provinces: {
      'New South Wales': ['Sydney', 'Newcastle'],
      Victoria: ['Melbourne', 'Geelong'],
      Queensland: ['Brisbane', 'Gold Coast'],
    },
  },
};

export const getCountryOptions = () =>
  Object.keys(locationData).map((name) => ({
    value: name,
    label: name,
  }));

export const getProvinceOptions = (country) => {
  const countryInfo = locationData[country];
  if (!countryInfo || !countryInfo.provinces) return [];

  return Object.keys(countryInfo.provinces).map((name) => ({
    value: name,
    label: name,
  }));
};

export const getCityOptions = (country, province) => {
  const countryInfo = locationData[country];
  if (!countryInfo || !countryInfo.provinces) return [];

  const cities = countryInfo.provinces[province];
  if (!cities) return [];

  return cities.map((name) => ({
    value: name,
    label: name,
  }));
};


