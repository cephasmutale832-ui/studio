
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { type Material } from '@/lib/types';
import { moveMaterialAction } from '../actions';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function MoveButton({ direction, disabled }: { direction: 'up' | 'down', disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button size="icon" variant="ghost" type="submit" disabled={disabled || pending}>
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : (
                direction === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
            )}
        </Button>
    )
}

export function RearrangeList({ subject, allMaterials }: { subject: string, allMaterials: Material[] }) {
    const [state, formAction] = useActionState(moveMaterialAction, null);
    const { toast } = useToast();

    const subjectMaterials = allMaterials.filter(m => m.subject === subject);
    
    useEffect(() => {
        if (state?.success === false && state.message) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    if (subjectMaterials.length < 2) {
        return <p className="text-sm text-muted-foreground p-4">You need at least two materials in this subject to reorder them.</p>
    }

    return (
        <div className="border rounded-md">
            <ul className="divide-y">
                {subjectMaterials.map((material, index) => (
                    <li key={material.id} className="flex items-center justify-between p-2 hover:bg-muted/50">
                        <span className="font-medium text-sm">{material.title}</span>
                        <div className="flex items-center">
                            <form action={formAction}>
                                <input type="hidden" name="materialId" value={material.id} />
                                <input type="hidden" name="direction" value="up" />
                                <MoveButton direction="up" disabled={index === 0} />
                            </form>
                             <form action={formAction}>
                                <input type="hidden" name="materialId" value={material.id} />
                                <input type="hidden" name="direction" value="down" />
                                <MoveButton direction="down" disabled={index === subjectMaterials.length - 1} />
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
