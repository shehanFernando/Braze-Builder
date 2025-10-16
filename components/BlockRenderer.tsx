'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Block } from '@/types';
import { useEditor } from '@/context/EditorContext';

interface BlockRendererProps {
  block: Block;
  index: number;
  onSelect: () => void;
  isSelected: boolean;
}

export default function BlockRenderer({ block, index, onSelect, isSelected }: BlockRendererProps) {
  const { dispatch } = useEditor();
  
  // Create a ref for the component
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sortable-block',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'sortable-block',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        dispatch({
          type: 'MOVE_BLOCK',
          payload: { dragIndex: item.index, hoverIndex: index },
        });
        item.index = index;
      }
    },
  }));

  // Attach both drag and drop refs to the same element
  drag(drop(ref));

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div
            style={{
              fontFamily: block.props.fontFamily as string,
              fontSize: block.props.fontSize as string,
              color: block.props.color as string,
              textAlign: block.props.textAlign as any,
              padding: block.props.padding as string,
            }}
          >
            {block.props.content as string}
          </div>
        );

      case 'image':
        return (
          <div style={{ textAlign: block.props.textAlign as any, padding: block.props.padding as string }}>
            <img
              src={block.props.src as string}
              alt={block.props.alt as string}
              style={{
                maxWidth: block.props.maxWidth as string,
                height: 'auto',
                borderRadius: block.props.borderRadius as string,
              }}
            />
          </div>
        );

      case 'button':
        return (
          <div style={{ textAlign: block.props.textAlign as any, padding: block.props.padding as string }}>
            <a
              href={block.props.href as string}
              style={{
                display: 'inline-block',
                backgroundColor: block.props.backgroundColor as string,
                color: block.props.color as string,
                padding: block.props.buttonPadding as string,
                textDecoration: 'none',
                borderRadius: block.props.borderRadius as string,
                fontFamily: block.props.fontFamily as string,
                fontSize: block.props.fontSize as string,
              }}
            >
              {block.props.text as string}
            </a>
          </div>
        );

      case 'container':
        return (
          <div
            style={{
              backgroundColor: block.props.backgroundColor as string,
              padding: block.props.padding as string,
              margin: block.props.margin as string,
              borderRadius: block.props.borderRadius as string,
              border: block.props.border as string,
            }}
          >
            {block.children && block.children.length > 0 ? (
              block.children.map((child, childIndex) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  index={childIndex}
                  onSelect={() => dispatch({ type: 'SELECT_BLOCK', payload: child.id })}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">Drop blocks here</div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div style={{ padding: block.props.padding as string, textAlign: 'center' }}>
            <hr
              style={{
                border: 'none',
                height: block.props.height as string,
                backgroundColor: block.props.color as string,
                width: block.props.width as string,
                margin: '0 auto',
              }}
            />
          </div>
        );

      case 'spacer':
        return (
          <div
            style={{
              height: block.props.height as string,
              lineHeight: block.props.height as string,
              fontSize: '1px',
            }}
          >
            &nbsp;
          </div>
        );

      case 'herotext':
        return (
          <div
            style={{
              backgroundColor: block.props.herotext_bg_color as string,
              paddingTop: `${block.props.herotext_padding_top}px`,
              paddingBottom: `${block.props.herotext_padding_btm}px`,
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: 'bold' }}>
              {block.props.headline_copy as string}
            </h2>
            {block.props.cta_copy && (
              <a
                href={block.props.cta_link as string}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {block.props.cta_copy as string}
              </a>
            )}
          </div>
        );

      case 'image_config':
        const layout = block.props.image_layout as string;
        const containerStyle = {
          backgroundColor: block.props.image_bg_color as string,
          paddingTop: `${block.props.image_padding_top}px`,
          paddingBottom: `${block.props.image_padding_btm}px`,
          textAlign: 'center' as const,
        };
        
        if (layout === '1up') {
          return (
            <div style={containerStyle}>
              <img
                src={block.props.image_1_src as string}
                alt={block.props.image_1_alt as string}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          );
        } else if (layout === '2up') {
          return (
            <div style={containerStyle}>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                {block.props.image_1_src && (
                  <img
                    src={block.props.image_1_src as string}
                    alt={block.props.image_1_alt as string}
                    style={{ width: '48%', height: 'auto' }}
                  />
                )}
                {block.props.image_2_src && (
                  <img
                    src={block.props.image_2_src as string}
                    alt={block.props.image_2_alt as string}
                    style={{ width: '48%', height: 'auto' }}
                  />
                )}
              </div>
            </div>
          );
        } else if (layout === '3up') {
          return (
            <div style={containerStyle}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {block.props.image_1_src && (
                  <img
                    src={block.props.image_1_src as string}
                    alt={block.props.image_1_alt as string}
                    style={{ width: '32%', height: 'auto' }}
                  />
                )}
                {block.props.image_2_src && (
                  <img
                    src={block.props.image_2_src as string}
                    alt={block.props.image_2_alt as string}
                    style={{ width: '32%', height: 'auto' }}
                  />
                )}
                {block.props.image_3_src && (
                  <img
                    src={block.props.image_3_src as string}
                    alt={block.props.image_3_alt as string}
                    style={{ width: '32%', height: 'auto' }}
                  />
                )}
              </div>
            </div>
          );
        }
        return <div>Invalid image layout</div>;

      case 'shehanf':
        return (
          <div
            style={{
              backgroundColor: block.props.image_bg_color as string,
              paddingTop: `${block.props.image_padding_top}px`,
              paddingBottom: `${block.props.image_padding_btm}px`,
              textAlign: 'center',
            }}
          >
            {block.props.image_src_1 && (
              <img
                src={block.props.image_src_1 as string}
                alt={block.props.image_alt_1 as string}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
        );

      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`relative group cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      {renderBlockContent()}
      
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'DELETE_BLOCK', payload: block.id });
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
        >
          ×
        </button>
      )}
    </div>
  );
}