import { z } from "zod";

export const profileFormSchema = z.object({
  firstname: z.string().trim().max(100).optional().or(z.literal("")),
  lastname: z.string().trim().max(100).optional().or(z.literal("")),
  phoneNumber: z.string().trim().max(20).optional().or(z.literal("")),
  currentAddress: z.string().trim().max(255).optional().or(z.literal("")),
  shippingAddress: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  zipCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;