import { z } from "zod"

export const addressSchema = z.object({
  country_code: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address_1: z.string().min(1),
  address_2: z.string().nullish(),
  company: z.string().nullish(),
  city: z.string().min(1),
  province: z.string().nullish(),
  postal_code: z.string().min(1),
  phone: z.string().nullish(),
})
