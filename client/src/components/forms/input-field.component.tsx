import type { InputHTMLAttributes } from "react";
import StackLayout from "../compositions/stack-layouts/stack-layout.component";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  errorMessage?: string;
};

const InputField = ({
  label,
  errorMessage,
  ...restInputFieldProps
}: InputFieldProps) => {
  return (
    <StackLayout gap="0">
      <label htmlFor={label}>{label}</label>
      <input id={label} {...restInputFieldProps} />

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </StackLayout>
  );
};

export default InputField;
