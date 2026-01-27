#!/usr/bin/env tsx
/**
 * Basic usage examples for Parascope Client
 */

import { ParascopeClient } from '../src/client';

const TOKEN = process.env.PARASCOPE_TOKEN || 'pat_xxx';

async function main() {
  const client = new ParascopeClient({
    token: TOKEN,
    baseURL: 'https://app.parascope.dev/api/v1',
  });

  console.log('🔍 Listing workspaces...\n');
  const workspacesResponse = await client.listWorkspaces();
  console.log(`Found ${workspacesResponse.data.length} workspaces:`);
  workspacesResponse.data.forEach((ws) => {
    console.log(`  - ${ws.name} (${ws.id})${ws.is_default ? ' [DEFAULT]' : ''}`);
  });

  // Get first workspace
  const workspace = workspacesResponse.data[0];
  if (!workspace) {
    console.log('No workspaces found!');
    return;
  }

  console.log(`\n📂 Working with workspace: ${workspace.name}\n`);

  // List scopes
  console.log('🏷️  Listing scopes...\n');
  const scopes = await client.listScopes(workspace.id);
  console.log(`Found ${scopes.length} scopes:`);
  scopes.forEach((scope) => {
    console.log(
      `  - ${scope.name} (${scope.cards_count} cards)${scope.is_default ? ' [DEFAULT]' : ''}`
    );
  });

  // List cards
  console.log('\n📝 Listing cards...\n');
  const cardsResponse = await client.listCards(workspace.id);
  console.log(`Found ${cardsResponse.data.length} cards:`);
  cardsResponse.data.forEach((card) => {
    console.log(`  - ${card.name}`);
    if (card.github_repo) {
      console.log(`    GitHub: ${card.github_repo.repository_full_name}`);
    }
    if (card.content) {
      console.log(`    Content preview: ${card.content.substring(0, 50)}...`);
    }
  });

  // List GitHub integrations
  console.log('\n🐙 Listing GitHub namespaces...\n');
  const namespaces = await client.listGithubNamespaces();
  console.log(`Found ${namespaces.length} GitHub namespaces:`);
  namespaces.forEach((ns) => {
    console.log(`  - ${ns.github_account_login} (${ns.repos_count} repos)`);
  });
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
