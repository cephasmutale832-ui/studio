
'use server';

import { z } from 'zod';

const ACCEPTED_FILE_TYPES = [
    'video/mp4', 
    'application/pdf', 
    'text/plain', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  materialType: z.enum(['video', 'document']),
});

interface FormState {
    success: boolean | null;
    message: string;
    errors?: {
        title?: string[];
        description?: string[];
        materialType?: string[];
        file?: string[];
    }
}

export async function uploadMaterialAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = uploadSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    materialType: formData.get('materialType'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const file = formData.get('file') as File;
  if (!file || file.size === 0) {
      return { success: false, message: 'A file is required for upload.', errors: { file: ['Please select a file to upload.'] } };
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return { success: false, message: 'Invalid file type.', errors: { file: [`Only MP4, PDF, DOC, and TXT files are allowed. You provided: ${file.type}`] } };
  }

  // In a real app, you would handle file storage here (e.g., upload to Firebase Storage)
  console.log('--- Uploading Material ---');
  console.log('Title:', validatedFields.data.title);
  console.log('Description:', validatedFields.data.description);
  console.log('Type:', validatedFields.data.materialType);
  console.log('File Name:', file.name);
  console.log('File Size:', file.size);
  console.log('File Type:', file.type);
  console.log('--------------------------');


  return { success: true, message: `Successfully uploaded "${file.name}"!` };
}
