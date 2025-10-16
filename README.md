# Braze Email Builder

A React/Next.js drag-and-drop email template editor that generates Braze-compatible Liquid code.

## Prerequisites

- Node.js >= 16.x
- npm or Yarn
- Git

## Installation

```bash
# Clone the repo
git clone https://github.com/your-org/braze-builder.git
cd braze-builder

# Install dependencies
npm install
# or
yarn install
```

## Development

```bash
# Start the dev server
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

- Use the sidebar to drag existing or custom Liquid content blocks onto the canvas.
- Edit block properties in the Inspector panel.
- Preview the rendered HTML in real time.

## Importing Custom Blocks

1. Place your .liquid block templates in `templates/content-blocks/`.
2. Restart the dev server to auto-detect new blocks.
3. Your custom blocks will appear in the BlockPalette.

## Exporting Templates

1. Click the Export button to download the assembled Liquid code as `template.liquid`.
2. Use this file directly in Braze's template editor.

## Testing

```bash
# Run unit tests
npm test
# or
yarn test
```

## Deployment

Build the production bundle:

```bash
npm run build
# or
yarn build
```

Deploy on Vercel:

```bash
vercel --prod
```

## Troubleshooting

- If custom blocks do not appear, ensure your .liquid files have the .liquid extension and valid placeholder syntax.
- Check console logs for template parsing errors.
- Restart the dev server after adding new .liquid templates.