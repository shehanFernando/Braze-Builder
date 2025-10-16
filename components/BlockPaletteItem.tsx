'use client';

import React from 'react';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { BlockTemplate } from '@/types';

interface BlockPaletteItemProps {
  template: BlockTemplate;
}

export default function BlockPaletteItem({ template }: BlockPaletteItemProps) {
  const [{ isDragging }, drag]: [{ isDragging: boolean }, ConnectDragSource] = useDrag(() => ({
    type: 'block',
    item: { blockType: template.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 bg-white border rounded cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {template.name}
    </div>
  );
}