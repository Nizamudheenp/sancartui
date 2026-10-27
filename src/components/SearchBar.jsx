import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({
  value = '',
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  autoFocus = false,
  disabled = false,
}) => {
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center flex-1 ${className}`}
    >
      {/* Left Search Icon */}
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className={`w-full pl-11 ${
          value ? 'pr-10' : 'pr-4'
        } py-2.5 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 shadow-sm transition ${inputClassName}`}
      />

      {/* Right Control: Clear (✕) */}
      {value && onClear && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition active:scale-90"
            title="Clear search"
          >
            <FiX size={13} />
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
