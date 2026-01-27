#!/usr/bin/env node

import { Command } from 'commander';
import { ParascopeClient } from './client';

const program = new Command();

// Get token from env or args
const getToken = (cmdToken?: string): string => {
  const token = cmdToken || process.env.PARASCOPE_TOKEN;
  if (!token) {
    console.error('Error: Token required. Set PARASCOPE_TOKEN env var or use --token flag');
    process.exit(1);
  }
  return token;
};

const formatJson = (data: unknown) => JSON.stringify(data, null, 2);

program
  .name('parascope')
  .description('CLI tool for Parascope Cloud API')
  .version('1.0.0')
  .option('-t, --token <token>', 'API token (or use PARASCOPE_TOKEN env var)')
  .option('-u, --url <url>', 'Base URL', 'https://app.parascope.dev/api/v1');

// ===== Workspaces =====

const workspaces = program.command('workspaces').description('Manage workspaces');

workspaces
  .command('list')
  .description('List all workspaces')
  .option('-q, --query <query>', 'Search query')
  .option('-l, --limit <limit>', 'Limit', '50')
  .action(async (options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const result = await client.listWorkspaces({
      q: options.query,
      limit: parseInt(options.limit),
    });
    console.log(formatJson(result));
  });

workspaces
  .command('get')
  .description('Get workspace by ID')
  .argument('<id>', 'Workspace ID')
  .action(async (id) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const workspace = await client.getWorkspace(id);
    console.log(formatJson(workspace));
  });

workspaces
  .command('create')
  .description('Create new workspace')
  .argument('<name>', 'Workspace name')
  .option('-d, --description <desc>', 'Description')
  .option('-s, --sharing <type>', 'Sharing type (private/internal/public)', 'private')
  .action(async (name, options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const workspace = await client.createWorkspace({
      workspace: {
        name,
        description: options.description,
        sharing_type: options.sharing as 'private' | 'internal' | 'public',
      },
    });
    console.log(formatJson(workspace));
  });

workspaces
  .command('delete')
  .description('Delete workspace')
  .argument('<id>', 'Workspace ID')
  .action(async (id) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    await client.deleteWorkspace(id);
    console.log(`Workspace ${id} deleted successfully`);
  });

// ===== Scopes =====

const scopes = program.command('scopes').description('Manage scopes');

scopes
  .command('list')
  .description('List scopes in workspace')
  .argument('<workspace-id>', 'Workspace ID')
  .action(async (workspaceId) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const result = await client.listScopes(workspaceId);
    console.log(formatJson(result));
  });

scopes
  .command('create')
  .description('Create new scope')
  .argument('<workspace-id>', 'Workspace ID')
  .argument('<name>', 'Scope name')
  .option('-d, --description <desc>', 'Description')
  .action(async (workspaceId, name, options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const scope = await client.createScope(workspaceId, {
      scope: {
        name,
        description: options.description,
      },
    });
    console.log(formatJson(scope));
  });

scopes
  .command('delete')
  .description('Delete scope')
  .argument('<id>', 'Scope ID')
  .action(async (id) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    await client.deleteScope(id);
    console.log(`Scope ${id} deleted successfully`);
  });

// ===== Cards =====

const cards = program.command('cards').description('Manage cards');

cards
  .command('list')
  .description('List cards in workspace')
  .argument('<workspace-id>', 'Workspace ID')
  .option('-s, --scope <scope-id>', 'Filter by scope ID')
  .option('-q, --query <query>', 'Search query')
  .option('-l, --limit <limit>', 'Limit', '50')
  .action(async (workspaceId, options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const result = await client.listCards(workspaceId, {
      scope_id: options.scope,
      q: options.query,
      limit: parseInt(options.limit),
    });
    console.log(formatJson(result));
  });

cards
  .command('create')
  .description('Create new card')
  .argument('<workspace-id>', 'Workspace ID')
  .argument('<name>', 'Card name')
  .option('-c, --content <content>', 'Card content')
  .option('-s, --scope <scope-id>', 'Scope ID')
  .action(async (workspaceId, name, options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const card = await client.createCard(workspaceId, {
      name,
      content: options.content,
      scope_id: options.scope,
    });
    console.log(formatJson(card));
  });

cards
  .command('update')
  .description('Update card')
  .argument('<id>', 'Card ID')
  .option('-n, --name <name>', 'New name')
  .option('-c, --content <content>', 'New content')
  .option('-s, --scope <scope-id>', 'Move to scope')
  .action(async (id, options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const card = await client.updateCard(id, {
      name: options.name,
      content: options.content,
      scope_id: options.scope,
    });
    console.log(formatJson(card));
  });

cards
  .command('delete')
  .description('Delete card')
  .argument('<id>', 'Card ID')
  .action(async (id) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    await client.deleteCard(id);
    console.log(`Card ${id} deleted successfully`);
  });

// ===== GitHub =====

const github = program.command('github').description('GitHub integration');

github
  .command('namespaces')
  .description('List GitHub namespaces')
  .action(async () => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const namespaces = await client.listGithubNamespaces();
    console.log(formatJson(namespaces));
  });

github
  .command('repos')
  .description('List GitHub repositories')
  .option('-n, --namespace <id>', 'Filter by namespace ID')
  .option('-q, --query <query>', 'Search query')
  .action(async (options) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const repos = await client.listGithubRepos({
      namespace_id: options.namespace,
      q: options.query,
    });
    console.log(formatJson(repos));
  });

github
  .command('sync')
  .description('Sync GitHub namespace')
  .argument('<installation-id>', 'GitHub App installation ID')
  .action(async (installationId) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const result = await client.syncGithubNamespace(installationId);
    console.log(formatJson(result));
  });

// ===== Tokens =====

const tokens = program.command('tokens').description('Manage personal access tokens');

tokens
  .command('list')
  .description('List all tokens')
  .action(async () => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const result = await client.listTokens();
    console.log(formatJson(result));
  });

tokens
  .command('create')
  .description('Create new token')
  .argument('<name>', 'Token name')
  .action(async (name) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    const token = await client.createToken(name);
    console.log(formatJson(token));
    console.log('\nIMPORTANT: Save this token securely. It will not be shown again!');
  });

tokens
  .command('revoke')
  .description('Revoke token')
  .argument('<id>', 'Token ID')
  .action(async (id) => {
    const client = new ParascopeClient({
      token: getToken(program.opts().token),
      baseURL: program.opts().url,
    });
    await client.revokeToken(id);
    console.log(`Token ${id} revoked successfully`);
  });

program.parse();
