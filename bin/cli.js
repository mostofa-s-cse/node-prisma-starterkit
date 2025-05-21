#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repo = 'https://github.com/mostofa-s-cse/nodejs-api-starter.git';
const projectName = process.argv[2] || 'my-api-project';

try {
  console.log(`Cloning ${repo} into ${projectName}...`);
  execSync(`git clone ${repo} ${projectName}`, { stdio: 'inherit' });
  console.log('\n✅ Project created successfully!');
} catch (err) {
  console.error('❌ Error cloning repo:', err.message);
}
