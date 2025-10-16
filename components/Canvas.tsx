'use client';

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useEditor } from '@/context/EditorContext';
import { Block, BlockTemplate, DragItem } from '@/types';
import BlockRenderer from './BlockRenderer';

interface CanvasProps {
  templates: BlockTemplate[];
}

export default function Canvas({ templates }: CanvasProps) {
  const { state, dispatch } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item: DragItem) => {
      // Generate unique ID for new block
      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.blockType,
        props: templates.find(t => t.type === item.blockType)?.defaultProps || {},
        children: item.blockType === 'container' ? [] : undefined,
      };
      dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [templates]);

  // Connect the drop target to the ref
  drop(ref);

  return (
    <div
      ref={ref}
      className={`flex-1 p-4 min-h-screen ${
        isOver ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <h2 className="text-lg font-bold mb-4">Email Canvas</h2>
      {state.blocks.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          Drag blocks from the sidebar to start building your email
        </div>
      ) : (
        <div className="space-y-2">
          {state.blocks.map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              index={index}
              onSelect={() => dispatch({ type: 'SELECT_BLOCK', payload: block.id })}
              isSelected={state.selectedBlockId === block.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}