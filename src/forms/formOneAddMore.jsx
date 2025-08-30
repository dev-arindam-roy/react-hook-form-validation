import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function FormOne() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      users: [{ name: "", email: "" }] // start with 1 field
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users"
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {fields.map((item, index) => (
        <div key={item.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <input
            {...register(`users.${index}.name`, {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" }
            })}
            placeholder="Name"
          />
          {errors.users?.[index]?.name && (
            <p style={{ color: "red" }}>{errors.users[index].name.message}</p>
          )}

          <input
            {...register(`users.${index}.email`, {
              required: "Email is required",
              pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/, message: "Invalid email format" }
            })}
            placeholder="Email"
          />
          {errors.users?.[index]?.email && (
            <p style={{ color: "red" }}>{errors.users[index].email.message}</p>
          )}

          <button type="button" onClick={() => remove(index)}>❌ Remove</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: "", email: "" })}>
        ➕ Add More
      </button>

      <div style={{ marginTop: "1rem" }}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
