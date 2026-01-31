
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { type Material } from '@/lib/types';
import { redirect } from 'next/navigation';
import { getMaterials, saveMaterials } from '@/lib/materials';

interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function deleteMaterialAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const materialId = formData.get('materialId') as string;
    
    if (!materialId) {
        return { success: false, message: 'Material ID is missing.' };
    }
    try {
        const materials = await getMaterials();
        const updatedMaterials = materials.filter(m => m.id !== materialId);

        if(materials.length === updatedMaterials.length) {
            return { success: false, message: 'Material not found.' };
        }

        await saveMaterials(updatedMaterials);
        revalidatePath('/dashboard');
        return { success: true, message: 'Material deleted successfully.' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error('Failed to delete material:', error);
        return { success: false, message };
    }
}


const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  subject: z.string().min(1, 'A subject is required.'),
  materialType: z.enum(['video', 'document', 'quiz', 'past-paper']),
  topic: z.string().optional(),
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
        topic?: string[];
        referenceText?: string[];
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
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { id, materialType, title, description, subject, topic } = validatedFields.data;

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
      topic: topic === 'general' ? '' : topic || '',
    };
    
    if (materialType === 'video' || materialType === 'document') {
      updatedMaterial.referenceText = formData.get('referenceText') as string || '';
    } else {
      // Clear reference text if material type is not video or document
      updatedMaterial.referenceText = undefined;
    }

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
    
    materials[materialIndex] = updatedMaterial;
    await saveMaterials(materials);

  } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred while saving the material.';
      console.error('Failed to update material:', error);
      return { success: false, message };
  }
  
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/materials/edit/${prevState?.message.split(' ').pop()}`);
  redirect('/dashboard');
}
