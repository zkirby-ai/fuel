# Fuel — Product Spec

## Summary
Fuel is a mobile-first food logger with a protein-forward bias.
It is built to be fast enough for real daily use and light enough that logging food does not feel like opening a corporate nutrition spreadsheet.

It now also serves a second, equally important job:
- tracking whether stomach pain / digestive discomfort is happening
- and noticing whether certain meals seem to correlate with it

## Product goal
Help users stay aware of intake — especially protein and calories — while also spotting patterns between food and digestive discomfort.

## Product principles
- fast daily logging
- protein-forward, not macro-maniac by default
- low judgment
- mobile-first and one-hand usable
- useful enough to stick
- symptom tracking should stay lightweight, not clinical sludge

## Intended user
Primary user:
- someone who wants better intake awareness
- someone training, trying to hit protein, or loosely tracking calories
- someone who hates overbuilt food apps
- someone trying to notice when food may be linked to stomach pain, bloating, reflux, or general digestive issues

## v1 shape
### Today
- total calories
- total protein
- quick-add repeat meals
- list of meals already logged today
- daily stomach status
- optional daily stomach note

### Log
- add meal manually
- food name
- meal type
- calories
- protein
- optional reaction after meal
- optional note

### History
- lightweight pattern view
- average protein / calories
- best protein day
- count of bad stomach days
- most common meal reaction

## Digestive tracking model
### Day-level
A simple daily stomach status:
- Good
- Okay
- Off
- Hurting

### Meal-level
A lightweight reaction tag:
- Fine
- Bloated
- Crampy
- Reflux
- Nauseous

This is intentionally simple. The goal is pattern recognition, not medical diagnosis.

## Nice characteristics
The app should feel:
- clean
- calm
- practical
- non-punitive
- useful for noticing patterns without becoming health anxiety software

## Non-goals for v1
- giant food database
- barcode scanner
- micronutrient overkill
- social features
- recipe management
- full MyFitnessPal competitor complexity
- medical-grade symptom diagnosis

## Feature roadmap
### v1
- manual logging
- quick-add favorites/recent meals
- daily calories + protein totals
- daily stomach status
- per-meal reaction tags
- mobile-first PWA shell

### v2
- edit/delete entries
- reusable recent meals
- better history and daily summaries
- targets by user preference
- stronger stomach-pattern correlation views

### v3
- streaks / adherence views
- richer macro support
- optional reminders
- recurring meals / meal templates
- maybe ingredient-level pattern tags if they prove useful

## Success criteria
Fuel wins if:
- it is fast enough that the user actually logs meals
- protein and calorie awareness improves
- stomach-pain patterns become more visible than memory alone
- it stays simple instead of decaying into nutrition or health sludge
