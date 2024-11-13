#!/bin/bash
# Save as update-and-deploy.sh (Mac/Linux) or update-and-deploy.bat (Windows)

# Update the image list
python3 update_images.py

# Git commands
git add js/main.js
git commit -m "Update past events image list"
git push

echo "Updated and deployed successfully!"