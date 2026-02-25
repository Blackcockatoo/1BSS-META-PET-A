# Meta-Pet Tester Checklist 🧬🎮

## Pre-Testing Setup

### Environment Check
- [ ] Node.js version 18+ installed
- [ ] npm/yarn dependency manager available
- [ ] Project dependencies installed (`npm ci`)
- [ ] Development server runs without errors (`npm run dev`)
- [ ] App accessible at `http://localhost:3000`
- [ ] Browser console clear of critical errors on load
- [ ] IndexedDB available in browser DevTools

### Device/Browser Testing
- [ ] Desktop browser (Chrome/Edge/Firefox/Safari)
- [ ] Mobile browser (iOS Safari, Chrome Mobile)
- [ ] Tablet browser
- [ ] Different screen sizes (1920x1080, 1024x768, 375x667)
- [ ] Offline mode (DevTools Network: Offline)
- [ ] Battery saver/reduced motion settings tested

---

## Core Identity & Pet Generation

### PrimeTail ID System
- [ ] Pet generation creates unique crest
- [ ] Crest displays vault, rotation, and tail digits
- [ ] DNA hash present in crest
- [ ] Mirror DNA hash present in crest
- [ ] HMAC signature present and valid
- [ ] DNA never appears raw in UI or console
- [ ] Each generated pet has unique hashes
- [ ] Crest remains consistent on page reload
- [ ] Crest exports with sealed export functionality

### HeptaCode Visual Rendering
- [ ] HeptaTag renders as 7-sided polygon
- [ ] Seed of Life renders with 7 circles
- [ ] 42-digit base-7 encoding displayed
- [ ] HeptaCode updates correctly on export
- [ ] Visual representation matches crest data
- [ ] Colors map correctly to vault/rotation

### Genome System
- [ ] Pet has Red60 (physical traits) genome
- [ ] Pet has Blue60 (personality traits) genome
- [ ] Pet has Black60 (latent traits) genome
- [ ] Traits derive deterministically from DNA hashes
- [ ] Same pet always shows same traits
- [ ] Traits include body type, colors, patterns, features
- [ ] Personality stats (temperament, energy, social, curiosity) display
- [ ] Latent traits (evolution path, rare abilities) show in trait panel
- [ ] Genome hashes stored, never raw genome

---

## Visual Pet Sprite

### Sprite Rendering
- [ ] SVG pet renders correctly on page load
- [ ] Body type matches genome (Spherical, Crystalline, Amorphous, etc.)
- [ ] Primary and secondary colors apply correctly
- [ ] Pattern textures render (solid, dotted, striped, spotted)
- [ ] Special features render when present:
  - [ ] Horns appear and scale correctly
  - [ ] Wings position and animate
  - [ ] Tail flame displays
  - [ ] Aura glows behind pet
  - [ ] Third eye renders when applicable
  - [ ] Crown positions on head
- [ ] Pet animations play smoothly
- [ ] Pet reflects current mood state (happy, tired, hungry)
- [ ] Sprite updates when vitals change
- [ ] Sprite responsive on different screen sizes

### Sprite Interactions
- [ ] Clicking pet shows interaction feedback
- [ ] Pet responds to care actions (feeding, petting, etc.)
- [ ] Sprite animations play during interactions
- [ ] Pet sprite visible on pet page
- [ ] Pet sprite visible in archive/list view

---

## Vitals System

### Real-Time Vitals Loop
- [ ] Hunger stat displays (0-100 scale)
- [ ] Hygiene stat displays (0-100 scale)
- [ ] Mood stat displays (0-100 scale)
- [ ] Energy stat displays (0-100 scale)
- [ ] Vitals decay over time (hunger/hygiene decrease)
- [ ] Vitals tick occurs every 1000ms
- [ ] Vitals persist in IndexedDB
- [ ] Vitals load correctly on page reload

### Vitals Interactions
- [ ] Feed button increases hunger stat
- [ ] Feed has cooldown period
- [ ] Wash/hygiene action increases hygiene
- [ ] Play action increases mood
- [ ] Rest action increases energy
- [ ] Vitals don't exceed 100
- [ ] Vitals don't go below 0
- [ ] Actions have appropriate cooldowns
- [ ] Pet enters distressed state at low vitals
- [ ] Visual feedback displays for all actions

