
'use server';

import { z } from 'zod';

const ACCEPTED_DOCUMENT_TYPES = [
    'application/pdf', 
    'text/plain', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  subject: z.string().min(2, 'Subject must be at least 2 characters.'),
  materialType: z.enum(['video', 'document', 'quiz', 'past-paper']),
});

interface FormState {
    success: boolean | null;
    message: string;
    errors?: {
        title?: string[];
        description?: string[];
        subject?: string[];
        materialType?: string[];
        file?: string[];
        'gdrive-link'?: string[];
    }
}

export async function uploadMaterialAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = uploadSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    subject: formData.get('subject'),
    materialType: formData.get('materialType'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { materialType, title, description, subject } = validatedFields.data;

  // In a real app, this data would be saved to a database.
  // For now, we'll just log it to the console.
  console.log('--- Saving Material ---');
  console.log('Title:', title);
  console.log('Description:', description);
  console.log('Subject:', subject);
  console.log('Type:', materialType);

  if (materialType === 'video') {
    const gdriveLink = formData.get('gdrive-link') as string;
    if (!gdriveLink || !gdriveLink.startsWith('https://drive.google.com/')) {
        return { success: false, message: 'Invalid Google Drive link.', errors: { 'gdrive-link': ['Please provide a valid Google Drive share link.'] } };
    }
    console.log('Google Drive Link:', gdriveLink);
    console.log('--------------------------');
    return { success: true, message: `Successfully saved video material "${title}"!` };

  } else if (materialType === 'document' || materialType === 'past-paper') {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
        return { success: false, message: 'A file is required for this material type.', errors: { file: ['Please select a file to upload.'] } };
    }

    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
        return { success: false, message: 'Invalid file type.', errors: { file: [`Only PDF, DOC, and TXT files are allowed. You provided: ${file.type}`] } };
    }

    // In a real app, you would handle file storage here (e.g., upload to Firebase Storage)
    console.log('File Name:', file.name);
    console.log('File Size:', file.size);
    console.log('File Type:', file.type);
    console.log('--------------------------');

    return { success: true, message: `Successfully uploaded "${file.name}"!` };
    
  } else if (materialType === 'quiz') {
      // No file or link needed for a quiz in this implementation
      console.log('--------------------------');
      return { success: true, message: `Successfully saved quiz "${title}"!` };
  }
  
  // This should not be reached
  return { success: false, message: 'Invalid material type specified.' };
}
