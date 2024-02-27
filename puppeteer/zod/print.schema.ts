import { z } from 'zod';

const localStorageDataSchema = z.record(z.unknown()); // Assuming any value is allowed in localStorageData
const sessionStorageDataSchema = z.record(z.string()); // Assuming sessionStorageData values are strings
const cookieSchema = z.array(z.object({ // Define the cookie schema structure
    name: z.string(),
    value: z.string(),
    // ... other cookie properties you want to validate
}));

const printSchema = z.object({
    url: z.string().min(1), // Ensure url is a non-empty string
    selector: z.string().optional(), // Selector is optional and should be a string if present
    localStorageData: localStorageDataSchema.optional(), // Validate localStorageData using the defined schema
    sessionStorageData: sessionStorageDataSchema.optional(), // Validate sessionStorageData using the defined schema
    cookies: cookieSchema.optional(), // Validate cookies using the defined schema
});

export { printSchema };