### Background Pause
- [ ] Tab pause detected when switching tabs
- [ ] Vitals don't decay while tab inactive
- [ ] Vitals resume decaying when tab active
- [ ] Battery optimized (no background ticking)
- [ ] Pause/resume works across multiple tab switches

---

## Evolution System

### 4-Stage Evolution
- [ ] Pet starts in GENETICS stage
- [ ] GENETICS → NEURO transition works with requirements
- [ ] NEURO → QUANTUM transition works with requirements
- [ ] QUANTUM → SPECIATION transition works with requirements
- [ ] Evolution requirements display clearly
- [ ] Age requirement tracks correctly
- [ ] Interaction count requirement displays
- [ ] Vitals progress requirement shows
- [ ] Evolution celebration displays with stage-specific lore
- [ ] Pet appearance changes at each evolution stage
- [ ] Evolution is permanent and cannot be reversed

### Evolution Requirements
- [ ] NEURO requires: 60+ minutes age, 10+ interactions, 50+ avg vitals
- [ ] QUANTUM requires: 12+ hours age, 50+ interactions, 70+ avg vitals
- [ ] SPECIATION requires: 48+ hours age, 200+ interactions, 80+ avg vitals
- [ ] Requirement progress bars display
- [ ] Requirement descriptions are clear
- [ ] Evolution gates prevent premature advancement

---

## Vimana Exploration System

### Grid Exploration
- [ ] 4×4 Vimana grid generates
- [ ] Grid is deterministic based on pet genome
- [ ] 4 field types present: Calm, Neuro, Quantum, Earth
- [ ] Each cell has visual indicator color
- [ ] Cells show explored vs unexplored state
- [ ] Cell intensity values display (0-100)
- [ ] Grid matches pet's exploration history on reload

### Field Scanning
- [ ] Can select unexplored cells
- [ ] "Explore Cell" button reveals properties
- [ ] Calm field rewards: +8 mood, +5 energy
- [ ] Neuro field rewards: +6 mood, +8 energy
- [ ] Quantum field rewards: +10 mood, +10 energy
- [ ] Earth field rewards: +7 mood, +6 energy
- [ ] Vitals update after cell exploration
- [ ] Cell becomes marked as explored
- [ ] Cannot re-explore same cell (at same evolution stage)

### Anomaly Detection
- [ ] Anomalies spawn ~15% of cells
- [ ] Three anomaly types exist:
  - [ ] Energy anomalies reward +15 energy
  - [ ] Mood anomalies reward +12 mood
  - [ ] Rare anomalies reward +20 mood and +20 energy
- [ ] Anomaly resolution button appears
- [ ] Resolving anomalies provides rewards
- [ ] Anomaly count tracks
- [ ] Anomalies visual indicators display

### Sample Collection
- [ ] Samples collected from explored cells
- [ ] Sample count increments
- [ ] Samples persist across sessions
- [ ] Sample collection influences cosmetics unlocks
- [ ] Total samples displayed in UI

---

## Battle System

### Arena UI
- [ ] Battle tab accessible in Features Dashboard
- [ ] 8 opponents listed with names and difficulty tiers
- [ ] Current win streak displays
- [ ] Energy shield meter shows (0-100)
- [ ] Battle difficulty selector available (Novice → Adept → Expert → Master)
- [ ] "Enter Battle" button present
- [ ] Opponent information displays before battle

### Battle Mechanics
- [ ] Battle starts when "Enter Battle" clicked
- [ ] Pet energy/mood/hygiene factor into win probability
- [ ] Energy shield regenerates when vitals > 70%
- [ ] Win/loss determined fairly based on vitals
- [ ] Battle result displays immediately
- [ ] Victory/defeat messages contextually appropriate
- [ ] Win streak increments on victory
- [ ] Win streak resets to 0 on loss
- [ ] Battle stats persist in IndexedDB
- [ ] Streak bonuses apply to cosmetics/rewards

