'use client';

import React from 'react';
import { useDrop } from 'react-dnd';
import { useEditor } from '@/context/EditorContext';
import { Block, DragItem } from '@/types';
import BlockRenderer from './BlockRenderer';

export default function Canvas() {
  const { state, dispatch } = useEditor();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item: DragItem) => {
      // Generate unique ID for new block
      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.blockType,
        props: getDefaultPropsForType(item.blockType),
        children: item.blockType === 'container' ? [] : undefined,
      };
      dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  function getDefaultPropsForType(type: string): Record<string, any> {
    const defaults: Record<string, Record<string, any>> = {
      text: {
        content: 'Enter your text here',
        fontSize: '16px',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        padding: '10px'
      },
      image: {
        src: 'https://via.placeholder.com/300x200',
        alt: 'Image',
        maxWidth: '100%',
        textAlign: 'center',
        padding: '10px',
        borderRadius: '0px'
      },
      button: {
        text: 'Click Here',
        href: '#',
        backgroundColor: '#007bff',
        color: '#ffffff',
        buttonPadding: '12px 24px',
        borderRadius: '4px',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '10px'
      },
      container: {
        backgroundColor: 'transparent',
        padding: '20px',
        margin: '0',
        borderRadius: '0px',
        border: 'none'
      },
      divider: {
        padding: '20px 0',
        height: '1px',
        color: '#cccccc',
        width: '100%'
      },
      spacer: {
        height: '20px'
      },
      herotext: {
        headline_copy: 'Your Hero Headline Here',
        herotext_bg_color: 'transparent',
        herotext_padding_top: '32',
        herotext_padding_btm: '32',
        herotext_padding_top_m: '24',
        herotext_padding_btm_m: '24',
        herotext_background_type: 'A',
        herotext_gradient: 'false',
        cta_copy: 'Call to Action',
        cta_link: '#',
        cta_style: 'solid'
      },
      image_config: {
        image_layout: '1up',
        image_padding: 'true',
        image_mobile_behavior: 'stacked',
        image_bg_color: 'transparent',
        image_padding_top: '32',
        image_padding_btm: '32',
        image_padding_top_m: '24',
        image_padding_btm_m: '24',
        image_1_src: 'https://via.placeholder.com/552x300',
        image_1_alt: 'Lifestyle Image',
        image_1_link: '#',
        image_2_src: 'https://via.placeholder.com/268x200',
        image_2_alt: 'Lifestyle Image',
        image_2_link: '#',
        image_3_src: 'https://via.placeholder.com/173x150',
        image_3_alt: 'Lifestyle Image',
        image_3_link: '#'
      }
    };

    return defaults[type] || {};
  }

  return (
    <div
      ref={drop}
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