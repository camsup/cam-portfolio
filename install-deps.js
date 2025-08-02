#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing essential dependencies...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing npm dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install additional essential packages
  console.log('\n🔧 Installing additional essential packages...');
  const essentialPackages = [
    'zustand',
    'clsx',
    'tailwind-merge',
    'class-variance-authority',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'date-fns',
    'react-error-boundary',
    'react-helmet-async',
    'react-router-dom'
  ];
  
  execSync(`npm install ${essentialPackages.join(' ')}`, { stdio: 'inherit' });
  
  // Install dev dependencies
  console.log('\n🛠️ Installing development dependencies...');
  const devPackages = [
    'prettier',
    '@types/node',
    'cross-env',
    'dotenv'
  ];
  
  execSync(`npm install --save-dev ${devPackages.join(' ')}`, { stdio: 'inherit' });
  
  console.log('\n✅ All dependencies installed successfully!');
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Create .env file from env.template');
  
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  process.exit(1);
} 