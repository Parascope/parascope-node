# Parascope Client - Project Overview

## What is this?

Full-featured TypeScript client and CLI tool for [Parascope Cloud API](https://app.parascope.dev).

## Features

✅ **Full API Coverage**
- Authentication & Sessions
- Personal Access Tokens
- Workspaces (CRUD)
- Scopes (CRUD)
- Cards (CRUD + Bulk operations)
- GitHub Integration
- Workspace Organization (drag-and-drop)

✅ **TypeScript Support**
- Full type definitions
- Auto-completion in IDEs
- Type-safe API calls

✅ **CLI Tool**
- User-friendly command-line interface
- All API operations available
- Pretty JSON output

✅ **Examples**
- Basic usage
- Card creation
- Bulk operations
- Workspace organization

## Project Structure

```
parascope-client/
├── src/
│   ├── client.ts       # Main API client class
│   ├── cli.ts          # CLI implementation
│   ├── types.ts        # TypeScript type definitions
│   └── index.ts        # Public exports
├── examples/
│   ├── basic-usage.ts        # List workspaces, scopes, cards
│   ├── create-card.ts        # Create and manage cards
│   ├── bulk-operations.ts    # Bulk create/update/delete
│   └── organize-workspace.ts # Reorder scopes/cards
├── openapi.yaml        # API specification
├── README.md           # Documentation
├── QUICKSTART.md       # Quick start guide
└── package.json        # NPM configuration
```

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Set your token
export PARASCOPE_TOKEN="pat_xxx"

# List workspaces
npm run dev -- workspaces list

# Run examples
npm run example:basic
```

## API Client Usage

### Initialize

```typescript
import { ParascopeClient } from 'parascope-client';

const client = new ParascopeClient({
  token: 'pat_xxx',
  baseURL: 'https://app.parascope.dev/api/v1', // optional
});
```

### Common Operations

```typescript
// List workspaces
const { data: workspaces } = await client.listWorkspaces();

// Get workspace details
const workspace = await client.getWorkspace(workspaceId);

// List scopes
const scopes = await client.listScopes(workspaceId);

// List cards
const { data: cards } = await client.listCards(workspaceId);

// Create card
const card = await client.createCard(workspaceId, {
  name: 'My Card',
  content: '---\nmy-card:\n  key: value\n',
});

// Update card
await client.updateCard(cardId, {
  content: 'Updated content',
});

// Delete card
await client.deleteCard(cardId);

// Bulk operations
await client.bulkCards(workspaceId, [
  { action: 'create', name: 'Card 1', content: '...' },
  { action: 'update', id: '...', attributes: { name: 'New name' } },
  { action: 'delete', id: '...' },
]);

// Organize workspace
await client.organizeWorkspace(workspaceId, {
  scopes: [
    { id: 'scope-1', position: 1 },
    { id: 'scope-2', position: 2 },
  ],
  cards: [
    { id: 'card-1', position: 0, scope_id: 'scope-1' },
    { id: 'card-2', position: 1, scope_id: 'scope-1' },
  ],
});
```

## CLI Usage

### Workspaces

```bash
# List workspaces
npm run dev -- workspaces list

# Get workspace
npm run dev -- workspaces get <id>

# Create workspace
npm run dev -- workspaces create my-workspace

# Delete workspace
npm run dev -- workspaces delete <id>
```

### Scopes

```bash
# List scopes
npm run dev -- scopes list <workspace-id>

# Create scope
npm run dev -- scopes create <workspace-id> "Scope Name"

# Update scope
npm run dev -- scopes update <scope-id> --name "New Name"

# Delete scope
npm run dev -- scopes delete <scope-id>
```

### Cards

```bash
# List cards
npm run dev -- cards list <workspace-id>

# Filter by scope
npm run dev -- cards list <workspace-id> --scope <scope-id>

# Create card
npm run dev -- cards create <workspace-id> "Card Name" --content "Content"

# Update card
npm run dev -- cards update <card-id> --name "New Name"

# Delete card
npm run dev -- cards delete <card-id>
```

### GitHub

```bash
# List namespaces
npm run dev -- github namespaces

# List repos
npm run dev -- github repos

# Filter repos by namespace
npm run dev -- github repos --namespace <namespace-id>

# Sync namespace
npm run dev -- github sync <installation-id>
```

## Authentication

Two methods supported:

1. **Personal Access Token** (recommended for CLI/automation):
   ```bash
   export PARASCOPE_TOKEN="pat_xxx"
   ```

2. **JWT Session** (for user sessions):
   ```typescript
   const session = await client.login('email@example.com', 'password');
   // Use session.token
   ```

## Testing

The project includes several working examples that can be used for testing:

```bash
# Test basic API operations
npm run example:basic

# Test card creation and management
npm run example:create

# Test bulk operations
npm run example:bulk

# Test workspace organization
npm run example:organize
```

All examples use your `PARASCOPE_TOKEN` from environment.

## Build & Distribution

```bash
# Build TypeScript
npm run build

# Output goes to dist/
# - dist/index.js      - Main entry
# - dist/cli.js        - CLI entry
# - dist/client.js     - Client class
# - dist/types.d.ts    - Type definitions
```

## Publishing

To publish as NPM package:

```bash
# Update version in package.json
npm version patch|minor|major

# Publish
npm publish
```

## License

MIT
