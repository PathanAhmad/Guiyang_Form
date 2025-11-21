import React from 'react';
import Select from './Select';
import {
  getCountryOptions,
  getProvinceOptions,
  getCityOptions,
  getCountryNameByCode,
  getProvinceNameByCode,
} from '../../../../../utils/locationData';

const LocationDropdowns = ({
  label,
  countryLabel,
  provinceLabel,
  cityLabel,
  countryPlaceholder,
  provincePlaceholder,
  cityPlaceholder,
  countryValue,
  provinceValue,
  cityValue,
  onChange, // ({ country, province, city, displayValue }) => void
  required,
  error,
  fieldName = 'location',
  containerClassName,
}) => {
  const countryOptions = getCountryOptions();
  const provinceOptions = countryValue ? getProvinceOptions(countryValue) : [];
  const cityOptions =
    countryValue && provinceValue
      ? getCityOptions(countryValue, provinceValue)
      : [];

  const handleCountryChange = (nextCountryIsoCode) => {
    const next = {
      country: nextCountryIsoCode || '',
      province: '',
      city: '',
    };
    const displayValue = getCountryNameByCode(next.country);
    onChange({ ...next, displayValue });
  };

  const handleProvinceChange = (nextProvinceIsoCode) => {
    const next = {
      country: countryValue || '',
      province: nextProvinceIsoCode || '',
      city: '',
    };
    const displayValue = [
      getCountryNameByCode(next.country),
      getProvinceNameByCode(next.country, next.province),
    ]
      .filter(Boolean)
      .join(' | ');
    onChange({ ...next, displayValue });
  };

  const handleCityChange = (nextCity) => {
    const next = {
      country: countryValue || '',
      province: provinceValue || '',
      city: nextCity || '',
    };
    const displayValue = [
      getCountryNameByCode(next.country),
      getProvinceNameByCode(next.country, next.province),
      next.city,
    ]
      .filter(Boolean)
      .join(' | ');
    onChange({ ...next, displayValue });
  };

  return (
    <div
      className={`relative  px-4 pt-6 rounded-lg transition-all duration-300 ${
        error
          ? '!bg-red-100 !border-4 !border-red-600'
          : 'border-2 border-transparent'
      } ${containerClassName || ''}`}
      data-field-name={fieldName}
      style={
        error
          ? {
              borderColor: '#DC2626',
              borderWidth: '4px',
              borderStyle: 'solid',
              backgroundColor: '#FEE2E2',
            }
          : {}
      }
    >
      {error && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
      )}

      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 mb-6 mx-0">
        <Select
          label={countryLabel}
          value={countryValue || ''}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder={countryPlaceholder}
          required={required}
          error={error}
          fieldName={fieldName}
        />

        <Select
          label={provinceLabel}
          value={provinceValue || ''}
          onChange={handleProvinceChange}
          options={provinceOptions}
          placeholder={provincePlaceholder}
          required={required}
          error={error}
          fieldName={fieldName}
        />

        <Select
          label={cityLabel}
          value={cityValue || ''}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder={cityPlaceholder}
          required={required}
          error={error}
          fieldName={fieldName}
        />
      </div>
    </div>
  );
};

export default LocationDropdowns;


