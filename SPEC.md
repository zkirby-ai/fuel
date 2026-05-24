# Fuel — Product Spec

## Summary
Fuel is a mobile-first food logger with a protein-forward bias.
It is built to be fast enough for real daily use and light enough that logging food does not feel like opening a corporate nutrition spreadsheet.

## Product goal
Help users stay aware of intake — especially protein and calories — with as little friction and guilt as possible.

## Product principles
- fast daily logging
- protein-forward, not macro-maniac by default
- low judgment
- mobile-first and one-hand usable
- useful enough to stick

## Intended user
Primary user:
- someone who wants better intake awareness
- someone training, trying to hit protein, or loosely tracking calories
- someone who hates overbuilt food apps

## v1 shape
### Today
- total calories
- total protein
- quick-add repeat meals
- list of meals already logged today

### Log
- add meal manually
- food name
- meal type
- calories
- protein
- optional note

### History
- very lightweight pattern view
- enough to show consistency trends
- not a huge analytics dashboard yet

## Nice characteristics
The app should feel:
- clean
- calm
- practical
- non-punitive

## Non-goals for v1
- giant food database
- barcode scanner
- micronutrient overkill
- social features
- recipe management
- full MyFitnessPal competitor complexity

## Feature roadmap
### v1
- manual logging
- quick-add favorites/recent meals
- daily calories + protein totals
- mobile-first PWA shell

### v2
- edit/delete entries
- reusable recent meals
- better history and daily summaries
- targets by user preference

### v3
- streaks / adherence views
- richer macro support
- optional reminders
- meal templates / recurring meals

## Success criteria
Fuel wins if:
- it is fast enough that the user actually logs meals
- protein and calorie awareness improves
- it stays simple instead of decaying into nutrition sludge
