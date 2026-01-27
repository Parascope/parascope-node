#!/usr/bin/env tsx
/**
 * Example: Create a card with content
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

  console.log(`📂 Using workspace: ${workspace.name}\n`);

  // Get default scope
  const scopes = await client.listScopes(workspace.id);
  const defaultScope = scopes.find((s) => s.is_default);

  if (!defaultScope) {
    console.error('No default scope found');
    process.exit(1);
  }

  // Create a new card
  const cardName = `test-card-${Date.now()}`;
  const cardContent = `---
test-card:
  created_at: ${new Date().toISOString()}
  description: This is a test card created via API
  tags:
    - test
    - example
    - api
  links:
    github: https://github.com/example/repo
    docs: https://docs.example.com
`;

  console.log(`📝 Creating card: ${cardName}\n`);
  const card = await client.createCard(workspace.id, {
    name: cardName,
    content: cardContent,
    scope_id: defaultScope.id,
  });

  console.log('✅ Card created successfully!');
  console.log(`   ID: ${card.id}`);
  console.log(`   Name: ${card.name}`);
  console.log(`   Scope: ${defaultScope.name}`);
  console.log(`   Position: ${card.position}`);
  console.log('\nContent:');
  console.log(card.content);

  // Update the card
  console.log('\n🔄 Updating card content...\n');
  const updatedCard = await client.updateCard(card.id, {
    content: cardContent + '\n  updated: true\n',
  });

  console.log('✅ Card updated successfully!');
  console.log('\nNew content:');
  console.log(updatedCard.content);

  // Clean up: delete the card
  console.log('\n🗑️  Cleaning up: deleting card...\n');
  await client.deleteCard(card.id);
  console.log('✅ Card deleted successfully!');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
