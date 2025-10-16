'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Block } from '@/types';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  historyIndex: number;
}

type EditorAction =
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; props: Record<string, any> } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'MOVE_BLOCK'; payload: { dragIndex: number; hoverIndex: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: EditorState = {
  blocks: [],
  selectedBlockId: null,
  history: [[]],
  historyIndex: 0,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_BLOCK':
      const newBlocks = [...state.blocks, action.payload];
      return {
        ...state,
        blocks: newBlocks,
        history: [...state.history.slice(0, state.historyIndex + 1), newBlocks],
        historyIndex: state.historyIndex + 1,
      };

    case 'UPDATE_BLOCK':
      const updatedBlocks = state.blocks.map(block =>
        block.id === action.payload.id
          ? { ...block, props: { ...block.props, ...action.payload.props } }
          : block
      );
      return {
        ...state,
        blocks: updatedBlocks,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedBlocks],
        historyIndex: state.historyIndex + 1,
      };

    case 'DELETE_BLOCK':
      const filteredBlocks = state.blocks.filter(block => block.id !== action.payload);
      return {
        ...state,
        blocks: filteredBlocks,
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
        history: [...state.history.slice(0, state.historyIndex + 1), filteredBlocks],
        historyIndex: state.historyIndex + 1,
      };

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload };

    case 'MOVE_BLOCK':
      const { dragIndex, hoverIndex } = action.payload;
      const movedBlocks = [...state.blocks];
      const draggedBlock = movedBlocks[dragIndex];
      movedBlocks.splice(dragIndex, 1);
      movedBlocks.splice(hoverIndex, 0, draggedBlock);
      return {
        ...state,
        blocks: movedBlocks,
        history: [...state.history.slice(0, state.historyIndex + 1), movedBlocks],
        historyIndex: state.historyIndex + 1,
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          blocks: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          blocks: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
}

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}