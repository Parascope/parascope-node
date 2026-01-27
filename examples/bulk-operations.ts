#!/usr/bin/env tsx
/**
 * Example: Bulk card operations
 */

import { ParascopeClient } from '../src/client';

const TOKEN = process.env.PARASCOPE_TOKEN || 'pat_xxx';

async function main() {
  const client = new ParascopeClient({
    token: TOKEN,
    baseURL: 'https://app.parascope.dev/api/v1',
  });

  // Get default workspace
  const workspacesResponse = await client.listWorkspaces();
  const workspace = workspacesResponse.data.find((ws) => ws.is_default);

  if (!workspace) {
    console.error('No default workspace found');
    process.exit(1);
  }

  console.log(`📂 Using workspace: ${workspace.name}\n`);

  // Get default scope
  const scopes = await client.listScopes(workspace.id);
  const defaultScope = scopes.find((s) => s.is_default);

  if (!defaultScope) {
    console.error('No default scope found');
    process.exit(1);
  }

  console.log('📦 Performing bulk operations...\n');

  // Create multiple cards in one request
  const results = await client.bulkCards(workspace.id, [
    {
      action: 'create',
      name: `bulk-card-1-${Date.now()}`,
      content: '---\nbulk-card-1:\n  type: test\n',
      scope_id: defaultScope.id,
    },
    {
      action: 'create',
      name: `bulk-card-2-${Date.now()}`,
      content: '---\nbulk-card-2:\n  type: test\n',
      scope_id: defaultScope.id,
    },
    {
      action: 'create',
      name: `bulk-card-3-${Date.now()}`,
      content: '---\nbulk-card-3:\n  type: test\n',
      scope_id: defaultScope.id,
    },
  ]);

  console.log(`✅ Bulk operations completed!\n`);

  const createdCards = results.filter((r) => r.success && r.data);
  console.log(`Created ${createdCards.length} cards:`);
  createdCards.forEach((result) => {
    if (result.data) {
      console.log(`  - ${result.data.name} (${result.data.id})`);
    }
  });

  // Now update them all
  console.log('\n🔄 Updating all cards...\n');
  const updateResults = await client.bulkCards(
    workspace.id,
    createdCards.map((result) => ({
      action: 'update' as const,
      id: result.data!.id,
      attributes: {
        content: result.data!.content + '  updated: true\n',
      },
    }))
  );

  console.log(`✅ Updated ${updateResults.filter((r) => r.success).length} cards\n`);

  // Clean up: delete all created cards
  console.log('🗑️  Cleaning up...\n');
  const deleteResults = await client.bulkCards(
    workspace.id,
    createdCards.map((result) => ({
      action: 'delete' as const,
      id: result.data!.id,
    }))
  );

  console.log(`✅ Deleted ${deleteResults.filter((r) => r.success).length} cards`);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
