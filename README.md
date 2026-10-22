# Isaiah Rashad — (projet concerts)

Site vitrine d'artiste avec un **portail d'administration** pour gérer les dates de tournée. Le front est en JavaScript « vanilla » (sans framework) et consomme une **API REST Symfony** que j'ai développée.

> 🔗 **Site en ligne** : _à compléter après le déploiement_
> 🧩 **API (back-end)** : [isaiah-rashad-api](https://github.com/emilie-tankou/isaiah-rashad-api)
> ⏱️ L'API est hébergée gratuitement : la première visite après une période d'inactivité peut prendre jusqu'à une minute.

## Fonctionnalités

- **Page publique** : présentation de l'artiste et affichage des dates de tournée, chargées depuis l'API
- **Connexion administrateur** : email et mot de passe, l'API renvoie un jeton JWT
- **Portail d'administration** : ajouter, modifier et supprimer une date, avec messages d'erreur clairs
- Redirection automatique vers la page de connexion si la session expire

## Stack

HTML5 · CSS3 · JavaScript (modules ES, `fetch`) · API REST Symfony (JWT, PostgreSQL)

## Structure

```
├── index.html      page publique
├── login.html      connexion admin
├── admin.html      portail d'administration
├── config.js       adresse de l'API (locale sur ton PC, hébergée une fois en ligne)
├── api.js          fonctions communes : appels à l'API, jeton, protection XSS
├── script.js       affichage public des dates
├── login.js        connexion
├── admin.js        création / modification / suppression
└── style.css
```

## Points techniques

- **Protection contre le XSS** : tout texte reçu de l'API est échappé avant d'être inséré dans la page, et seuls les liens `http(s)` sont acceptés
- **Gestion du jeton JWT** : stocké dans `sessionStorage` (il disparaît à la fermeture de l'onglet) et envoyé dans l'en-tête `Authorization` ; un `401` renvoie automatiquement à la connexion
- **Un seul écouteur d'événements** pour tous les boutons de la liste, au lieu de code `onclick` écrit dans le HTML
- **Gestion des erreurs** : message clair quand le serveur est indisponible ou quand la validation refuse des données

## Lancer en local

1. Démarre l'API (voir le [README de l'API](https://github.com/emilie-tankou/isaiah-rashad-api)) sur `http://127.0.0.1:8000`.
2. Ouvre le dossier dans VS Code et lance `index.html` avec l'extension **Live Server** (adresse `http://127.0.0.1:5500`).

> Il faut passer par un serveur local : ouvrir le fichier directement dans le navigateur (`file://`) bloque les modules JavaScript et les appels à l'API (CORS).

Sur `localhost` / `127.0.0.1`, le site utilise automatiquement l'API locale ; ailleurs, celle hébergée sur Render (voir `config.js`).

## Évolution du projet

La première version utilisait **Firebase** (Firestore et Authentication). Je l'ai remplacée par une API Symfony avec base PostgreSQL pour maîtriser toute la chaîne : modèle de données, validation, sécurité et déploiement. Ce choix m'a fait comprendre ce qu'un service géré fait à ma place, et ce qui revient au développeur quand on le retire.

## Avertissement

Projet pédagogique, sans lien avec l'artiste. Les images et logos sont utilisés à titre d'illustration, sans usage commercial.