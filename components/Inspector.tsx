'use client';

import React, { ChangeEvent, FC } from 'react';
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

  // --- Prop Editor Components ---
  const commonInputClass = "w-full p-2 border rounded text-sm";

  interface PropEditorProps {
    propKey: string;
    value: any;
    onChange: (key: string, value: string | number | boolean) => void;
  }

  const TextInput: FC<PropEditorProps> = ({ propKey, value, onChange }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(propKey, e.target.value)}
      className={commonInputClass}
      placeholder={`Enter ${propKey}`}
    />
  );

  const TextAreaInput: FC<PropEditorProps> = ({ propKey, value, onChange }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(propKey, e.target.value)}
      className={`${commonInputClass} h-20`}
      placeholder="Enter text content"
    />
  );

  const ColorInput: FC<PropEditorProps> = ({ propKey, value, onChange }) => (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(propKey, e.target.value)}
      className="w-full h-10 border rounded"
    />
  );

  const SelectInput: FC<PropEditorProps & { options: {label: string, value: string}[] }> = ({ propKey, value, onChange, options }) => (
     <select
      value={value}
      onChange={(e) => onChange(propKey, e.target.value)}
      className={commonInputClass}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );

  // --- Prop to Component Mapping ---
  const getPropEditor = (key: string, value: any) => {
    const editorProps = { propKey: key, value, onChange: updateBlockProp };

    if (key.toLowerCase().includes('color')) {
      return <ColorInput {...editorProps} />;
    }
    if (key === 'textAlign') {
      return <SelectInput {...editorProps} options={[
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ]} />;
    }
    if (key === 'content' || key.length > 50) { // Example heuristic for textareas
      return <TextAreaInput {...editorProps} />;
    }
    // Default to text input
    return <TextInput {...editorProps} />;
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
            {getPropEditor(key, value)}
          </div>
        ))}
      </div>
    </div>
  );
}