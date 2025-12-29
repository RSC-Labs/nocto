#!/bin/bash

# Medusa Dashboard Upgrade Script
# This script downloads the latest version of @medusajs/dashboard and extracts it
# while preserving custom files with NoctoSlot
#
# Usage:
#   ./upgrade-medusa.sh          # Run upgrade without TypeScript check
#   ./upgrade-medusa.sh --check  # Run upgrade and verify excluded files for errors

set -e

# Parse command line arguments
RUN_CHECK=false
if [[ "$1" == "--check" ]]; then
    RUN_CHECK=true
fi

# Colors for messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
NOCTO_SRC="$PROJECT_ROOT/packages/nocto/src"
NOCTO_PACKAGE_JSON="$PROJECT_ROOT/packages/nocto/package.json"
TEMP_DIR=$(mktemp -d)

# Files to exclude (relative paths from packages/nocto/src)
MANUAL_EXCLUSIONS=(
    "dashboard-app/routes/utils.ts"
    "dashboard-app/routes/get-route.map.tsx"
    "main.tsx"
    "app.tsx"
)

# Function to detect files with NoctoSlot
detect_noctoslot_files() {
    local search_dir="$1"
    local -n result_array=$2
    
    echo -e "${GREEN}🔍 Detecting files containing <NoctoSlot...${NC}"
    
    # Search for files containing <NoctoSlot (excluding plugin-system and plugins)
    while IFS= read -r file; do
        # Convert absolute path to relative path from $NOCTO_SRC
        rel_path="${file#$search_dir/}"
        
        # Ignore files in plugin-system/ and plugins/
        if [[ "$rel_path" == plugin-system/* ]] || [[ "$rel_path" == plugins/* ]]; then
            continue
        fi
        
        result_array+=("$rel_path")
        echo -e "  ${YELLOW}→${NC} Detected: $rel_path"
    done < <(grep -rl --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" "<NoctoSlot" "$search_dir" 2>/dev/null || true)
    
    echo -e "${GREEN}✓ ${#result_array[@]} file(s) with NoctoSlot detected${NC}"
}

# Array to store detected NoctoSlot files
NOCTOSLOT_EXCLUSIONS=()

echo -e "${GREEN}🚀 Starting Medusa Dashboard upgrade...${NC}"

# Cleanup on error
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up temporary files...${NC}"
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Step 1: Download package metadata
echo -e "${GREEN}📦 Fetching latest version...${NC}"
PACKAGE_INFO=$(curl -s https://registry.npmjs.org/@medusajs/dashboard/latest)
VERSION=$(echo "$PACKAGE_INFO" | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4)
TARBALL_URL=$(echo "$PACKAGE_INFO" | grep -o '"tarball":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$VERSION" ] || [ -z "$TARBALL_URL" ]; then
    echo -e "${RED}❌ Error: Unable to fetch package information${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Version found: ${VERSION}${NC}"
echo -e "${GREEN}✓ URL: ${TARBALL_URL}${NC}"

# Fetch @medusajs/ui version
echo -e "${GREEN}📦 Fetching @medusajs/ui latest version...${NC}"
UI_PACKAGE_INFO=$(curl -s https://registry.npmjs.org/@medusajs/ui/latest)
UI_VERSION=$(echo "$UI_PACKAGE_INFO" | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$UI_VERSION" ]; then
    echo -e "${RED}❌ Error: Unable to fetch @medusajs/ui version${NC}"
    exit 1
fi

echo -e "${GREEN}✓ @medusajs/ui version found: ${UI_VERSION}${NC}"

# Step 2: Download tarball
echo -e "${GREEN}📥 Downloading tarball...${NC}"
cd "$TEMP_DIR"
curl -sL "$TARBALL_URL" -o dashboard.tgz

if [ ! -f dashboard.tgz ]; then
    echo -e "${RED}❌ Error: Download failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Download completed${NC}"

# Step 3: Extract tarball
echo -e "${GREEN}📂 Extracting tarball...${NC}"
tar -xzf dashboard.tgz

if [ ! -d "package/src" ]; then
    echo -e "${RED}❌ Error: Unexpected tarball structure${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Extraction completed${NC}"

# Step 4: Detect files with NoctoSlot
detect_noctoslot_files "$NOCTO_SRC" NOCTOSLOT_EXCLUSIONS

# Step 5: Backup files to exclude
echo -e "${GREEN}💾 Backing up custom files...${NC}"
BACKUP_DIR="$TEMP_DIR/backup"
mkdir -p "$BACKUP_DIR"

# Backup manual files
for file in "${MANUAL_EXCLUSIONS[@]}"; do
    if [ -f "$NOCTO_SRC/$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname "$file")"
        cp "$NOCTO_SRC/$file" "$BACKUP_DIR/$file"
        echo -e "  ${YELLOW}→${NC} Backed up: $file"
    fi
done

# Backup NoctoSlot files
for file in "${NOCTOSLOT_EXCLUSIONS[@]}"; do
    if [ -f "$NOCTO_SRC/$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname "$file")"
        cp "$NOCTO_SRC/$file" "$BACKUP_DIR/$file"
        echo -e "  ${YELLOW}→${NC} Backed up: $file"
    fi
done

echo -e "${GREEN}✓ Backup completed${NC}"

# Step 6: Copy new files
echo -e "${GREEN}📋 Copying new files...${NC}"
rsync -av --delete \
    --exclude="plugin-system/" \
    --exclude="plugins/" \
    "$TEMP_DIR/package/src/" "$NOCTO_SRC/"
echo -e "${GREEN}✓ Copy completed (plugin-system/ and plugins/ preserved)${NC}"

# Step 7: Restore excluded files
echo -e "${GREEN}♻️  Restoring custom files...${NC}"

# Restore manual files
for file in "${MANUAL_EXCLUSIONS[@]}"; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" "$NOCTO_SRC/$file"
        echo -e "  ${YELLOW}→${NC} Restored: $file"
    fi
done

# Restore NoctoSlot files
for file in "${NOCTOSLOT_EXCLUSIONS[@]}"; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" "$NOCTO_SRC/$file"
        echo -e "  ${YELLOW}→${NC} Restored: $file"
    fi
done

echo -e "${GREEN}✓ Restoration completed${NC}"

# Step 8: Update package.json with new versions
echo -e "${GREEN}📝 Updating package.json with new @medusajs versions...${NC}"

if [ ! -f "$NOCTO_PACKAGE_JSON" ]; then
    echo -e "${RED}❌ Error: package.json not found at $NOCTO_PACKAGE_JSON${NC}"
    exit 1
fi

# Create backup of package.json
cp "$NOCTO_PACKAGE_JSON" "$NOCTO_PACKAGE_JSON.backup"

# Function for cross-platform sed in-place editing
sed_inplace() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "$@"
    else
        sed -i "$@"
    fi
}

# Extract all @medusajs packages from package.json
echo -e "${GREEN}🔍 Detecting @medusajs packages in package.json...${NC}"

# Store original package.json content to avoid reading modified file
PACKAGE_JSON_CONTENT=$(cat "$NOCTO_PACKAGE_JSON")

# Extract package names
MEDUSA_PACKAGES=$(echo "$PACKAGE_JSON_CONTENT" | grep -o '"@medusajs/[^"]*"' | sed 's/"//g' | sort -u)

# Count packages
PACKAGE_COUNT=$(echo "$MEDUSA_PACKAGES" | wc -l)
echo -e "  ${YELLOW}→${NC} Found $PACKAGE_COUNT @medusajs package(s)"

# Update each @medusajs package
UPDATED_COUNT=0
echo "$MEDUSA_PACKAGES" | while IFS= read -r package; do
    if [ -z "$package" ]; then
        continue
    fi
    
    # Extract package name without @medusajs/ prefix
    package_name="${package#@medusajs/}"
    
    # Determine which version to use
    if [ "$package" = "@medusajs/ui" ]; then
        target_version="$UI_VERSION"
        echo -e "  ${YELLOW}→${NC} Updating $package to $target_version (UI version)"
    else
        target_version="$VERSION"
        echo -e "  ${YELLOW}→${NC} Updating $package to $target_version (Dashboard version)"
    fi
    
    # Update the package version (using | as delimiter to avoid conflicts with /)
    sed_inplace "s|\"$package\": \"[^\"]*\"|\"$package\": \"$target_version\"|g" "$NOCTO_PACKAGE_JSON"
done

# Count actual updates
UPDATED_COUNT=$(echo "$MEDUSA_PACKAGES" | grep -c .)

echo -e "${GREEN}✓ package.json updated${NC}"
echo -e "  ${YELLOW}→${NC} $UPDATED_COUNT @medusajs package(s) updated"
echo -e "  ${YELLOW}→${NC} Dashboard version: $VERSION"
echo -e "  ${YELLOW}→${NC} @medusajs/ui version: $UI_VERSION"
echo -e "  ${YELLOW}→${NC} Backup saved at: $NOCTO_PACKAGE_JSON.backup"

# Step 9: Display warnings
echo ""
echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║                       ⚠️  WARNING  ⚠️                           ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}The following files/directories have been EXCLUDED from the update.${NC}"
echo -e "${YELLOW}You will need to update them MANUALLY if necessary.${NC}"
echo ""
echo -e "${RED}📁 Custom directories (fully preserved):${NC}"
echo -e "   ${RED}• plugin-system/${NC}"
echo -e "   ${RED}• plugins/${NC}"
echo ""
echo -e "${RED}📝 Custom configuration files:${NC}"
for file in "${MANUAL_EXCLUSIONS[@]}"; do
    echo -e "   ${RED}• $file${NC}"
done
echo ""
echo -e "${RED}🔌 Files containing NoctoSlot components (${#NOCTOSLOT_EXCLUSIONS[@]} file(s)):${NC}"
if [ ${#NOCTOSLOT_EXCLUSIONS[@]} -eq 0 ]; then
    echo -e "   ${GREEN}• No files with NoctoSlot detected${NC}"
else
    for file in "${NOCTOSLOT_EXCLUSIONS[@]}"; do
        echo -e "   ${RED}• $file${NC}"
    done
fi
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ Update completed successfully!${NC}"
echo -e "${GREEN}📌 Dashboard version: ${VERSION}${NC}"
echo -e "${GREEN}📌 @medusajs/ui version: ${UI_VERSION}${NC}"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to run:${NC}"
echo -e "   ${YELLOW}npm install${NC} or ${YELLOW}yarn install${NC} to update dependencies"
echo ""

# Optional Step 10: Run TypeScript check on excluded files
if [ "$RUN_CHECK" = true ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🔍 Running TypeScript check on excluded files (--check mode)...${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Collect all excluded files
    ALL_EXCLUDED_FILES=()
    for file in "${MANUAL_EXCLUSIONS[@]}"; do
        if [ -f "$NOCTO_SRC/$file" ]; then
            ALL_EXCLUDED_FILES+=("$NOCTO_SRC/$file")
        fi
    done
    
    for file in "${NOCTOSLOT_EXCLUSIONS[@]}"; do
        if [ -f "$NOCTO_SRC/$file" ]; then
            ALL_EXCLUDED_FILES+=("$NOCTO_SRC/$file")
        fi
    done
    
    if [ ${#ALL_EXCLUDED_FILES[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ No excluded files to check${NC}"
    else
        echo -e "  ${YELLOW}→${NC} Checking ${#ALL_EXCLUDED_FILES[@]} excluded file(s)..."
        
        # Check if we're in the nocto package directory
        NOCTO_DIR="$PROJECT_ROOT/packages/nocto"
        
        # Check if TypeScript compiler is available
        if command -v npx &> /dev/null && [ -f "$NOCTO_DIR/tsconfig.json" ]; then
            echo -e "  ${YELLOW}→${NC} Running TypeScript compilation check (this may take a moment)..."
            echo -e "  ${YELLOW}→${NC} Working directory: $NOCTO_DIR"
            
            # Save current directory
            ORIGINAL_DIR=$(pwd)
            
            # Run TypeScript compiler
            cd "$NOCTO_DIR" || {
                echo -e "${RED}❌ Failed to change to $NOCTO_DIR${NC}"
                cd "$ORIGINAL_DIR"
                exit 1
            }
            
            TSC_OUTPUT=$(npx tsc --noEmit --pretty false 2>&1 || true)
            
            # Return to original directory
            cd "$ORIGINAL_DIR"
            
            # Debug: show if TSC found any errors
            if [ -n "$TSC_OUTPUT" ]; then
                echo -e "  ${YELLOW}→${NC} TypeScript output captured ($(echo "$TSC_OUTPUT" | wc -l) lines)"
            else
                echo -e "  ${GREEN}→${NC} No TypeScript errors found in the project"
            fi
            
            # Collect errors for each excluded file
            LINT_ERRORS=0
            ERRORS_FILE="$TEMP_DIR/errors_summary.txt"
            OK_FILES="$TEMP_DIR/ok_files.txt"
            > "$ERRORS_FILE"  # Clear file
            > "$OK_FILES"     # Clear file
            
            echo -e "  ${YELLOW}→${NC} Analyzing errors for excluded files..."
            
            for file_path in "${ALL_EXCLUDED_FILES[@]}"; do
                rel_path="${file_path#$NOCTO_SRC/}"
                
                # Extract errors for this specific file
                FILE_ERROR_OUTPUT=$(echo "$TSC_OUTPUT" | grep "$rel_path" || true)
                
                if [ -n "$FILE_ERROR_OUTPUT" ]; then
                    echo "=== $rel_path ===" >> "$ERRORS_FILE"
                    echo "$FILE_ERROR_OUTPUT" >> "$ERRORS_FILE"
                    echo "" >> "$ERRORS_FILE"
                    LINT_ERRORS=$((LINT_ERRORS + 1))
                else
                    echo "$rel_path" >> "$OK_FILES"
                fi
            done
            
            echo -e "  ${YELLOW}→${NC} Analysis complete: $LINT_ERRORS file(s) with errors"
            
            echo ""
            echo -e "  ${YELLOW}→${NC} Preparing results display..."
            echo ""
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}                    TypeScript Check Results                    ${NC}"
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            
            # Show files without errors first
            if [ -s "$OK_FILES" ]; then
                OK_COUNT=$(wc -l < "$OK_FILES")
                echo -e "${GREEN}✓ Files without errors ($OK_COUNT):${NC}"
                while IFS= read -r file; do
                    echo -e "  ${GREEN}✓${NC} $file"
                done < "$OK_FILES"
                echo ""
            fi
            
            # Show files with errors
            if [ $LINT_ERRORS -gt 0 ] && [ -f "$ERRORS_FILE" ]; then
                echo -e "${RED}✗ Files with errors (${LINT_ERRORS}):${NC}"
                echo ""
                
                # Parse the errors file with simpler approach
                current_file=""
                error_count=0
                
                while IFS= read -r line || [ -n "$line" ]; do
                    # Check if line is a file marker
                    if echo "$line" | grep -q "^=== .* ===$"; then
                        # New file section
                        if [ -n "$current_file" ]; then
                            echo ""
                        fi
                        current_file=$(echo "$line" | sed 's/^=== \(.*\) ===$/\1/')
                        echo -e "  ${RED}✗ $current_file${NC}"
                        error_count=0
                    elif [ -n "$line" ] && [ -n "$current_file" ]; then
                        # Error line
                        if [ $error_count -lt 10 ]; then
                            # Show the error (trim long lines)
                            error_msg=$(echo "$line" | cut -c1-120)
                            echo -e "     ${YELLOW}│${NC} $error_msg"
                            error_count=$((error_count + 1))
                        fi
                    fi
                done < "$ERRORS_FILE"
                
                echo ""
                echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                echo -e "${RED}❌ Summary: $LINT_ERRORS file(s) with TypeScript errors${NC}"
                echo -e "${YELLOW}   These files have broken imports or type issues after the upgrade${NC}"
                echo -e "${YELLOW}   Please review and fix these files manually before building${NC}"
                echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            else
                echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                echo -e "${GREEN}✅ All excluded files passed TypeScript check!${NC}"
                echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            fi
            
            echo -e "  ${YELLOW}→${NC} Check complete!"
        else
            echo -e "  ${YELLOW}→${NC} TypeScript not available, skipping lint check"
            echo -e "  ${YELLOW}→${NC} Run 'yarn build' manually to check for errors"
        fi
    fi
    
    echo ""
    echo -e "${GREEN}✓ TypeScript check section completed${NC}"
    echo ""
else
    echo -e "${YELLOW}💡 Tip: Run with --check to verify excluded files for TypeScript errors${NC}"
    echo ""
fi

echo -e "${GREEN}✓ Script execution completed${NC}"