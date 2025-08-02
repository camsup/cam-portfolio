#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 GitHub Pages Deployment Script');
console.log('================================\n');

// Check if we're in a git repository
function checkGitStatus() {
  try {
    execSync('git status', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if gh-pages is installed
function checkGhPages() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.devDependencies && packageJson.devDependencies['gh-pages'];
  } catch (error) {
    return false;
  }
}

// Main deployment function
async function deploy() {
  try {
    // Check git status
    if (!checkGitStatus()) {
      console.log('❌ Not in a git repository!');
      console.log('Please run: git init');
      return;
    }

    // Check if gh-pages is installed
    if (!checkGhPages()) {
      console.log('📦 Installing gh-pages...');
      execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
    }

    // Build the project
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // Check if build was successful
    if (!fs.existsSync('dist')) {
      console.log('❌ Build failed - dist folder not found');
      return;
    }

    // Deploy to GitHub Pages
    console.log('🚀 Deploying to GitHub Pages...');
    execSync('npm run deploy', { stdio: 'inherit' });

    console.log('\n✅ Deployment successful!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your GitHub repository');
    console.log('2. Go to Settings > Pages');
    console.log('3. Set source to "Deploy from a branch"');
    console.log('4. Select "gh-pages" branch');
    console.log('5. Save and wait for deployment');
    console.log('\n🌐 Your site will be available at:');
    console.log('https://[your-username].github.io/[repository-name]/');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have a GitHub repository');
    console.log('2. Check your .env file has correct API keys');
    console.log('3. Ensure all dependencies are installed');
    console.log('4. Try running: npm install && npm run build');
  }
}

// Run deployment
deploy(); 