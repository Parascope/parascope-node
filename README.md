# Parascope Client

TypeScript/Node.js client and CLI for Parascope Cloud API.

## Installation

```bash
npm install
npm run build
```

## Usage

### As a CLI Tool

Set your token:
```bash
export PARASCOPE_TOKEN="pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Or pass it with each command:
```bash
parascope --token pat_xxx <command>
```

### Commands

#### Workspaces

```bash
# List workspaces
npm run dev -- workspaces list

# Get specific workspace
npm run dev -- workspaces get <workspace-id>

# Create workspace
npm run dev -- workspaces create my-workspace --sharing private

# Delete workspace
npm run dev -- workspaces delete <workspace-id>
```

#### Scopes

```bash
# List scopes in workspace
npm run dev -- scopes list <workspace-id>

# Create scope
npm run dev -- scopes create <workspace-id> "My Scope" --description "Description"

# Delete scope
npm run dev -- scopes delete <scope-id>
```

#### Cards

```bash
# List cards
npm run dev -- cards list <workspace-id>

# List cards in specific scope
npm run dev -- cards list <workspace-id> --scope <scope-id>

# Create card
npm run dev -- cards create <workspace-id> "Card Name" --content "Content"

# Update card
npm run dev -- cards update <card-id> --name "New Name" --content "New Content"

# Delete card
npm run dev -- cards delete <card-id>
```

#### GitHub

```bash
# List GitHub namespaces
npm run dev -- github namespaces

# List GitHub repos
npm run dev -- github repos

# Sync namespace
npm run dev -- github sync <installation-id>
```

#### Tokens

```bash
# List tokens
npm run dev -- tokens list

# Create token
npm run dev -- tokens create "My Token"

# Revoke token
npm run dev -- tokens revoke <token-id>
```

### As a Library

```typescript
import { ParascopeClient } from 'parascope-client';

const client = new ParascopeClient({
  token: 'pat_xxx',
  baseURL: 'https://app.parascope.dev/api/v1', // optional
});

// List workspaces
const workspaces = await client.listWorkspaces();

// Create workspace
const workspace = await client.createWorkspace({
  workspace: {
    name: 'my-workspace',
    sharing_type: 'private',
  },
});

// List cards
const cards = await client.listCards(workspace.id);

// Create card
const card = await client.createCard(workspace.id, {
  name: 'My Card',
  content: 'Card content',
});
```

## API Reference

Based on OpenAPI spec in `openapi.yaml`.

### Available Methods

#### Authentication
- `login(email, password)` - Create session
- `logout()` - Destroy session

#### Tokens
- `listTokens()` - List personal access tokens
- `createToken(name, expiresAt?)` - Create new token
- `revokeToken(id)` - Revoke token

#### Workspaces
- `listWorkspaces(params?)` - List workspaces
- `getWorkspace(id)` - Get workspace details
- `createWorkspace(request)` - Create workspace
- `updateWorkspace(id, request)` - Update workspace
- `deleteWorkspace(id)` - Delete workspace

#### Scopes
- `listScopes(workspaceId)` - List scopes in workspace
- `createScope(workspaceId, request)` - Create scope
- `updateScope(id, request)` - Update scope
- `deleteScope(id)` - Delete scope

#### Cards
- `listCards(workspaceId, params?)` - List cards
- `createCard(workspaceId, request)` - Create card
- `updateCard(id, request)` - Update card
- `deleteCard(id)` - Delete card
- `bulkCards(workspaceId, operations)` - Bulk operations

#### Organization
- `organizeWorkspace(workspaceId, request)` - Reorganize scopes/cards

#### GitHub
- `listGithubNamespaces()` - List GitHub namespaces
- `listGithubRepos(params?)` - List GitHub repos
- `syncGithubNamespace(installationId)` - Sync namespace

## License

MIT
