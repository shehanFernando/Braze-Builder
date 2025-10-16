'use client';

import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorProvider } from '@/context/EditorContext';
import { BlockTemplate } from '@/types';
import BlockPalette from '@/components/BlockPalette';
import Canvas from '@/components/Canvas';
import Inspector from '@/components/Inspector';
import Toolbar from '@/components/Toolbar';

export default function Home() {
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load templates from API
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading templates:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading templates...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorProvider>
        <div className="h-screen flex flex-col">
          <Toolbar />
          <div className="flex flex-1">
            <BlockPalette templates={templates} />
            <Canvas />
            <Inspector />
          </div>
        </div>
      </EditorProvider>
    </DndProvider>
  );
}