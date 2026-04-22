---
id: INT-001
artefact_type: intent
sprint: 0
status: approved
created: "2026-04-22"
updated: "2026-04-22"
---

# CalcApp — Intent

## Description (verbatim)

> Je construis CalcApp, une application web de budget pour les finances personnelles.
> Fonctionnalités principales : Ajouter des dépenses (montant, catégorie, date),
> Lister les dépenses avec des filtres par mois et par catégorie, Définir des budgets
> mensuels par catégorie, Afficher le budget restant par catégorie avec des indicateurs
> visuels. J'ajouterais de nombreux autres fonctionnalités progressivement avec toi
> et selon mes besoins.

## Reformulated Understanding

CalcApp est une application web de gestion de budget personnel, accessible au public,
qui permet à chaque utilisateur de :

- **Enregistrer des dépenses** — en saisissant le montant, la catégorie et la date
- **Consulter ses dépenses** — avec des filtres par mois et par catégorie
- **Définir des budgets mensuels par catégorie** — fixer une enveloppe de dépenses par poste
- **Visualiser le budget restant** — avec des indicateurs visuels (barres de progression,
  codes couleur) pour savoir d'un coup d'œil si on est dans les limites fixées
- **Évoluer progressivement** — de nouvelles fonctionnalités seront ajoutées au fil du temps
  selon les besoins

## Users

- **Profil :** tout public — n'importe qui peut accéder et utiliser l'application
- **Contexte :** usage individuel, chaque personne gère ses propres finances
- **Authentification :** non prévue pour l'instant — chaque utilisateur accède directement,
  sans compte ni connexion

## Boundaries (hors périmètre pour l'instant)

- ❌ Pas de synchronisation avec une banque réelle ou un compte bancaire
- ❌ Pas de système de connexion / création de compte (pas d'authentification)
- ℹ️  Pas d'application mobile dédiée (accessible via le navigateur web uniquement)
- ℹ️  Pas de gestion multi-devises (une seule devise par défaut)

## Open Questions

- id: OQ-001
  question: "Où sont stockées les données des utilisateurs ? Dans le navigateur (stockage local) ou sur un serveur distant ?"
  resolves_in: DESIGN
  impact: architectural
  status: pending
  raised_at: INT-001
  notes: "L'application est publique mais sans authentification. Si les données sont sur un serveur, comment distinguer les données de chaque utilisateur ?"

- id: OQ-002
  question: "Les catégories de dépenses sont-elles prédéfinies (ex : Alimentation, Transport, Loisirs…) ou l'utilisateur peut-il créer ses propres catégories ?"
  resolves_in: REQS
  impact: behavioral
  status: resolved
  raised_at: INT-001
  resolved_at: "2026-04-22"
  resolved_in: REQS
  answer: "Les deux — une liste de catégories prédéfinies + possibilité pour l'utilisateur d'en ajouter."
  answered_by: user
  confidence: Verified

- id: OQ-003
  question: "Quelles technologies utiliser pour construire l'interface (HTML/CSS/JavaScript simple, React, Vue.js…) ?"
  resolves_in: DESIGN
  impact: architectural
  status: pending
  raised_at: INT-001

- id: OQ-004
  question: "L'application doit-elle fonctionner en plusieurs langues, ou uniquement en français ?"
  resolves_in: REQS
  impact: behavioral
  status: resolved
  raised_at: INT-001
  resolved_at: "2026-04-22"
  resolved_in: REQS
  answer: "Multilingue — prévoir la traduction dès le départ."
  answered_by: user
  confidence: Verified
