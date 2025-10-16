'use client';

import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { BlockTemplate } from '@/types';

interface BlockPaletteItemProps {
  template: BlockTemplate;
}

export default function BlockPaletteItem({ template }: BlockPaletteItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { blockType: template.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Explicitly create a ref and attach the drag source to it.
  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`p-3 mb-2 bg-white border rounded cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {template.name}
    </div>
  );
}