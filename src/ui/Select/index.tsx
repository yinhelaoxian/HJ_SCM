import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  style?: React.CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  style = {},
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{
        background: '#1E2D45',
        borderColor: '#2D3E50',
        color: '#E8EDF4',
        minWidth: '120px',
        ...style,
      }}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          style={{
            background: '#1E2D45',
            color: '#E8EDF4',
          }}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
export type { SelectProps, SelectOption };
