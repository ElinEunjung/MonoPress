import type { SelectHTMLAttributes } from "react";
import StackLayout from "../compositions/stack-layouts/stack-layout.component";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  errorMessage: string;
};

const SelectField = ({
  label,
  errorMessage,
  options,
  ...restProps
}: SelectFieldProps) => {
  return (
    <StackLayout>
      <label htmlFor={label}>{label}</label>
      <select id={label} {...restProps}>
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </StackLayout>
  );
};

export default SelectField;
