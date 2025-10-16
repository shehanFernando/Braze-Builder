import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlockTemplate } from '@/types';

/**
 * Parses a Liquid template to extract default values from `assign` tags.
 * Example: {% assign my_var = my_var | default: "hello" %} -> { my_var: "hello" }
 * @param template The Liquid template content.
 * @returns A record of default properties.
 */
function extractDefaultProps(template: string): Record<string, any> {
  const defaultProps: Record<string, any> = {};
  const regex = /\{%\s*assign\s+([\w_]+)\s*=\s*.*?\|\s*default:\s*['"](.*?)['"]\s*%\}/g;
  let match;
  while ((match = regex.exec(template)) !== null) {
    const [, key, value] = match;
    // Attempt to parse boolean and number strings
    if (value === 'true') defaultProps[key] = true;
    else if (value === 'false') defaultProps[key] = false;
    else if (!isNaN(Number(value)) && value.trim() !== '') defaultProps[key] = Number(value);
    else defaultProps[key] = value;
  }
  return defaultProps;
}

function loadBlockTemplates(): BlockTemplate[] {
  const templatesDir = path.join(process.cwd(), 'templates/content-blocks');
  const templates: BlockTemplate[] = [];

  try {
    const files = fs.readdirSync(templatesDir);
    
    files.forEach(file => {
      if (file.endsWith('.liquid')) {
        const filePath = path.join(templatesDir, file);
        const template = fs.readFileSync(filePath, 'utf-8');
        const type = file.replace('.liquid', '');
        
        templates.push({
          type,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          template,
          defaultProps: extractDefaultProps(template)
        });
      }
    });
  } catch (error) {
    console.error('Error loading templates:', error);
  }

  return templates;
}

export async function GET() {
  try {
    const templates = loadBlockTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}