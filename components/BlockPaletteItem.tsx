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

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      // Use an explicit ref and connect the drag source to it
      ref={ref}
      className={`p-3 mb-2 bg-white border rounded cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {template.name}
    </div>
  );
}