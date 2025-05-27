import { InputSection } from "./ui/input-section";

interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
  }
  
  export function PhoneNumberInput({
    value,
    onChange,
    placeholder = "0123 4567890",
    required,
    className
  }: PhoneNumberInputProps) {
    const formatPhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length >= 9) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      } else if (digits.length >= 7) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      } else if (digits.length >= 4) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      }
      return digits;
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };
  
    return (
      <InputSection
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={className}
        required={required}
      />
    );
  }