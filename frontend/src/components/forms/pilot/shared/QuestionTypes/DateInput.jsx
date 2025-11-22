import React, { useRef, useState, useEffect } from 'react';

// Convert ISO yyyy-mm-dd to DD/MM/YYYY
const isoToDdMmYyyy = (iso) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

// Convert DD/MM/YYYY to ISO yyyy-mm-dd
const ddMmYyyyToIso = (display) => {
  if (!display || !/^\d{2}\/\d{2}\/\d{4}$/.test(display)) return '';
  const [d, m, y] = display.split('/');
  return `${y}-${m}-${d}`;
};

// Simple numeric mask to enforce DD/MM/YYYY while typing
const maskToDdMmYyyy = (raw) => {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const DateInput = ({ label, value, onChange, placeholder, required, error, fieldName }) => {
  const rootRef = useRef(null);
  const hiddenDateRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);

  // Determine the ISO value for the hidden native date input
  const inputIsoValue = (() => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const iso = ddMmYyyyToIso(value);
    return iso || '';
  })();

  // Determine the display value for the visible text input (always DD/MM/YYYY)
  const displayValue = (() => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return isoToDdMmYyyy(value);
    return value; // assume already DD/MM/YYYY
  })();

  const parseDisplayToDate = (display) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(display || '')) return null;
    const [d, m, y] = display.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const selectedDate = parseDisplayToDate(displayValue);
  const [monthDate, setMonthDate] = useState(() => selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date());

  useEffect(() => {
    if (selectedDate) {
      setMonthDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  const handleNativeChange = (e) => {
    const nextIso = e.target.value; // yyyy-mm-dd
    const nextDisplay = isoToDdMmYyyy(nextIso);
    onChange(nextDisplay || '');
  };

  const handleTextChange = (e) => {
    const masked = maskToDdMmYyyy(e.target.value);
    onChange(masked);
  };

  const openPicker = () => {
    setIsOpen(true);
  };

  // Close on outside click or Escape
  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMonthYearOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMonthYearOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const monthLabel = `${monthDate.toLocaleString(undefined, { month: 'long' })} ${monthDate.getFullYear()}`;

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const buildGrid = (refDate) => {
    const startOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    const startDay = startOfMonth.getDay();
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), 1 - startDay);
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const gridDates = buildGrid(monthDate);

  const monthNames = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString(undefined, { month: 'short' }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

  return (
    <div
      className={`relative space-y-2 p-4 rounded-lg transition-all duration-300 ${
        error ? '!bg-red-50/50' : 'border-2 border-transparent'
      }`}
      ref={rootRef}
      data-field-name={fieldName}
    >
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {/* Visible text input in DD/MM/YYYY */}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={openPicker}
          onClick={openPicker}
          placeholder={placeholder || 'DD / MM / YYYY'}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
            error ? '!border-red-400 !bg-white !ring-1 !ring-red-200' : 'border-gray-300'
          }`}
        />

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-72 select-none">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {!isMonthYearOpen ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-800 hover:text-[#7c59b2]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setIsMonthYearOpen(true)}
                  >
                    {monthLabel}
                  </button>
                ) : (
                  <>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={monthDate.getMonth()}
                      onChange={(e) => { setMonthDate(new Date(monthDate.getFullYear(), Number(e.target.value), 1)); setIsMonthYearOpen(false); }}
                    >
                      {monthNames.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={monthDate.getFullYear()}
                      onChange={(e) => { setMonthDate(new Date(Number(e.target.value), monthDate.getMonth(), 1)); setIsMonthYearOpen(false); }}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}
              >
                ›
              </button>
            </div>

            {/* Month grid remains below header */}

            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {gridDates.map((d) => {
                const inMonth = d.getMonth() === monthDate.getMonth();
                const isSelected = !!(selectedDate && d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth() && d.getDate() === selectedDate.getDate());
                const label = d.getDate();
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#7c59b2] text-white' : inMonth ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const dd = String(d.getDate()).padStart(2, '0');
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const yyyy = d.getFullYear();
                      onChange(`${dd}/${mm}/${yyyy}`);
                      setIsOpen(false);
                      setIsMonthYearOpen(false);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Hidden native date input kept for accessibility/fallback; not used for UI positioning */}
        <input ref={hiddenDateRef} type="date" value={inputIsoValue} onChange={handleNativeChange} tabIndex={-1} className="absolute w-0 h-0 p-0 m-0 opacity-0 pointer-events-none" aria-hidden="true" />
      </div>
      
      {error && (
        <div className="flex items-center gap-1 mt-1 p-1">
          <span className="text-red-600 text-sm">⚠️</span>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DateInput;
