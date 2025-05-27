import { InputSection } from "./ui/input-section";

interface VerificationCodeInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
  }
  
  export function VerificationCodeInput({
    value,
    onChange,
    placeholder = "123456",
    required,
    className
  }: VerificationCodeInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      onChange(value);
    };
  
    return (
      <InputSection
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={className}
        maxLength={6}
        required={required}
      />
    );
  }