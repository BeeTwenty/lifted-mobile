# Pull latest changes from GitHub
Write-Host "Pulling latest changes from GitHub..." -ForegroundColor Cyan
git pull origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Run npm install
Write-Host "Running npm install..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }



Write-Host "Running npm build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }


# Run npx cap sync
Write-Host "Running npx cap sync..." -ForegroundColor Cyan
npx cap sync
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Open Android Studio
Write-Host "Opening Android Studio..." -ForegroundColor Cyan
npx cap open android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "All tasks completed successfully!" -ForegroundColor Green