### Battle Opponents
- [ ] All 8 opponent types appear in rotation:
  - [ ] Echo Wisp
  - [ ] Prism Lurker
  - [ ] Dream Stag
  - [ ] Aurora Fox
  - [ ] Void Watcher
  - [ ] Crystal Sentinel
  - [ ] Shadow Wraith
  - [ ] Luminescence Drake
- [ ] Opponent difficulty increases as streak grows
- [ ] Opponent selection varies on each battle
- [ ] Opponent stats display correctly

---

## Mini-Games System

### Pattern Recognition Game
- [ ] Game accessible in Games tab
- [ ] Pattern displays as 3-8 length sequence
- [ ] Visual pattern clear and readable
- [ ] Player can input pattern using controls
- [ ] Directional inputs (up/down/left/right) work
- [ ] Pattern validation accurate
- [ ] Accuracy score displays
- [ ] Mood rewards granted based on performance
- [ ] Difficulty selector (3-8) works
- [ ] Game resets properly for next round

### Memory Game
- [ ] Game accessible in Games tab
- [ ] Pattern recall test presents
- [ ] Quick pattern display (2-3 seconds)
- [ ] Player recalls pattern from memory
- [ ] Score based on vitals and accuracy
- [ ] Rewards up to +10 mood
- [ ] Game difficulty adapts to pet vitals
- [ ] Game timer works correctly
- [ ] Replayable multiple times

### Rhythm Sync Game
- [ ] Game accessible in Games tab
- [ ] Beat synchronization mechanic clear
- [ ] Timing feedback shows (early/late/perfect)
- [ ] Energy-based scoring system
- [ ] Energy rewards up to +12 energy
- [ ] Game rhythm matches pet personality traits
- [ ] Visual beat indicators present
- [ ] Audio cues play (if enabled)
- [ ] Game difficulty scales with vitals

### Vimana Meditation Game (Tetris-like)
- [ ] Game accessible in Games tab
- [ ] Line clearing mechanics work
- [ ] Combo system rewards consecutive clears
- [ ] Rewards mood + energy combined
- [ ] Game speed increases with difficulty
- [ ] Game persists state until completion
- [ ] Score tracking accurate
- [ ] Game reset available

### Mini-Game Rewards
- [ ] Daily bonus multiplier (1.5×) applies after 24hr break
- [ ] Bonus timer displays countdown
- [ ] Rewards apply to pet vitals correctly
- [ ] High scores persist in IndexedDB
- [ ] Mini-game stats display in achievements panel

---

## Cosmetics System

### Cosmetics Catalog
- [ ] Cosmetics tab accessible in Features Dashboard
- [ ] 10 cosmetic items display
- [ ] Items organized by category:
  - [ ] Accessories: Golden Crown, Sacred Halo, Crystal Horns
  - [ ] Auras: Rainbow, Void, Flame
  - [ ] Patterns: Starfield, Sacred Geometry
  - [ ] Effects: Sparkle Trail, Quantum Shimmer
- [ ] Rarity tiers display (Common, Rare, Epic, Legendary)
- [ ] Visual previews show correctly
- [ ] Rarity colors match tier system
- [ ] Category filtering works

### Cosmetics Unlocking
- [ ] Locked cosmetics show unlock conditions
- [ ] Conditions tracked accurately:
  - [ ] Evolution milestones (SPECIATION, QUANTUM)
  - [ ] Battle achievements (50+ wins)
  - [ ] Exploration goals (100 samples, all 16 cells)
  - [ ] Breeding milestones (5+ offspring)
  - [ ] Mini-game mastery (20+ plays)
- [ ] Progress bars show toward unlock
- [ ] Cosmetics unlock when conditions met
- [ ] Unlocked cosmetics become equippable

### Cosmetics Equipping
- [ ] Can equip unlocked cosmetics
- [ ] Multiple cosmetics can be equipped simultaneously
- [ ] Equipped cosmetics appear on pet sprite
- [ ] Can unequip cosmetics
- [ ] Unequipped cosmetics remain unlocked
- [ ] Equipped status persists across reloads
- [ ] Cosmetics display over pet sprite correctly
- [ ] Multiple cosmetics render without conflicts

---

## Achievements System

