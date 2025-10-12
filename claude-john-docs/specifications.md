# Who's That Witch? - Specifications

## Project Overview

**Project Name:** Who's That Witch?
**Project Type:** Halloween-themed matching/memory tile game
**Location:** `/games/whosThatWitch/`
**Status:** Baseline/Foundation Stage
**Date Started:** October 11, 2025
**Last Updated:** October 12, 2025

## Project Concept

A matching tile game where players:
1. Turn over tiles to reveal witch character images
2. Match two identical tiles together
3. Identify which witch character is shown (this is the twist!)
4. Score points based on matches and correct identification

**The Core Gameplay:** Players flip tiles to find matching pairs of witch characters. Once a match is found, they must correctly identify which witch it is to score points and continue.

## Game Container Specifications

**Exact Dimensions:** 950×714 pixels
- **Width:** 950px (exact)
- **Height:** 714px (not 720px - see rationale below)
- **Borders/Padding:** None - the container is completely invisible
- **Background:** Dark brown (#2a1f1a) for Halloween atmosphere

**Rationale for 714px Height:**
The game is designed to fit inside a parent Halloween minigames app. The parent app has a center panel of 950×720 pixels, but 3px borders on top and bottom reduce usable space to 950×714. This ensures the game fits perfectly without any overflow or clipping.

## Parent App Integration

This game is NOT standalone - it will be integrated into the Halloween Minigames collection at `/halloween/index.html`.

**Parent App Layout:**
- Total area: 1280×720 pixels
- Left nav: 250px (game info, score)
- Center game area: 950×720px (your game goes here)
- Right nav: 250px (collapsible game menu)

**Integration Method:**
- Game will be dynamically loaded as an ES6 module
- Must export default class with required methods (see specifications-technical.md)
- Game HTML will be injected into parent's `#game-content` div

## Asset Inventory

### Witch Character Images

**Total Characters:** 76 unique witch characters
**Source Material:** Movies, TV shows, books, anime, and cartoons
**Image Formats:** PNG with transparency (RGBA)

**Available Sizes:**
- Original: Various sizes (stored in `assets/witches/`)
- 166×166 pixels (stored in `assets/166sized/`) - NEW
- 124×124 pixels (stored in `assets/124sized/`) - NEW
- 99×99 pixels (stored in `assets/99sized/`) - NEW

**Legacy Sizes (may still exist):**
- 176×176, 132×132, 70×70 (can be ignored or deleted)

### Character Roster

Characters include iconic witches such as:
- Elphaba & Glinda (Wicked, Wizard of Oz, Broadway)
- Endora, Samantha, Tabitha (Bewitched)
- Hermione, Professor McGonagall (Harry Potter)
- Sabrina & Salem (Sabrina the Teenage Witch)
- Wednesday, Morticia, Grandmama (The Addams Family)
- Willow (Buffy the Vampire Slayer)
- Kiki (Kiki's Delivery Service)
- Yubaba (Spirited Away)
- Melisandre (Game of Thrones)
- And 67 more...

## Design Decisions

### Visual Design

**Color Palette (Halloween Theme):**
- Dark browns: #1a1410, #261a10, #2a1f1a, #3d2817
- Orange accents: #ff6600 (primary), #ff8c42 (highlights)
- Warm earth tones for inviting Halloween atmosphere

**Typography:**
- Font family: Arial (simple, readable)
- Sizes and weights: TBD based on game UI needs

### Game Mechanics (To Be Designed)

**Current Decisions:**
- Match 2 tiles to find a pair
- Player must identify the witch after matching
- Scoring based on matches + correct identification

**Still To Be Determined:**
- How many tiles on screen? (12? 16? 20?)
- What tile size to use? (99px? 124px? 166px?)
- How to handle tile layout? (Grid? Scattered? Organized rows?)
- Tile back design (face-down appearance)
- Flip animation style
- Input method for witch identification (text? multiple choice?)
- Scoring formula
- Timer or untimed?
- Lives/mistakes allowed?

## Current State: Clean Baseline

As of October 12, 2025, the project consists of:
- **HTML:** Minimal structure with 950×714 game div
- **CSS:** Basic styling with Halloween theme and centered container
- **JavaScript:** Simple initialization that verifies container dimensions
- **Assets:** 76 witch images ready to be resized to chosen dimensions

The project is a blank canvas ready for game implementation to begin.

## Development Philosophy

Following John's preferences:
- **Incremental development:** Build and test one feature at a time
- **Simple, understandable code:** Prioritize readability over performance
- **Well-documented:** Clear comments explaining logic and decisions
- **Functional approach:** Prefer functional programming patterns when appropriate
- **Wait for approval:** Don't implement major features without user confirmation

## Next Major Decisions Needed

1. **Tile count and size:** How many tiles? What size (99/124/166)?
2. **Layout approach:** Grid layout or custom positioning?
3. **Tile design:** What should face-down tiles look like?
4. **Interaction flow:** Exact steps from start to witch identification
5. **Scoring system:** How are points calculated?
6. **UI elements:** What displays are needed (score, timer, instructions, etc.)?
