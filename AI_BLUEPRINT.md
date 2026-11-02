# hao-test — Bookins.io AI Application Blueprint

- **Organization:** john
- **Live Origin:** `https://hao-test.apps.bookins.io`
- **Archetype:** `dao_governance` (Cooperative, HOA & DAO Governance Portal (Steward + Voting Member))
- **Theme Palette:** `civic_gold`
- **Generation Engine:** Bookins Role-Aware Archetype Compiler

---

## 1. Configured PermSet Generation Roles (No-Code Bookins Registry)

These roles are automatically registered on your Bookins.io client record (`collections.clients.permsetRoles`) and appear in **Bookins.io -> Add Permset -> Creation Mode** without requiring any code changes:

- **Steward / Proposer** (`roleKey: "steward"`, policy: `issuer_only`, scope tag: *Committee / Precinct Tag (optional)*): Publish governance proposals, resolutions, and community ballots.
- **Voting Member** (`roleKey: "voter"`, policy: `self_enroll`, scope tag: *Precinct / Unit Tag (optional)*): Review proposals and cast sybil-resistant 1-human-1-PermSet votes.

---

## 2. Uploaded Brand & Image Assets (`src/assets/uploads/`)

- No custom image assets uploaded at provisioning time (add images to `src/assets/uploads/`).

---

## 3. Assembled Application Specification Prompt

```text
Build a full-stack MEAN + Nginx web application for "hao-test" (Organization: "john", Origin: https://hao-test.apps.bookins.io).

1. PURPOSE & ARCHETYPE: Cooperative, HOA & DAO Governance Portal (Steward + Voting Member)
   - Headline: john — Sybil-Resistant Governance & Voting
   - Primary Goal: Run 1-human-1-vote proposals and community budgets where amihuman guarantees no duplicate accounts and private PermSets verify organization membership.
   - Theme Palette: civic_gold

2. PERMSET PROTOCOL ROLES & ACCESS CONTROL:
   Every user must hold a public amihuman humanity badge plus one of these origin-scoped private PermSets (https://hao-test.apps.bookins.io):
  1. Steward / Proposer (roleKey: "steward", minting: Issuer-Only in Bookins.io Add Permset, scopeTag: "Committee / Precinct Tag (optional)") — Publish governance proposals, resolutions, and community ballots.
  2. Voting Member (roleKey: "voter", minting: Self-Enroll at /join or Admin Minted, scopeTag: "Precinct / Unit Tag (optional)") — Review proposals and cast sybil-resistant 1-human-1-PermSet votes.

3. KEY FEATURES & WORKSPACE BEHAVIOR (/home & /api/records):
   - Steward PermSet console to draft proposals, budget items, and ballot questions
   - Voting Member PermSet ballot casting with 1-PermSet-1-vote enforcement
   - Live transparent tallying stored in isolated tenant MongoDB

4. UPLOADED BRAND & IMAGE ASSETS (src/assets/uploads/):
  - None uploaded yet (use clean CSS vector badges and cards)
```
