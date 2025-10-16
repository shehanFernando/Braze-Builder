// Core types for the email template editor
export interface BlockProps {
  [key: string]: string | number | boolean;
}

export interface Block {
  id: string;
  type: string;
  props: BlockProps;
  children?: Block[];
}

export interface BlockTemplate {
  type: string;
  name: string;
  template: string;
  defaultProps: BlockProps;
}

export interface DragItem {
  type: string;
  blockType: string;
}

export interface DropResult {
  dropEffect: string;
}