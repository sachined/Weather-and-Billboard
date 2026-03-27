#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const hooksDir = path.join(process.cwd(), '.git', 'hooks');
const prePushHook = path.join(hooksDir, 'pre-push');

// Ensure hooks directory exists
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// Create pre-push hook if it doesn't exist
const hookContent = `#!/bin/bash

# Pre-push hook: Check if DEVLOG_SOURCE.md needs updating
# To skip: git push --no-verify

npm run check-devlog
exit_code=$?

if [ $exit_code -eq 0 ]; then
  exit 0
fi

# Allow override with --no-verify if user chooses not to update
exit 0
`;

if (!fs.existsSync(prePushHook)) {
  fs.writeFileSync(prePushHook, hookContent);
  console.log('✅ Created pre-push hook');
} else {
  console.log('⚠️  pre-push hook already exists');
}

// Make hook executable (Unix-like systems)
try {
  execSync(`chmod +x "${prePushHook}"`);
  console.log('✅ Made pre-push hook executable');
} catch (err) {
  console.log('ℹ️  (Skipped chmod — Windows/Git Bash may not require it)');
}

console.log('\n✅ Setup complete!\n');
console.log('When you git push, the hook will:');
console.log('1. Check for commits since DEVLOG_SOURCE.md was last updated');
console.log('2. Show you a summary of changes');
console.log('3. Ask if any are decision-worthy');
console.log('4. Provide a template if yes\n');
console.log('To skip the hook: git push --no-verify');
