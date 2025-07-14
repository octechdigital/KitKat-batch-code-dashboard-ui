import React from "react";

interface UseFormStateProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
}

interface UseFormStateReturn {
  value: string;
  setValue: (newValue: string) => void;
  onChange: (newValue: string) => void;
}

export function useFormState({
  value,
  onChange,
}: UseFormStateProps): UseFormStateReturn {
  const [fieldValue, setFieldValue] = React.useState(value);

  const handleChange = (newValue: string) => {
    setFieldValue(newValue);
    onChange(newValue);
  };

  return {
    value: fieldValue,
    setValue: (newValue: string) => setFieldValue(newValue),
    onChange: handleChange,
  };
}
