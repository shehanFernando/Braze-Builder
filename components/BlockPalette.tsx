'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import { BlockTemplate } from '@/types';

interface DraggableBlockProps {
  template: BlockTemplate;
}

function DraggableBlock({ template }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
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
      <div className="font-medium">{template.name}</div>
      <div className="text-sm text-gray-500">{template.type}</div>
    </div>
  );
}

interface BlockPaletteProps {
  templates: BlockTemplate[];
}

export default function BlockPalette({ templates }: BlockPaletteProps) {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Content Blocks</h2>
      <div>
        {templates.map((template) => (
          <DraggableBlock key={template.type} template={template} />
        ))}
      </div>
    </div>
  );
}