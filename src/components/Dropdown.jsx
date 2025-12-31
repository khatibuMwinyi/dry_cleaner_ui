import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select an option",
  required = false,
  className = "",
  getOptionLabel = (option) => option.label || option.name || String(option),
  getOptionValue = (option) => option.value || option._id || option,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(
    (option) => getOptionValue(option) === value
  );

  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border-b-2 rounded-lg bg-white text-left flex items-center justify-between required "
      >
        <span>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              const isSelected = optionValue === value;

              return (
                <button
                  key={optionValue || index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[#2D3A58] hover:text-white transition-colors ${
                    isSelected
                      ? "bg-[#2D3A58] text-white"
                      : "text-gray-900"
                  }`}
                >
                  {optionLabel}
                </button>
              );
            })
          )}
        </div>
      )}

      {required && !value && (
        <input
          type="text"
          required
          className="sr-only"
          tabIndex={-1}
          value=""
          onChange={() => {}}
          aria-invalid="true"
        />
      )}
    </div>
  );
};

export default Dropdown;

