"use client";

import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CheckboxFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control?: Control<T>;
  classname?: string;
  disabled?: boolean;
}

const CheckboxForm = <T extends FieldValues>({
  label,
  name,
  control: propsControl,
  classname,
  disabled,
}: CheckboxFormProps<T>) => {
  const context = useFormContext<T>();
  const control = propsControl || context?.control;

  if (!control) {
    throw new Error(
      "CheckboxForm deve ser usado dentro de um FormProvider ou receber a prop 'control'.",
    );
  }

  return (
    <div className={classname}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ...field }, fieldState }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                checked={value}
                onCheckedChange={onChange}
                disabled={disabled}
                {...field}
              />
              <Label
                htmlFor={name}
                className={fieldState.error && "text-red-500"}
              >
                {label}
              </Label>
            </div>
            {fieldState.error && (
              <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CheckboxForm;
