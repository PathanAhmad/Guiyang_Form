import React from 'react';

/**
 * TableInput Component
 * Renders a grid/table for questions with multiple row options and rating columns
 * Used for questions like "Rate each challenge on a scale of prevalence"
 * 
 * @param {string} label - The question label
 * @param {object} value - Object mapping row keys to selected column values
 * @param {function} onChange - Callback when selection changes
 * @param {array} rows - Array of row objects: { key: string, label: string }
 * @param {array} columns - Array of column objects: { value: string, label: string }
 * @param {boolean} required - Whether the field is required
 */
const TableInput = ({
  label,
  value = {},
  onChange,
  rows = [],
  columns = [],
  required = false,
}) => {
  const handleCellChange = (rowKey, columnValue) => {
    const newValue = {
      ...value,
      [rowKey]: columnValue,
    };
    onChange(newValue);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Challenge
              </th>
              {columns.map((col) => (
                <th
                  key={col.value}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr
                key={row.key}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300 font-medium">
                  {row.label}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.value}
                    className="px-4 py-3 text-center border-r border-gray-300 last:border-r-0"
                  >
                    <input
                      type="radio"
                      name={`table-${row.key}`}
                      value={col.value}
                      checked={value[row.key] === col.value}
                      onChange={() => handleCellChange(row.key, col.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {required && Object.keys(value).length === 0 && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  );
};

export default TableInput;


