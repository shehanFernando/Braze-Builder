# Content Blocks Guide

This guide explains how to add new content blocks to the Braze email builder.

## Adding a New Content Block

### Step 1: Create the Liquid Template

Create a new `.liquid` file in this directory (`templates/content-blocks/`):

```liquid
{% comment %}
  Your Component Name - Liquid Template for Braze
  Brief description of what this component does
{% endcomment %}

{% comment %} Variable Defaults {% endcomment %}
{% assign variable_name = variable_name | default: "default_value" %}
{% assign another_var = another_var | default: "default_value" %}

{% comment %} Your HTML Structure {% endcomment %}
{% if variable_name %}
<table cellspacing="0" cellpadding="0" border="0" role="presentation" style="width: 100%; max-width: 600px;">
  <tr>
    <td>
      <!-- Your email-compatible HTML here -->
      {{ variable_name }}
    </td>
  </tr>
</table>
{% endif %}
```

### Step 2: Add Default Props

In `app/api/templates/route.ts`, add your component's default props:

```typescript
'your-component-name': {
  variable_name: 'default_value',
  another_var: 'default_value',
  // ... all variables from your liquid template
}
```

### Step 3: Add React Renderer

In `components/BlockRenderer.tsx`, add a case for your component:

```typescript
case 'your-component-name':
  return (
    <div>
      {/* Convert your Liquid logic to React JSX */}
      {/* Use block.props.variable_name for values */}
    </div>
  );
```

## Conversion Rules

- **Variables**: `{{ variable }}` → `{block.props.variable}`
- **Conditionals**: `{% if condition %}` → `{condition && ()}`
- **Defaults**: `{% assign var = var | default: "value" %}` → Use in default props
- **HTML**: Keep all table structures and email-specific attributes
- **Styling**: Preserve all CSS classes and inline styles

## Example: Simple Text Block

**File**: `simple-text.liquid`
```liquid
{% assign text_content = text_content | default: "Default text" %}
{% assign text_color = text_color | default: "#000000" %}

<table cellspacing="0" cellpadding="0" border="0" role="presentation">
  <tr>
    <td style="color: {{ text_color }};">
      {{ text_content }}
    </td>
  </tr>
</table>
```

**Default Props**:
```typescript
'simple-text': {
  text_content: 'Default text',
  text_color: '#000000'
}
```

**React Renderer**:
```typescript
case 'simple-text':
  return (
    <div style={{ color: block.props.text_color as string }}>
      {block.props.text_content as string}
    </div>
  );
```

## Best Practices

1. **Email Compatibility**: Use table-based layouts for email clients
2. **Variable Naming**: Use descriptive names with underscores
3. **Defaults**: Always provide sensible defaults for all variables
4. **Comments**: Document your component's purpose and variables
5. **Testing**: Test in the visual editor and export to verify Liquid output

## File Structure

```
templates/content-blocks/
├── README.md (this file)
├── your-component.liquid
├── another-component.liquid
└── ...
```

Your components will automatically appear in the BlockPalette sidebar once created.