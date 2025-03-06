
#!/bin/bash

# This script helps set up the development environment on Linux

echo "Setting up development environment for Linux..."

# Remove problematic files
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

echo "Setup complete! You can now run 'npm run dev'"
