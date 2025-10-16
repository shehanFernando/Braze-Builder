'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';

export default function Inspector() {
  const { state, dispatch } = useEditor();
  
  const selectedBlock = state.blocks.find(block => block.id === state.selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-64 bg-gray-100 p-4 border-l">
        <h2 className="text-lg font-bold mb-4">Inspector</h2>
        <p className="text-gray-500">Select a block to edit its properties</p>
      </div>
    );
  }

  const updateBlockProp = (key: string, value: string) => {
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: {
        id: selectedBlock.id,
        props: { [key]: value },
      },
    });
  };

  const renderPropEditor = (key: string, value: any) => {
    const commonInputClass = "w-full p-2 border rounded text-sm";
    
    switch (key) {
      case 'textAlign':
        return (
          <select
            value={value}
            onChange={(e) => updateBlockProp(key, e.target.value)}
            className={commonInputClass}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        );
      
      case 'content':
        return (
          <textarea
            value={value}
            onChange={(e) => updateBlockProp(key, e.target.value)}
            className={`${commonInputClass} h-20`}
            placeholder="Enter text content"
          />
        );
      
      case 'backgroundColor':
      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => updateBlockProp(key, e.target.value)}
            className="w-full h-10 border rounded"
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateBlockProp(key, e.target.value)}
            className={commonInputClass}
            placeholder={`Enter ${key}`}
          />
        );
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Inspector</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2">{selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)} Block</h3>
        <div className="text-sm text-gray-500 mb-4">ID: {selectedBlock.id}</div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(selectedBlock.props).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {renderPropEditor(key, value)}
          </div>
        ))}
      </div>
    </div>
  );
}