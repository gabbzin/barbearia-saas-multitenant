import {
  Control,
  Controller,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
  control?: Control<T>;
  classname?: string;
  disabled?: boolean;
  mask?: "currency";
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const InputForm = <T extends FieldValues>({
  label,
  type = "text",
  name,
  placeholder,
  control: propsControl,
  classname,
  disabled,
  mask,
}: InputFormProps<T>) => {
  const context = useFormContext<T>();
  const control = propsControl || context?.control;

  if (!control) {
    throw new Error(
      "InputForm deve ser usado dentro de um FormProvider ou receber a prop 'control'.",
    );
  }

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ...field }, fieldState }) => {
          const inputValue =
            mask === "currency" && value !== undefined
              ? // Se for currency, formata o número que está no form para Texto (R$)
                formatCurrency(Number(value))
              : (value ?? "");
          return (
            <>
              <Label
                htmlFor={name}
                className={fieldState.error && "text-red-500"}
              >
                {label}
              </Label>
              <Input
                type={type}
                placeholder={placeholder}
                className={classname}
                disabled={disabled}
                {...field}
                value={inputValue}
                onChange={(e) => {
                  if (mask === "currency") {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    const numberValue = Number(rawValue) / 100;
                    onChange(numberValue);
                  } else {
                    onChange(e);
                  }
                }}
              />
              <p className="text-sm text-red-500">
                {fieldState.error?.message}
              </p>
            </>
          );
        }}
      />
    </div>
  );
};

export default InputForm;