### Achievement Tracking
- [ ] Achievements tab accessible
- [ ] 17 achievements total display
- [ ] 5 categories present:
  - [ ] Care (Novice Caretaker, Master Caretaker, Perfect Day)
  - [ ] Battle (First Victory, Battle Veteran, Battle Master, Unstoppable)
  - [ ] Exploration (First Scan, Field Researcher, Anomaly Hunter, Cartographer)
  - [ ] Evolution (First Evolution, Quantum Being, Speciation)
  - [ ] Social/Breeding (First Offspring, Lineage Keeper, Dynasty Founder)
- [ ] Category filtering works
- [ ] Achievement names and descriptions display
- [ ] Achievement icons show

### Achievement Progress
- [ ] Progress bars display for incomplete achievements
- [ ] Progress updates in real-time
- [ ] Completion percentage shows
- [ ] Achievement unlocks when conditions met
- [ ] Unlock timestamp records
- [ ] Unlocked achievements highlight visually
- [ ] Total points display correctly
- [ ] Point tiers accurate:
  - [ ] Bronze: 10 pts
  - [ ] Silver: 25 pts
  - [ ] Gold: 50 pts
  - [ ] Platinum: 100 pts

### Achievement Conditions
- [ ] "First Victory": Award on first battle win
- [ ] "Battle Veteran": Award at 10 wins
- [ ] "Battle Master": Award at 50 wins
- [ ] "Unstoppable": Award at 10-win streak
- [ ] "First Scan": Award on first cell exploration
- [ ] "Cartographer": Award on all 16 cells explored
- [ ] "Anomaly Hunter": Award on 5 anomalies resolved
- [ ] "First Evolution": Award on reaching NEURO
- [ ] "Quantum Being": Award on reaching QUANTUM
- [ ] "Speciation": Award on reaching SPECIATION
- [ ] "Perfect Day": Award on 100% vitals for 1 hour
- [ ] "Master Caretaker": Award on 80+ vitals for 24 hours
- [ ] Achievement rewards apply correctly

---

## Addon System

### Addon Display
- [ ] Profile button opens profile panel
- [ ] Addons tab accessible in profile panel
- [ ] Addons inventory button opens addon list
- [ ] 12 addon templates display
- [ ] Addons organized by category:
  - [ ] Headwear: Wizard Hat, Celestial Crown, Mask of the Void
  - [ ] Weapons: Wizard Staff
  - [ ] Accessories: Shadow Cloak, Phoenix Wings
  - [ ] Auras: Prismatic Aura
  - [ ] Companions: Floating Familiar, Crystal Heart
  - [ ] Effects: Holographic Vault, Ethereal Background, Quantum Data Flow
- [ ] Addon rarity displays (Epic, Legendary, Mythic)
- [ ] Edition limits show (e.g., "25/25 editions")
- [ ] Addon descriptions present

### Addon Minting & Equipping
- [ ] Can equip available addons
- [ ] Equipped addons appear on pet sprite
- [ ] Addons render at correct positions
- [ ] Can unequip addons
- [ ] Multiple addons can be equipped simultaneously
- [ ] Equipped addons persist on reload
- [ ] Addon status displays (equipped/unequipped)

### Addon Positioning
- [ ] Edit Mode button enables drag mode
- [ ] Addons become draggable when Edit Mode active
- [ ] Can reposition addons with mouse/touch drag
- [ ] Position updates visually in real-time
- [ ] Lock button available for each addon
- [ ] Locked addons cannot be moved
- [ ] Reset button restores default position
- [ ] Lock/unlock persists on reload
- [ ] Position coordinates saved correctly

### Addon Stat Bonuses
- [ ] Each addon provides stat bonuses:
  - [ ] Energy modifier (e.g., +5)
  - [ ] Curiosity modifier (e.g., +8)
  - [ ] Bond modifier (e.g., +15)
  - [ ] Luck modifier (e.g., +10)
- [ ] Total bonuses from all equipped addons sum correctly
- [ ] Bonuses apply to vitals/stats
- [ ] Bonuses remove when addon unequipped
- [ ] Bonus display shows in UI

