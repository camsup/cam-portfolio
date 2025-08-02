# Security Cleanup Script
# This script helps secure your repository by removing exposed API keys

Write-Host "🔒 Security Cleanup Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Remove the file with exposed API key
$exposedFile = "-files  Where-Object { `$_ -like  .env  }"
if (Test-Path $exposedFile) {
    Write-Host "Removing exposed API key file..." -ForegroundColor Yellow
    Remove-Item $exposedFile -Force
    Write-Host "✅ Exposed file removed" -ForegroundColor Green
} else {
    Write-Host "✅ No exposed file found" -ForegroundColor Green
}

# Check if .env file exists and is properly ignored
if (Test-Path ".env") {
    Write-Host "⚠️  .env file found - make sure it's in .gitignore" -ForegroundColor Yellow
} else {
    Write-Host "✅ No .env file found (good for security)" -ForegroundColor Green
}

# Check .gitignore
$gitignore = Get-Content ".gitignore" -ErrorAction SilentlyContinue
if ($gitignore -contains ".env") {
    Write-Host "✅ .env is properly ignored in .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env not found in .gitignore - adding it" -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Environment variables`n.env`n.env.local`n.env.development.local`n.env.test.local`n.env.production.local"
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a .env file with your actual API keys" -ForegroundColor White
Write-Host "2. Use env.template as a reference" -ForegroundColor White
Write-Host "3. Never commit .env files to git" -ForegroundColor White
Write-Host "4. Consider rotating your API keys if they were exposed" -ForegroundColor White

Write-Host "`n✅ Security cleanup complete!" -ForegroundColor Green 