import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoiceFormItemsProps {
  control: Control<InvoiceFormValues>;
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
}

export function InvoiceFormItems({ control, register, errors }: InvoiceFormItemsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">Pozycje</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            append({
              description: "",
              quantity: 1,
              unit: "szt",
              netPrice: "0.00",
              vatRate: "23",
            })
          }
        >
          Dodaj pozycję
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-3 rounded-md border border-[#E5E5E5] p-4 dark:border-[#262626]">
          <FormField
            label="Opis"
            htmlFor={`items.${index}.description`}
            error={errors.items?.[index]?.description?.message}
          >
            <Input id={`items.${index}.description`} {...register(`items.${index}.description`)} />
          </FormField>

          <div className="grid gap-3 md:grid-cols-4">
            <FormField
              label="Ilość"
              htmlFor={`items.${index}.quantity`}
              error={errors.items?.[index]?.quantity?.message}
            >
              <Input
                id={`items.${index}.quantity`}
                type="number"
                step="0.01"
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              />
            </FormField>

            <div className="space-y-2">
              <label
                htmlFor={`items.${index}.unit`}
                className="text-sm font-medium text-black/80 dark:text-white/80"
              >
                Jednostka
              </label>
              <select
                id={`items.${index}.unit`}
                className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                {...register(`items.${index}.unit`)}
              >
                <option value="szt">szt</option>
                <option value="godz">godz</option>
                <option value="km">km</option>
              </select>
            </div>

            <FormField
              label="Cena netto"
              htmlFor={`items.${index}.netPrice`}
              error={errors.items?.[index]?.netPrice?.message}
            >
              <Input id={`items.${index}.netPrice`} {...register(`items.${index}.netPrice`)} />
            </FormField>

            <div className="space-y-2">
              <label
                htmlFor={`items.${index}.vatRate`}
                className="text-sm font-medium text-black/80 dark:text-white/80"
              >
                Stawka VAT
              </label>
              <select
                id={`items.${index}.vatRate`}
                className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                {...register(`items.${index}.vatRate`)}
              >
                <option value="23">23%</option>
                <option value="8">8%</option>
                <option value="5">5%</option>
                <option value="0">0%</option>
                <option value="zw">zw</option>
                <option value="np">np</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Usuń pozycję
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
