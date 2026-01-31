
'use server';

import fs from 'fs/promises';
import path from 'path';
import { generateQuizForVideo, type GenerateQuizInput, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { type Material } from '@/lib/types';

const materialsFilePath = path.join(process.cwd(), 'src', 'lib', 'materials.json');
const physicsQuizFilePath = path.join(process.cwd(), 'src', 'lib', 'physics-quiz.json');

async function getMaterials(): Promise<Material[]> {
    try {
        const fileContents = await fs.readFile(materialsFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data.materials || [];
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
          return [];
        }
        console.error("Error reading materials file for quiz generation:", error);
        return [];
    }
}

async function getPhysicsQuiz(topic?: string): Promise<GenerateQuizOutput | null> {
    if (!topic) return null;
    try {
        const fileContents = await fs.readFile(physicsQuizFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        const quizData = data.quizzes.find((q: any) => q.topic === topic);
        if (quizData && quizData.questions) {
            return { questions: quizData.questions };
        }
        return null;
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return null; // File doesn't exist, which is fine. Fallback to AI.
        }
        console.error("Error reading physics quiz file:", error);
        return null;
    }
}


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    const { title, description, referenceText, subject, topic } = input;
    
    // If subject is Physics (SCIENCE P1), try to load a static quiz.
    if (subject === 'SCIENCE P1') {
        const staticQuiz = await getPhysicsQuiz(topic);
        if (staticQuiz) {
            return staticQuiz;
        }
    }
    
    let videoReferenceText = referenceText || '';

    // Find reference text from documents with the same subject and topic
    let documentReferenceText = '';
    if (subject) {
        const allMaterials = await getMaterials();
        const relevantDocuments = allMaterials.filter(m => 
            m.type === 'document' && 
            m.subject === subject && 
            m.topic === topic &&
            m.referenceText
        );

        if (relevantDocuments.length > 0) {
            documentReferenceText = relevantDocuments
                .map(d => `--- Start of Document: ${d.title} ---\n${d.referenceText}\n--- End of Document: ${d.title} ---`)
                .join('\n\n');
        }
    }
    
    // Combine reference texts
    let combinedReferenceText = videoReferenceText;
    if (documentReferenceText) {
        combinedReferenceText += `\n\n## Additional Reference Material from Documents:\n\n${documentReferenceText}`;
    }
    
    // Prepare input for the AI flow
    const aiInput: GenerateQuizInput = {
        title,
        description: description || '',
        // Only include referenceText if it's not empty
        ...(combinedReferenceText.trim() && { referenceText: combinedReferenceText.trim() }),
    };

    const quiz = await generateQuizForVideo(aiInput);
    return quiz;
}
