#!/bin/bash
# Move node_modules to backup
mv node_modules/* node_modules_backup/

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
