
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Material } from '@/lib/types';
import { z } from 'zod';

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

const moveSchema = z.object({
  materialId: z.string(),
  direction: z.enum(['up', 'down']),
});

export async function moveMaterialAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const validatedFields = moveSchema.safeParse({
        materialId: formData.get('materialId'),
        direction: formData.get('direction'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { materialId, direction } = validatedFields.data;

    try {
        const allMaterials = await getMaterials();
        
        const materialToMove = allMaterials.find(m => m.id === materialId);
        if (!materialToMove) {
            return { success: false, message: 'Material not found.' };
        }
        const subject = materialToMove.subject;

        // Create a list of materials for the same subject, preserving the original order from allMaterials
        const subjectMaterials = allMaterials.filter(m => m.subject === subject);
        const subjectIndex = subjectMaterials.findIndex(m => m.id === materialId);

        let swapIndexInSubject = -1;
        if (direction === 'up' && subjectIndex > 0) {
            swapIndexInSubject = subjectIndex - 1;
        } else if (direction === 'down' && subjectIndex < subjectMaterials.length - 1) {
            swapIndexInSubject = subjectIndex + 1;
        }
        
        if (swapIndexInSubject === -1) {
            return { success: true }; // At a boundary, no move needed.
        }

        // Find the original indices in allMaterials for the two items to swap
        const item1 = subjectMaterials[subjectIndex];
        const item2 = subjectMaterials[swapIndexInSubject];
        const originalIndex1 = allMaterials.findIndex(m => m.id === item1.id);
        const originalIndex2 = allMaterials.findIndex(m => m.id === item2.id);

        if (originalIndex1 === -1 || originalIndex2 === -1) {
            return { success: false, message: 'Could not find materials to swap in the main list.' };
        }

        // Perform the swap in the main array
        [allMaterials[originalIndex1], allMaterials[originalIndex2]] = [allMaterials[originalIndex2], allMaterials[originalIndex1]];

        await saveMaterials(allMaterials);
        revalidatePath('/dashboard/rearrange');
        revalidatePath('/dashboard');
        
        return { success: true };
    } catch (error) {
        console.error("Error moving material:", error);
        return { success: false, message: 'An unexpected server error occurred.' };
    }
}
