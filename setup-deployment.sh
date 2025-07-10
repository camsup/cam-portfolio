#!/bin/bash

# Personal Homepage Deployment Script
# Run this after creating your GitHub repository

echo "🚀 Setting up your personal homepage for deployment..."

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Download from: https://git-scm.com/download/windows"
    exit 1
fi

# Get repository information
read -p "Enter your GitHub username: " username
read -p "Enter your repository name: " repo_name
read -p "Enter your custom domain (optional, press Enter to skip): " domain

# Update vite.config.ts with repository name
sed -i "s|// base: '/your-repo-name/',|base: '/$repo_name/',|g" vite.config.ts

# Update CNAME file if domain provided
if [ -n "$domain" ]; then
    echo "$domain" > public/CNAME
    echo "✅ CNAME file updated with: $domain"
else
    rm -f public/CNAME
    echo "ℹ️  No custom domain specified"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Personal homepage"

# Add remote origin
git remote add origin "https://github.com/$username/$repo_name.git"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/$username/$repo_name/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Select 'main' branch and '/ (root)' folder"
echo "4. Click Save"
echo ""
echo "Your site will be available at:"
echo "📍 https://$username.github.io/$repo_name/"
if [ -n "$domain" ]; then
    echo "📍 https://$domain (after DNS setup)"
fi
echo ""
echo "To deploy updates:"
echo "npm run deploy"
