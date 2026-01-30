
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Material } from '@/lib/types';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  subject: z.string().min(1, 'A subject is required.'),
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

const materialsFilePath = path.join(process.cwd(), 'src', 'lib', 'materials.json');

async function getMaterials(): Promise<Material[]> {
    try {
        const fileContents = await fs.readFile(materialsFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data.materials || [];
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
          // If file doesn't exist, create it with an empty array
          await saveMaterials([]);
          return [];
        }
        console.error("Error reading materials file:", error);
        return [];
    }
}

async function saveMaterials(materials: Material[]): Promise<void> {
    const data = { materials };
    await fs.writeFile(materialsFilePath, JSON.stringify(data, null, 2), 'utf8');
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

  const newMaterial: Material = {
    id: `material-${Date.now()}`,
    title,
    description: description || '',
    subject,
    type: materialType,
    imageId: `course-${Math.floor(Math.random() * 6) + 1}`, // Random placeholder image
    url: '',
  };

  if (materialType === 'video') {
    const gdriveLink = formData.get('gdrive-link') as string;
    if (!gdriveLink || !gdriveLink.startsWith('https://drive.google.com/')) {
        return { success: false, message: 'Invalid Google Drive link.', errors: { 'gdrive-link': ['Please provide a valid Google Drive share link.'] } };
    }
    newMaterial.url = gdriveLink;

  } else if (materialType === 'document' || materialType === 'past-paper') {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
        return { success: false, message: 'A file is required for this material type.', errors: { file: ['Please select a file to upload.'] } };
    }

    // In a real app, you would handle file storage here (e.g., upload to Firebase Storage)
    // For now, we are just saving the metadata. The URL remains empty.
    console.log('File Name:', file.name);
    console.log('File Size:', file.size);
    console.log('File Type:', file.type);
    
  } else if (materialType === 'quiz') {
      // No file or link needed for a quiz in this implementation
  }
  
  try {
    const materials = await getMaterials();
    materials.unshift(newMaterial); // Add to the beginning of the array
    await saveMaterials(materials);

    revalidatePath('/dashboard'); // This is important to refresh the dashboard data

    let successMessage = `Successfully saved material "${title}"!`;
    if (materialType === 'document' || materialType === 'past-paper') {
       successMessage = `Successfully uploaded metadata for "${title}"!`;
    }

    return { success: true, message: successMessage };
  } catch (error) {
      console.error('Failed to save material:', error);
      return { success: false, message: 'An unexpected error occurred while saving the material.' };
  }
}
