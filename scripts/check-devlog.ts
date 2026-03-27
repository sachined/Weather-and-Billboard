#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const DEVLOG_PATH = path.join(process.cwd(), 'source', 'DEVLOG_SOURCE.md');

interface Commit {
  hash: string;
  message: string;
  files: string[];
}

function getLastDevlogUpdate(): string {
  try {
    const output = execSync(
      `git log -1 --format=%H -- "${DEVLOG_PATH}"`,
      { encoding: 'utf-8' }
    ).trim();
    return output;
  } catch {
    // If DEVLOG was never committed, return first commit
    try {
      return execSync('git rev-list --max-parents=0 HEAD', {
        encoding: 'utf-8',
      }).trim();
    } catch {
      return 'HEAD~999'; // Fallback for fresh repos
    }
  }
}

function getCommitsSince(since: string): Commit[] {
  try {
    const output = execSync(
      `git log ${since}..HEAD --pretty=format:%H%n%s%n%b%n---END---`,
      { encoding: 'utf-8' }
    );

    const commits: Commit[] = [];
    const commitBlocks = output.split('---END---').filter((b) => b.trim());

    for (const block of commitBlocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 2) continue;

      const hash = lines[0];
      const message = lines[1];

      // Get files changed in this commit
      let files: string[] = [];
      try {
        const filesOutput = execSync(`git diff-tree --no-commit-id --name-only -r ${hash}`, {
          encoding: 'utf-8',
        });
        files = filesOutput
          .split('\n')
          .filter((f) => f.trim() && !f.includes('.next') && !f.includes('node_modules'));
      } catch {
        // Ignore if files can't be fetched
      }

      commits.push({ hash: hash.substring(0, 7), message, files });
    }

    return commits;
  } catch (err) {
    return [];
  }
}

function formatCommitDisplay(commits: Commit[]): string {
  if (commits.length === 0) return 'No commits since last DEVLOG update.';

  let output = `\n📝 Commits since last DEVLOG_SOURCE.md update:\n`;
  output += `${'━'.repeat(60)}\n`;

  for (const commit of commits) {
    output += `\n🔗 ${commit.hash} — ${commit.message}\n`;
    if (commit.files.length > 0) {
      output += `   Files: ${commit.files.slice(0, 3).join(', ')}${
        commit.files.length > 3 ? ` (+${commit.files.length - 3} more)` : ''
      }\n`;
    }
  }

  output += `\n${'━'.repeat(60)}\n`;
  return output;
}

function getTemplate(nextNumber: number): string {
  return `
### ${nextNumber}. [Your Title]

[Context]: Explain the problem or decision.

[Tradeoff/Decision]: What did you choose and why? What's the consequence?

---
`;
}

async function promptUser(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  const lastUpdate = getLastDevlogUpdate();
  const commits = getCommitsSince(lastUpdate);

  if (commits.length === 0) {
    console.log('✅ No commits since last DEVLOG update.');
    return;
  }

  console.log(formatCommitDisplay(commits));

  const shouldUpdate = await promptUser(
    '❓ Any engineering decisions here worth documenting? (y/n): '
  );

  if (shouldUpdate) {
    // Count existing decisions in DEVLOG
    const devlogContent = fs.readFileSync(DEVLOG_PATH, 'utf-8');
    const decisionCount = (devlogContent.match(/^### \d+\./gm) || []).length;
    const nextNumber = decisionCount + 1;

    console.log(`\n📄 Template for decision #${nextNumber}:\n`);
    console.log(getTemplate(nextNumber));

    console.log('\n💡 How to update:');
    console.log(`1. Open: source/DEVLOG_SOURCE.md`);
    console.log(`2. Add your decision(s) at the end, before the closing ---`);
    console.log(`3. Use the template above as a guide`);
    console.log(`4. Stage DEVLOG_SOURCE.md: git add source/DEVLOG_SOURCE.md`);
    console.log(`5. Re-push: git push`);
  } else {
    console.log('\n✅ Proceeding without DEVLOG update.');
  }
}

main().catch(console.error);