### Addon Cryptography
- [ ] Addons have dual ECDSA P-256 signatures
- [ ] Owner signature verifies correctly
- [ ] Issuer signature verifies correctly
- [ ] Signatures validate on addon load
- [ ] Verification status displays (verified/unverified)
- [ ] Cannot forge addon signatures
- [ ] Edition number tracks (1-N based on rarity)

---

## Lineage & Breeding System

### Coat of Arms Display
- [ ] Coat of Arms (heraldic shield) renders on profile
- [ ] Shield displays full heraldic design
- [ ] Division type shows (e.g., quarterly, per-pale)
- [ ] Tinctures (colors) display correctly:
  - [ ] Or (gold)
  - [ ] Argent (silver)
  - [ ] Azure (blue)
  - [ ] Gules (red)
  - [ ] Sable (black)
  - [ ] Vert (green)
  - [ ] Purpure (purple)
  - [ ] Tenné (orange)
- [ ] Charges (symbols) display:
  - [ ] Star, moon, sun, cross, chevron
  - [ ] Lion, eagle, tree, flower
  - [ ] Crown, key, sword, book, orb
- [ ] Lineage markers show on shield border
- [ ] Generation number displays

### Breeding
- [ ] Breeding system integrates with evolution
- [ ] Can breed only at SPECIATION stage
- [ ] Can breed two pets together
- [ ] Offspring gets new unique coat of arms
- [ ] Offspring coat inherits from both parents:
  - [ ] 45% from parent 1
  - [ ] 45% from parent 2
  - [ ] 10% mutation chance
- [ ] Division may combine from parents
- [ ] Colors inherit from both parents
- [ ] Charges mix (1-2 from each parent)
- [ ] Generation number increments
- [ ] Lineage markers update

### Lineage Analysis
- [ ] Lineage analysis shows:
  - [ ] Total generations back
  - [ ] Unique ancestor count
  - [ ] Founder count
  - [ ] Dominant tinctures
  - [ ] Dominant charges
  - [ ] Inbreeding coefficient
  - [ ] Lineage purity percentage
- [ ] Analysis updates after breeding
- [ ] Analysis data persists

---

## Data Persistence

### IndexedDB Storage
- [ ] Pet data saves to IndexedDB
- [ ] Vitals persist across reload
- [ ] Evolution state persists
- [ ] Battle stats persist
- [ ] Mini-game progress persists
- [ ] Cosmetics unlocks persist
- [ ] Achievements persist
- [ ] Addon equipment persists
- [ ] Addon positions persist
- [ ] Lineage data persists
- [ ] Autosave occurs every 60 seconds

### Pet Export/Import
- [ ] JSON export available
- [ ] Exported file downloads
- [ ] JSON export contains all pet data
- [ ] Can import JSON back
- [ ] Import restores all pet data
- [ ] Import overwrites current pet (with confirmation)
- [ ] Export includes vita hashes

### Sealed Export
- [ ] Sealed export available
- [ ] Export cryptographically signed with HMAC
- [ ] Sealed file contains integrity check
- [ ] Can verify sealed export before import
- [ ] Verification shows valid/invalid status
- [ ] Can import verified sealed export
- [ ] Sealed import restores all data correctly
- [ ] Export/import doesn't expose raw DNA

### Archive/Multi-Pet Management
- [ ] Archive manager accessible
- [ ] Can save multiple pets
- [ ] Can switch between pets
- [ ] Can rename pets
- [ ] Can delete pets (with confirmation)
- [ ] Archive displays all saved pets
- [ ] Archive persists across sessions
- [ ] Can export individual pet from archive
- [ ] Can import pet into archive

---

## Privacy & Security

### DNA Privacy
- [ ] Raw DNA never displays in UI
- [ ] Raw DNA not visible in browser console
- [ ] Raw DNA not in exported JSON
- [ ] Raw DNA not in sealed export
- [ ] Only DNA hashes shared externally
- [ ] DNA stays on device only
- [ ] DNA never sent over network

### Cryptographic Verification
- [ ] HMAC signature verifies crest integrity
- [ ] PrimeTail ID signature present
- [ ] Signature validates on load
- [ ] Addon signatures verify
- [ ] Sealed export HMAC validates
- [ ] Can detect tampered data
- [ ] Verification failures show error message

