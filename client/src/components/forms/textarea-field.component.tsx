import type { InputHTMLAttributes } from "react";
import StackLayout from "../compositions/stack-layouts/stack-layout.component";

type TextAreaFieldProps = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  errorMessage?: string;
};

const TextAreaField = ({
  label,
  errorMessage,
  ...restTextAreaFieldProps
}: TextAreaFieldProps) => {
  return (
    <StackLayout>
      <label htmlFor={label}>{label}</label>

      <textarea id={label} rows={30} cols={30} {...restTextAreaFieldProps} />

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </StackLayout>
  );
};

export default TextAreaField;
