import { z } from "zod";

// Custom type to handle both File objects and string URLs
export const FileOrString = z.union([
  z.instanceof(File),
  z.string(),
  z.object({}).optional(), // Empty object for initial state
]);

// Schema for location images
const LocationImageSchema = z.object({
  _id: z.string().optional(),
  image: FileOrString,
  location: z.string().min(1, "Location name is required"),
});

// Schema for document sections
const DocumentSchema = z.object({
  _id: z.string().optional(),
  icon: FileOrString,
  title: z.string().min(1, "Document title is required"),
  details: z.array(z.string()).min(1, "At least one detail is required"),
});

// Schema for notes
const NoteSchema = z.object({
  text: z.string().optional(),
});

// Main visa form schema
export const VisaFormSchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  visaType: z.string().min(1, "Visa type is required"),
  customId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  
  // Images can be File objects or string URLs
  images: z.array(FileOrString),
  locationImages: z.array(LocationImageSchema),
  
  // General information
  capital: z.string().min(1, "Capital is required"),
  time: z.string().min(1, "Local time is required"),
  telephone_code: z.string().min(1, "Telephone code is required"),
  bank_time: z.string().min(1, "Bank time is required"),
  embassy_address: z.string().min(1, "Embassy address is required"),
  
  // Notes
  note: z.array(NoteSchema),
  
  // Document sections
  general_documents: z.array(DocumentSchema),
  business_person: z.array(DocumentSchema),
  student: z.array(DocumentSchema),
  job_holder: z.array(DocumentSchema),
  other_documents: z.array(DocumentSchema),
  
  // Visa price information
  visaPrice_mainText: z.string().min(1, "Visa price main text is required"),
  visaPrice_price: z.string().min(1, "Visa price is required"),
  visaPrice_note: z.string().min(1, "Visa price note is required"),
});

// Export the type for use with react-hook-form
export type VisaFormData = z.infer<typeof VisaFormSchema>;
