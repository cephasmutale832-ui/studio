
'use server';

import { type Material } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const materialsFilePath = path.join(process.cwd(), 'src', 'lib', 'materials.json');

// This function is designed to be safe against data loss.
// If the file is corrupted, it will throw an error rather than returning an empty array,
// which would cause the file to be overwritten on the next save.
export async function getMaterials(): Promise<Material[]> {
    try {
        const fileContents = await fs.readFile(materialsFilePath, 'utf8');
        // Handle empty file
        if (fileContents.trim() === '') {
            return [];
        }
        const data = JSON.parse(fileContents);
        if (Array.isArray(data.materials)) {
            return data.materials;
        }
        // If file is valid JSON but not the expected shape.
        throw new Error('materials.json data is not in the expected format.');
    } catch (error) {
        if (error instanceof Error) {
            // If file doesn't exist, it's a valid starting point.
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return [];
            }
        }
        // For JSON parsing errors or other issues, re-throw to be caught by the action.
        console.error("Error reading materials.json:", error);
        throw new Error("Could not read the materials data file. It may be corrupted.");
    }
}

export async function saveMaterials(materials: Material[]): Promise<void> {
    const data = { materials };
    await fs.writeFile(materialsFilePath, JSON.stringify(data, null, 2), 'utf8');
}
