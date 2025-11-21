import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  fieldName,
}) => {
  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <div
      className={`relative space-y-2 rounded-lg transition-all duration-300 ${
        error ? 'p-1 bg-red-100 border-2 border-red-600' : ''
      }`}
      data-field-name={fieldName}
    >
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Listbox.Label>
          <Listbox.Button
            className={`relative mt-2 w-full cursor-default rounded-lg bg-transparent py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-50 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? 'bg-[#7c59b2]/20 text-primary-500'
                        : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;


