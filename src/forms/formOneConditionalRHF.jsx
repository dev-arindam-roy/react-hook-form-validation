import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function FormOne() {
  const { register, watch, handleSubmit, clearErrors, formState: { errors } } = useForm();

  const hasPhone = watch("hasPhone"); // watch checkbox

  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    if (!hasPhone) {
      clearErrors("phone"); // 👈 clears validation error when unchecked
    }
  }, [hasPhone, clearErrors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input type="checkbox" {...register("hasPhone")} />
        Do you want to provide phone number?
      </label>

      {hasPhone && (
        <div>
          <input
            {...register("phone", {
              required: hasPhone ? "Phone is required" : false,
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone must be 10 digits"
              }
            })}
            placeholder="Enter phone number"
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
