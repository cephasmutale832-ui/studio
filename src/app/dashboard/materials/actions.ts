'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Material } from '@/lib/types';
import { redirect } from 'next/navigation';

const materialsFilePath = path.join(process.cwd(), 'src', 'lib', 'materials.json');

async function getMaterials(): Promise<Material[]> {
    try {
        const fileContents = await fs.readFile(materialsFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data.materials || [];
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
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


interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function deleteMaterialAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const materialId = formData.get('materialId') as string;
    
    if (!materialId) {
        return { success: false, message: 'Material ID is missing.' };
    }

    const materials = await getMaterials();
    const updatedMaterials = materials.filter(m => m.id !== materialId);

    if(materials.length === updatedMaterials.length) {
        return { success: false, message: 'Material not found.' };
    }

    await saveMaterials(updatedMaterials);
    revalidatePath('/dashboard');
    return { success: true, message: 'Material deleted successfully.' };
}


const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  subject: z.string().min(1, 'A subject is required.'),
  materialType: z.enum(['video', 'document', 'quiz', 'past-paper']),
});


interface UpdateFormState {
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

export async function updateMaterialAction(
  prevState: UpdateFormState | null,
  formData: FormData
): Promise<UpdateFormState> {
  const validatedFields = updateSchema.safeParse({
    id: formData.get('id'),
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

  const { id, materialType, title, description, subject } = validatedFields.data;

  const materials = await getMaterials();
  const materialIndex = materials.findIndex(m => m.id === id);

  if (materialIndex === -1) {
    return { success: false, message: 'Material not found.' };
  }

  const updatedMaterial: Material = {
    ...materials[materialIndex],
    title,
    description: description || '',
    subject,
    type: materialType,
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
    updatedMaterial.url = validatedUrlResult.data;
  } else if (materialType === 'quiz') {
      updatedMaterial.url = '';
  }
  
  try {
    materials[materialIndex] = updatedMaterial;
    await saveMaterials(materials);
  } catch (error) {
      console.error('Failed to update material:', error);
      return { success: false, message: 'An unexpected error occurred while saving the material.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/materials/edit/${id}`);
  redirect('/dashboard');
}