import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlockTemplate } from '@/types';

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
    },
    shehanf: {
      image_src_1: 'https://via.placeholder.com/600x300',
      image_alt_1: 'Image',
      image_link_1: '#',
      image_padding_top: '32',
      image_padding_btm: '32',
      image_bg_color: 'transparent',
      image_padded: false,
      image_mobile_stacked: false,
      image_align_1: 'center'
    }
  };

  return defaults[type] || {};
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
          defaultProps: getDefaultPropsForType(type)
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