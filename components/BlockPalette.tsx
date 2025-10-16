'use client';

import React from 'react';
import { BlockTemplate } from '@/types';
import BlockPaletteItem from './BlockPaletteItem';

interface BlockPaletteProps {
  templates: BlockTemplate[];
}

export default function BlockPalette({ templates }: BlockPaletteProps) {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Content Blocks</h2>
      <div>
        {templates.map((template) => (
          <BlockPaletteItem key={template.type} template={template} />
        ))}
      </div>
    </div>
  );
}