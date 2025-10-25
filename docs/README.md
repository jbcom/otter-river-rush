# Otter River Rush Documentation

Welcome to the comprehensive documentation for Otter River Rush, a TypeScript-based endless runner game.

## 📚 Documentation Structure

### Architecture & Design
Foundational documents describing the system architecture and design decisions:
- [Architecture Overview](./architecture/README.md) - System architecture and technical decisions

### Implementation Guides
Step-by-step guides and implementation details:
- [Implementation Status](./implementation/README.md) - Current implementation status
- [Sprite Generation](./implementation/SPRITE_GENERATION.md) - How sprites were generated
- [Sprite Integration](./implementation/SPRITE_INTEGRATION.md) - Sprite system integration
- [Visual Testing](./implementation/VISUAL_TESTING.md) - Visual regression testing overview
- [Asset Management](./implementation/ASSETS.md) - Asset attribution and sources

### Memory Bank
Active development context and progress tracking (aligned with .clinerules):
- [Project Brief](./memory-bank/projectbrief.md) - Core requirements and goals
- [Product Context](./memory-bank/productContext.md) - Why this exists and user goals
- [Active Context](./memory-bank/activeContext.md) - Current work focus and decisions
- [System Patterns](./memory-bank/systemPatterns.md) - TOC linking to architecture docs
- [Tech Context](./memory-bank/techContext.md) - TOC linking to tech setup docs
- [Progress](./memory-bank/progress.md) - What works, what's left, current status

## 🚀 Quick Links

### For New Contributors
1. Start with [README.md](../README.md) in the root
2. Review [CONTRIBUTING.md](../CONTRIBUTING.md) for development workflow
3. Read [Architecture Overview](./architecture/README.md) to understand the system
4. Check [Implementation Status](./implementation/README.md) for current state

### For Maintainers
1. Keep [Memory Bank](./memory-bank/) updated with current context
2. Review [Active Context](./memory-bank/activeContext.md) before starting work
3. Update [Progress](./memory-bank/progress.md) after significant changes

## 📋 Documentation Principles

### DRY (Don't Repeat Yourself)
- Single source of truth for each concept
- Use references and links instead of duplication
- Memory bank files use TOCs linking to detailed docs

### Memory Bank Alignment
This structure follows the `.clinerules` memory bank pattern:
- **Frozen Architecture**: Core system design in `architecture/`
- **Active Context**: Current work in `memory-bank/activeContext.md`
- **Progress Tracking**: Status in `memory-bank/progress.md`
- **Pattern References**: TOCs in memory bank link to detailed docs

### Organization
- **Architecture**: Stable, frozen documentation of system design
- **Implementation**: Detailed guides that evolve with features
- **Memory Bank**: Active working context for AI and developers

## 🔄 Maintenance

### When to Update
- **Memory Bank**: Update after every significant change or session
- **Architecture**: Only update when fundamental design changes
- **Implementation**: Update when features are added/changed

### Update Process
1. Make changes to code/features
2. Update relevant implementation docs
3. Update memory-bank/activeContext.md and progress.md
4. Rarely: Update architecture/ if fundamentals change

## 📖 Document Formats

All documentation uses Markdown with:
- Clear hierarchical headers
- Code examples where helpful
- Links to related documents
- Mermaid diagrams for visual representation
- TOC at top of longer documents

---

**Last Updated**: 2025-10-25  
**Structure Version**: 1.0
