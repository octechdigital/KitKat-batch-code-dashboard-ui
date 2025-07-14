import { useState } from "react";
import "./MultiSelect.scss";
interface MultiSelectProps {
  options: string[];
  placeholder?: string;
  value: string[]; // Add this prop to receive the selected options
  onChange: (value: string[]) => void; // Add this prop for change updates
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = "Select or add options...",
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddOption = (option: string) => {
    if (option.trim() && !value.includes(option)) {
      const newOptions = [...value, option];
      onChange(newOptions);
      setInputValue("");
    }
  };

  const handleRemoveOption = (option: string) => {
    const newOptions = value.filter((item) => item !== option);
    onChange(newOptions);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddOption(inputValue);
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(option)
  );

  return (
    <div className="multi-select-container">
      <div className="input-wrapper">
        {value.map((option, index) => (
          <div key={index} className="option-chip">
            {option}
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveOption(option)}
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          placeholder={value.length === 0 ? placeholder : ""}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
        />
      </div>
      {inputValue && filteredOptions.length > 0 && (
        <div className="options-list">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="option-item"
              onClick={() => handleAddOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
