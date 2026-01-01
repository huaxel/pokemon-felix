#!/bin/bash

# --- CONFIGURATION ---
AI_DIR="docs/ai"
PULSE_FILE="$AI_DIR/current_pulse.md"
# Files/Folders to ignore in the tree view (adjust as needed)
IGNORE_PATTERN="node_modules|.git|dist|build|coverage|.DS_Store|.gemini"

# --- EXECUTION ---

echo "💡 Generating Project Pulse..."

# 1. HEADER & TIMESTAMP
echo "# 📡 PROJECT PULSE (Mobile Context)" > "$PULSE_FILE"
echo "**Generated:** $(date)" >> "$PULSE_FILE"
echo "" >> "$PULSE_FILE"

# 2. THE VISION (Architecture)
echo "## 🏛️ 1. ARCHITECTURE & VISION" >> "$PULSE_FILE"
if [ -f "$AI_DIR/architecture.md" ]; then
    cat "$AI_DIR/architecture.md" >> "$PULSE_FILE"
else
    echo "⚠️ No architecture.md found." >> "$PULSE_FILE"
fi
echo "" >> "$PULSE_FILE"

# 3. THE REALITY (Active State)
echo "## 📰 2. ACTIVE STATE & TASKS" >> "$PULSE_FILE"
if [ -f "$AI_DIR/active_state.md" ]; then
    cat "$AI_DIR/active_state.md" >> "$PULSE_FILE"
else
    echo "⚠️ No active_state.md found." >> "$PULSE_FILE"
fi
echo "" >> "$PULSE_FILE"

# 4. THE MAP (File Tree)
# Gives the AI spatial awareness of your code layout
echo "## 🗺️ 3. PROJECT MAP" >> "$PULSE_FILE"
echo "\`\`\`" >> "$PULSE_FILE"
if command -v tree &> /dev/null; then
    tree -I "$IGNORE_PATTERN" --prune -L 3 >> "$PULSE_FILE"
else
    # Fallback if 'tree' is not installed
    find . -maxdepth 3 -not -path '*/.*' | grep -vE "$IGNORE_PATTERN" >> "$PULSE_FILE"
fi
echo "\`\`\`" >> "$PULSE_FILE"

# 4. CORE TYPE DEFINITIONS (For Context)
# Key interfaces and types that define the game structure
echo "## 🔧 4. KEY PROJECT FILES" >> "$PULSE_FILE"
echo "\`\`\`" >> "$PULSE_FILE"
echo "# Key React contexts and hooks" >> "$PULSE_FILE"
ls -lh src/contexts/*.jsx 2>/dev/null | tail -n +2 >> "$PULSE_FILE" || echo "# No contexts found" >> "$PULSE_FILE"
echo "" >> "$PULSE_FILE"
echo "# Key components" >> "$PULSE_FILE"
ls -lh src/components/*.jsx 2>/dev/null | head -n 10 >> "$PULSE_FILE" || echo "# No components found" >> "$PULSE_FILE"
echo "\`\`\`" >> "$PULSE_FILE"
echo "" >> "$PULSE_FILE"

# 5. PROJECT OVERVIEW
# Include the README for project context
echo "## 🎮 5. PROJECT OVERVIEW" >> "$PULSE_FILE"
if [ -f "README.md" ]; then
    head -n 50 "README.md" >> "$PULSE_FILE"
else
    echo "⚠️ No README found." >> "$PULSE_FILE"
fi
echo "" >> "$PULSE_FILE"

# 6. CURRENT ROADMAP
# What features are planned/in-progress
echo "## 🗺️ 6. ROADMAP STATUS" >> "$PULSE_FILE"
if [ -f "roadmap.md" ]; then
    head -n 100 "roadmap.md" >> "$PULSE_FILE"
else
    echo "⚠️ No roadmap found." >> "$PULSE_FILE"
fi
echo "" >> "$PULSE_FILE"

# 8. THE BLEEDING EDGE (Git Status)
# Shows what files you are currently touching/modifying
echo "## 🩸 7. UNCOMMITTED CHANGES" >> "$PULSE_FILE"
echo "\`\`\`diff" >> "$PULSE_FILE"
git status -s >> "$PULSE_FILE"
echo "---" >> "$PULSE_FILE"
git diff HEAD --stat >> "$PULSE_FILE"
echo "\`\`\`" >> "$PULSE_FILE"

# 9. SYNC TO CLOUD
echo "🚀 Pushing Pulse to GitHub..."
git add "$PULSE_FILE"
git commit -m "chore: update pulse for mobile sync [skip ci]"
git push origin master

echo "✅ Pulse Updated. You are clear to leave the desk."
