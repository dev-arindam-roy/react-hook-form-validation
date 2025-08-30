import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define Yup schema with conditional validation
const schema = yup.object().shape({
  hasPhone: yup.boolean(),
  phone: yup.string().when("hasPhone", {
    is: true, // validation runs only if hasPhone === true
    then: (schema) =>
      schema
        .required("Phone is required")
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function FormOne() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      hasPhone: false,
      phone: "",
    },
    shouldUnregister: true, // optional: unregister hidden fields
  });

  const hasPhone = watch("hasPhone");

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input type="checkbox" {...register("hasPhone")} />
        Do you want to provide phone number?
      </label>

      {hasPhone && (
        <div>
          <input
            {...register("phone")}
            placeholder="Enter phone number"
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
