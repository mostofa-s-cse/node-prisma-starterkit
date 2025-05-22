#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectName = process.argv[2] || 'my-api'; // Default fallback name

const repo = 'https://github.com/mostofa-s-cse/nodejs-api-starter.git';

try {
  console.log(`Cloning ${repo} into "${projectName}"...`);
  execSync(`git clone ${repo} ${projectName}`, { stdio: 'inherit' });
  console.log(`\n✅ Project created in "${projectName}"`);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
