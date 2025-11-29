import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function DraggablePokemon({ id, children, disabled }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: disabled
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none', // Important for mobile drag
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
