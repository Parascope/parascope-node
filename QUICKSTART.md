# Quick Start Guide

## Installation

```bash
npm install
npm run build
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your token to `.env`:
```bash
PARASCOPE_TOKEN=pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Or export it:
```bash
export PARASCOPE_TOKEN="pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Quick Examples

### List workspaces
```bash
npm run dev -- workspaces list
```

### Get workspace details
```bash
npm run dev -- workspaces get <workspace-id>
```

### List scopes in workspace
```bash
npm run dev -- scopes list <workspace-id>
```

### List cards
```bash
npm run dev -- cards list <workspace-id>
```

### Create a card
```bash
npm run dev -- cards create <workspace-id> "My Card" --content "Card content"
```

### List GitHub repos
```bash
npm run dev -- github repos
```

## Run Examples

We provide several example scripts:

```bash
# Basic usage - list workspaces, scopes, cards, GitHub
npm run example:basic

# Create and manage cards
npm run example:create

# Bulk operations - create/update/delete multiple cards
npm run example:bulk

# Organize workspace - reorder scopes and cards
npm run example:organize
```

## Use as Library

```typescript
import { ParascopeClient } from 'parascope-client';

const client = new ParascopeClient({
  token: process.env.PARASCOPE_TOKEN!,
});

// List workspaces
const { data: workspaces } = await client.listWorkspaces();

// Create a card
const card = await client.createCard(workspaceId, {
  name: 'My Card',
  content: 'Card content',
});
```

## Common Use Cases

### 1. Sync cards with external system

```typescript
// Get all cards
const { data: cards } = await client.listCards(workspaceId);

// Process cards
for (const card of cards) {
  // Sync with your system
  await syncToExternalSystem(card);
}
```

### 2. Bulk create cards from data

```typescript
const operations = data.map(item => ({
  action: 'create' as const,
  name: item.name,
  content: YAML.stringify(item),
  scope_id: scopeId,
}));

await client.bulkCards(workspaceId, operations);
```

### 3. Organize by criteria

```typescript
const { data: cards } = await client.listCards(workspaceId);

// Sort by some criteria
const sorted = cards.sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Reorder
await client.organizeWorkspace(workspaceId, {
  cards: sorted.map((card, index) => ({
    id: card.id,
    position: index,
  })),
});
```

## Tips

- Use `--help` with any command to see available options
- The API returns paginated results for large datasets
- Personal Access Tokens never expire unless you set an expiration date
- Default workspace is created automatically on first login
- Cards support YAML, JSON, or plain text content

## Troubleshooting

### "Unauthorized" error
- Check that your token is correct
- Make sure the token hasn't been revoked

### "Resource not found"
- Verify the ID you're using is correct
- Make sure you have access to the workspace

### Build errors
- Run `npm install` to install dependencies
- Make sure you have Node.js 18+ installed