### Privacy Presets
- [ ] Three share presets available:
  - [ ] Stealth: Tail digits only
  - [ ] Standard: Vault + rotation (hashes private)
  - [ ] Radiant: Full crest metadata
- [ ] Preset selector available
- [ ] Preset changes HeptaCode digits
- [ ] Preset persists on reload
- [ ] Preset respected in exports
- [ ] Preset selection modifies what data shares

### Offline Functionality
- [ ] App works with network disabled
- [ ] All features available offline
- [ ] No network requests for gameplay
- [ ] Data syncs only if network available
- [ ] Offline mode indicated in UI
- [ ] Can play indefinitely offline
- [ ] Functionality unchanged online vs offline

---

## UI/UX Testing

### Navigation
- [ ] Main page loads without errors
- [ ] Pet page accessible from main page
- [ ] Pet selection/archive works
- [ ] Back navigation works
- [ ] All menu items clickable
- [ ] Tabs switch content correctly
- [ ] Modal dialogs open/close properly
- [ ] Keyboard navigation works (Tab key)

### Responsive Design
- [ ] UI responsive on 375px width (mobile)
- [ ] UI responsive on 768px width (tablet)
- [ ] UI responsive on 1024px width (laptop)
- [ ] UI responsive on 1920px width (desktop)
- [ ] Text readable on all sizes
- [ ] Buttons clickable on touch devices
- [ ] Modals fit on small screens
- [ ] Horizontal scrolling minimal

### Visual Polish
- [ ] Animations smooth and not jarring
- [ ] Loading states show while data loads
- [ ] Error messages clear and helpful
- [ ] Success messages confirm actions
- [ ] Color contrast accessible (WCAG AA+)
- [ ] Icons meaningful and clear
- [ ] Spacing consistent throughout
- [ ] Fonts readable and professional

### Accessibility
- [ ] Alt text on images where applicable
- [ ] Form labels associated with inputs
- [ ] Buttons have visible focus states
- [ ] Keyboard shortcuts work
- [ ] Screen reader compatible (basic test)
- [ ] Color not only indicator of status
- [ ] Motion settings respected
- [ ] Touch targets min 44×44px

---

## Performance Testing

### Load Performance
- [ ] Page loads in under 2 seconds (cold start)
- [ ] JavaScript bundle reasonable size
- [ ] CSS bundle reasonable size
- [ ] No layout shifts during load
- [ ] Images lazy-loaded where applicable
- [ ] SVG rendering performant

### Runtime Performance
- [ ] Vitals tick runs at 1000ms interval
- [ ] No jank during animations
- [ ] Battle calculations instant
- [ ] Mini-game mechanics responsive
- [ ] Scrolling smooth (60fps where possible)
- [ ] Memory usage stable over time
- [ ] No memory leaks detected (DevTools)
- [ ] Background tasks don't block UI

### Mobile Performance
- [ ] Battery usage reasonable
- [ ] Background pause working
- [ ] Responsive touch interactions
- [ ] No excessive CPU usage
- [ ] Mobile DevTools shows good metrics
- [ ] Storage usage reasonable (< 50MB)

---

## Error Handling

### Error States
- [ ] Invalid pet data shows error
- [ ] Corrupted export shows error
- [ ] IndexedDB access failure handled
- [ ] Network failures graceful
- [ ] Invalid user input handled
- [ ] Out of bounds values handled
- [ ] Browser storage full handled
- [ ] Permission errors shown

### Error Messages
- [ ] Error messages are clear
- [ ] Error messages suggest action
- [ ] No cryptic error codes alone
- [ ] Error recovery possible where applicable
- [ ] Retry buttons present when helpful
- [ ] Cancel/back buttons available

### Logging
- [ ] Console errors minimal
- [ ] Console warnings few and explained
- [ ] Useful debug info available
- [ ] Can disable logging if needed
- [ ] Performance metrics loggable

---

## Cross-Browser Testing

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] No console errors
- [ ] Performance good
- [ ] DevTools compatible

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Performance good
- [ ] IndexedDB works

