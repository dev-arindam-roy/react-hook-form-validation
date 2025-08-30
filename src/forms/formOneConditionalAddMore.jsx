import React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup schema
const schema = yup.object().shape({
  contacts: yup.array().of(
    yup.object().shape({
      type: yup.string().required("Type is required"),
      hasPhone: yup.boolean(),
      phone: yup.string().when("hasPhone", {
        is: true,
        then: (schema) =>
          schema
            .required("Phone is required")
            .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ),
});

export default function FormOne() {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      contacts: [{ type: "", hasPhone: false, phone: "" }], // start with 1 field
    },
    shouldUnregister: true, // unregister hidden fields
  });

  const { control, register, handleSubmit, watch, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const onSubmit = (data) => console.log("Form Data:", data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => {
          const hasPhone = watch(`contacts.${index}.hasPhone`);
          return (
            <div key={item.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
              <label>
                Contact Type:
                <input
                  {...register(`contacts.${index}.type`)}
                  placeholder="Type"
                />
              </label>
              {errors.contacts?.[index]?.type && (
                <p style={{ color: "red" }}>{errors.contacts[index].type.message}</p>
              )}

              <label>
                <input type="checkbox" {...register(`contacts.${index}.hasPhone`)} />
                Provide Phone?
              </label>

              {hasPhone && (
                <div>
                  <input
                    {...register(`contacts.${index}.phone`)}
                    placeholder="Phone Number"
                  />
                  {errors.contacts?.[index]?.phone && (
                    <p style={{ color: "red" }}>{errors.contacts[index].phone.message}</p>
                  )}
                </div>
              )}

              <button type="button" onClick={() => remove(index)}>❌ Remove</button>
            </div>
          );
        })}

        <button type="button" onClick={() => append({ type: "", hasPhone: false, phone: "" })}>
          ➕ Add More
        </button>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </FormProvider>
  );
}
