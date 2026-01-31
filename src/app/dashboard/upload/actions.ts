
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
        url?: string[];
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
    imageId: '', // No longer assign a random placeholder image
    url: '',
  };

  if (materialType === 'video' || materialType === 'document' || materialType === 'past-paper') {
    const url = formData.get('url') as string;
    const urlSchema = z.string().url({ message: 'Please provide a valid URL.' }).min(1, 'A URL is required for this material type.');
    const validatedUrlResult = urlSchema.safeParse(url);
    if (!validatedUrlResult.success) {
        return { 
            success: false, 
            message: 'Invalid URL provided.', 
            errors: { url: validatedUrlResult.error.flatten().formErrors } 
        };
    }
    newMaterial.url = validatedUrlResult.data;
  } else if (materialType === 'quiz') {
      // No URL needed for a quiz in this implementation
  }
  
  try {
    const materials = await getMaterials();
    materials.unshift(newMaterial); // Add to the beginning of the array
    await saveMaterials(materials);

    revalidatePath('/dashboard'); // This is important to refresh the dashboard data

    const successMessage = `Successfully saved material "${title}"!`;

    return { success: true, message: successMessage };
  } catch (error) {
      console.error('Failed to save material:', error);
      return { success: false, message: 'An unexpected error occurred while saving the material.' };
  }
}
