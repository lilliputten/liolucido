import { z, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export function makeAllFieldsCoerced<T extends ZodRawShape>(
  schema: ZodObject<T>,
): ZodObject<{ [K in keyof T]: ZodTypeAny }> {
  const newShape: Partial<{ [K in keyof T]: ZodTypeAny }> = {};

  for (const key in schema.shape) {
    if (Object.prototype.hasOwnProperty.call(schema.shape, key)) {
      const field = schema.shape[key];

      // Check optional and nullable modifiers
      const isOptional = field.isOptional();
      const isNullable = field.isNullable();

      // Determine base type for coercion
      let baseField = field;
      // If optional or nullable, unwrap to get base type
      if (isOptional) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        baseField = (baseField as any)._def.innerType || baseField;
      }
      if (isNullable) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        baseField = (baseField as any)._def.innerType || baseField;
      }

      let coercedField: ZodTypeAny;

      if (baseField instanceof z.ZodNumber) {
        coercedField = z.coerce.number();
      } else if (baseField instanceof z.ZodBoolean) {
        coercedField = z.coerce.boolean();
      } else if (baseField instanceof z.ZodDate) {
        coercedField = z.coerce.date();
      } else if (baseField instanceof z.ZodBigInt) {
        coercedField = z.coerce.bigint();
      } else if (baseField instanceof z.ZodString) {
        coercedField = z.string(); // no string coercion in zod
      } else {
        // fallback: use original field
        coercedField = field;
      }

      // Reapply modifiers
      if (isNullable) coercedField = coercedField.nullable();
      if (isOptional) coercedField = coercedField.optional();

      newShape[key] = coercedField;
    }
  }

  return z.object(newShape as { [K in keyof T]: ZodTypeAny });
}

export function makeAllFieldsOptionalString<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newShape: { [K in keyof T]: z.ZodOptional<z.ZodString> } = {} as any;
  for (const key in schema.shape) {
    if (Object.prototype.hasOwnProperty.call(schema.shape, key)) {
      newShape[key as keyof T] = z.string().optional();
    }
  }
  return z.object(newShape);
}
