'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { renderEmailToLiquid } from '@/utils/liquidProcessor';

export default function Toolbar() {
  const { state, dispatch } = useEditor();

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/templates');
      const templates = await response.json();
      const liquidCode = renderEmailToLiquid(state.blocks, templates);
      const blob = new Blob([liquidCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.liquid';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting template:', error);
    }
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Braze Email Builder</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`px-3 py-1 rounded text-sm ${
              canUndo
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Undo
          </button>
          
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`px-3 py-1 rounded text-sm ${
              canRedo
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Redo
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          {state.blocks.length} block{state.blocks.length !== 1 ? 's' : ''}
        </span>
        
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Export Liquid
        </button>
      </div>
    </div>
  );
}