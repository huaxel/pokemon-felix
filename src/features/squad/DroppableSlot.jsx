import { useDroppable } from '@dnd-kit/core';

export function DroppableSlot({ id, children, isFilled }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        borderColor: isOver ? '#fbbf24' : undefined,
        backgroundColor: isOver ? 'rgba(251, 191, 36, 0.1)' : undefined,
        transform: isOver ? 'scale(1.05)' : undefined,
    };

    return (
        <div ref={setNodeRef} className={`squad-slot ${isFilled ? 'filled' : 'empty'}`} style={style}>
            {children}
        </div>
    );
}