### Safari (Desktop)
- [ ] All features work
- [ ] Crypto API supported
- [ ] IndexedDB works
- [ ] Animations smooth

### Safari (iOS)
- [ ] Touch interactions work
- [ ] Offline mode works
- [ ] Home screen PWA works
- [ ] Camera/file access (if needed)

### Chrome Mobile (Android)
- [ ] Touch responsive
- [ ] Offline works
- [ ] PWA installable
- [ ] Performance acceptable

---

## Edge Cases & Stress Testing

### Extreme Values
- [ ] Vitals don't go below 0 or above 100
- [ ] Age doesn't overflow
- [ ] Interaction counts don't overflow
- [ ] Evolution stage doesn't exceed maximum
- [ ] Addons don't duplicate
- [ ] Grid cells don't multiply
- [ ] Achievements don't double-award

### Data Stress
- [ ] 1000+ interactions tracked correctly
- [ ] 100+ samples collected correctly
- [ ] 50+ breeding offspring tracked
- [ ] Multiple pets in archive (10+)
- [ ] Export/import still valid
- [ ] No data loss with high activity

### Long Sessions
- [ ] App stable after 8+ hours playtime
- [ ] Vitals tracking accurate over time
- [ ] Battle streaks don't break
- [ ] IndexedDB doesn't become corrupted
- [ ] Memory doesn't grow unbounded
- [ ] Autosave continues working

### Rapid Interactions
- [ ] Feed spam doesn't break vitals
- [ ] Battle spam handled (cooldowns work)
- [ ] Mini-game rapid restarts work
- [ ] Quick position changes don't corrupt data
- [ ] Rapid navigation doesn't crash

---

## Regression Testing

### Previous Features
- [ ] All Phase 1-2 features still work
- [ ] Identity system unchanged
- [ ] Genome system unchanged
- [ ] Vitals system unchanged
- [ ] Evolution system unchanged
- [ ] Vimana exploration works (v7)
- [ ] Battle system works (v7)
- [ ] Mini-games work (v7)
- [ ] Cosmetics work (v7)
- [ ] Achievements work (v7)
- [ ] No previously working features broken

---

## Final Checklist Items

### Code Quality
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles without errors
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No commented-out code blocks
- [ ] No console.log debug statements
- [ ] No secrets in code

### Documentation
- [ ] README updated with new features
- [ ] Quick Start Guide current
- [ ] Feature implementation docs complete
- [ ] Code comments where logic complex
- [ ] Type definitions clear
- [ ] API documentation present

### Sign-Off
- [ ] All critical items tested ✓
- [ ] All high-priority items tested ✓
- [ ] All medium-priority items tested ✓
- [ ] No known critical bugs
- [ ] No known high-priority bugs
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Ready for release: YES / NO

---

## Testing Notes

### Bugs Found
(Document any issues discovered during testing)

| Bug # | Title | Severity | Steps | Status |
|-------|-------|----------|-------|--------|
| B001 | | Critical/High/Medium/Low | | Open/Fixed/Verified |
|     |     |     |     |     |

### Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Cold Start | < 2s | | Pass/Fail |
| First Interaction | < 100ms | | Pass/Fail |
| Vitals Tick Accuracy | ±50ms | | Pass/Fail |
| Memory (1hr) | < 100MB | | Pass/Fail |
| Bundle Size | < 500KB | | Pass/Fail |

### Test Environments

| Device | OS | Browser | Version | Status |
|--------|----|---------|---------| -------|
| Desktop | Windows | Chrome | Latest | Pass/Fail |
| Desktop | macOS | Safari | Latest | Pass/Fail |
| Tablet | iOS | Safari | Latest | Pass/Fail |
| Mobile | Android | Chrome | Latest | Pass/Fail |

---

## Sign-Off

**Tester Name:** ___________________
**Date:** ___________________
**Build Version:** ___________________
**Overall Status:** ✓ PASS / ✗ NEEDS FIXES

**Approved By:** ___________________
**Date:** ___________________

---

**Last Updated:** 2026-02-24
**Version:** 1.0
**Created for:** Meta-Pet v8 (Addon & Lineage Systems)
