#!/usr/bin/env tsx
/**
 * Example: Organize workspace - reorder scopes and cards
 */

import { ParascopeClient } from '../src/client';

const TOKEN = process.env.PARASCOPE_TOKEN || 'pat_xxx';

async function main() {
  const client = new ParascopeClient({
    token: TOKEN,
    baseURL: 'https://app.parascope.dev/api/v1',
  });

  // Get workspaces
  const workspacesResponse = await client.listWorkspaces();
  const workspace = workspacesResponse.data.find((ws) => ws.is_default);

  if (!workspace) {
    console.error('No default workspace found');
    process.exit(1);
  }

  console.log(`📂 Organizing workspace: ${workspace.name}\n`);

  // Get all scopes
  const scopes = await client.listScopes(workspace.id);
  console.log(`Found ${scopes.length} scopes:`);
  scopes.forEach((scope) => {
    console.log(`  ${scope.position}. ${scope.name} (${scope.cards_count} cards)`);
  });

  // Get all cards
  const cardsResponse = await client.listCards(workspace.id);
  const cards = cardsResponse.data;
  console.log(`\nFound ${cards.length} cards:`);
  cards.forEach((card) => {
    const scope = scopes.find((s) => s.id === card.scope_id);
    console.log(`  ${card.position}. ${card.name} [${scope?.name}]`);
  });

  // Reverse scope order
  console.log('\n🔄 Reversing scope order...\n');
  const reversedScopes = [...scopes]
    .sort((a, b) => a.position - b.position)
    .reverse()
    .map((scope, index) => ({
      id: scope.id,
      position: index + 1,
    }));

  // Reverse card order within each scope
  const cardsByScope = cards.reduce(
    (acc, card) => {
      if (!acc[card.scope_id]) {
        acc[card.scope_id] = [];
      }
      acc[card.scope_id].push(card);
      return acc;
    },
    {} as Record<string, typeof cards>
  );

  const reorderedCards: Array<{ id: string; position: number; scope_id?: string }> = [];
  Object.entries(cardsByScope).forEach(([scopeId, scopeCards]) => {
    const sorted = [...scopeCards].sort((a, b) => a.position - b.position).reverse();
    sorted.forEach((card, index) => {
      reorderedCards.push({
        id: card.id,
        position: index,
      });
    });
  });

  const result = await client.organizeWorkspace(workspace.id, {
    scopes: reversedScopes,
    cards: reorderedCards,
  });

  console.log('✅ Workspace organized!');
  console.log(`   Scopes updated: ${result.scopes_updated}`);
  console.log(`   Cards updated: ${result.cards_updated}`);

  // Display new order
  console.log('\n📋 New order:\n');
  const newScopes = await client.listScopes(workspace.id);
  console.log('Scopes:');
  newScopes.forEach((scope) => {
    console.log(`  ${scope.position}. ${scope.name}`);
  });

  const newCardsResponse = await client.listCards(workspace.id);
  const newCards = newCardsResponse.data;
  console.log('\nCards by scope:');
  newScopes.forEach((scope) => {
    console.log(`\n  ${scope.name}:`);
    const scopeCards = newCards
      .filter((c) => c.scope_id === scope.id)
      .sort((a, b) => a.position - b.position);
    scopeCards.forEach((card) => {
      console.log(`    ${card.position}. ${card.name}`);
    });
  });

  // Restore original order
  console.log('\n🔄 Restoring original order...\n');
  await client.organizeWorkspace(workspace.id, {
    scopes: scopes.map((scope) => ({
      id: scope.id,
      position: scope.position,
    })),
    cards: cards.map((card) => ({
      id: card.id,
      position: card.position,
    })),
  });

  console.log('✅ Original order restored!');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
