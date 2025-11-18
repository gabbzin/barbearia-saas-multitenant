import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
  control: Control<T>;
}

const InputForm = <T extends FieldValues>({
  label,
  type = "text",
  name,
  placeholder,
  control,
}: InputFormProps<T>) => {
  return (
    <div>
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input type={type} placeholder={placeholder} {...field} />
            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
          </>
        )}
      />
    </div>
  );
};

export default InputForm;
