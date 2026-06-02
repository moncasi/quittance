# Quittance de loyer

MVP minimal pour générer des quittances de loyer en PDF.

- **client/** — interface React (Vite) : un formulaire de saisie.
- **server/** — API Node + Express : génère le PDF de la quittance (pdfkit).

## Démarrage

### 1. Serveur (API)

```bash
cd server
npm install
npm start          # écoute sur http://localhost:3001
```

### 2. Client (interface)

```bash
cd client
npm install
npm run dev        # ouvre http://localhost:5173
```

Le client appelle l'API via le proxy Vite (`/api` → `localhost:3001`).

## Utilisation

1. Remplir le formulaire (bailleur, locataire, logement, loyer, charges, période, lieu/date).
2. Cliquer sur **Générer la quittance**.
3. Le PDF est téléchargé automatiquement.

## Contenu de la quittance

La quittance générée reprend les mentions usuelles d'une quittance de loyer :
identité du bailleur et du locataire, adresse du logement, période concernée,
détail du loyer et des charges, total payé, date et lieu, signature du bailleur.

> ⚠️ Ce projet est un MVP. La quittance générée est fournie à titre indicatif et
> n'a pas de valeur juridique garantie : adaptez le modèle à votre situation.
