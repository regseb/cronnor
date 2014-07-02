# Scronpt
**Bibliothèque JavaScript implémentant un programme Unix cron.**

[Site Internet](https://regseb.github.io/scronpt)

## Description
La bibliothèque JavaScript **Scronpt** ajoute la fonction **`setCron()`** qui
est similaire à la fonction `setInterval()`, mais prend en paramètre une chaine
de caractères indiquant les horaires d'exécution.

La bibliothèque fournit aussi la fonction `clearCron()` qui supprime une tâche.

## Installation
Il suffit de télécharger le script et de l'inclure dans la page (avant la
première utilisation des fonctions `setCron()` ou `clearCron()`).
```HTML
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <script src="scronpt.min.js"></script>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## Syntaxe
```JavaScript
cronID = window.setCron(fonction, cron[, param1, param2, ...]);
window.clearCron(cronID);
```
où
- `cronID` est un identifiant unique de tâche, qui peut être passé à
  `clearCron()` ;
- `fonction` est la fonction qui doit être appelée à l'horaire ;
- `cron` est les horaires quand seront exécuté la `fonction` ;
- `param1`, `param2`, `...` sont des paramètres qui seront passés à la
  `fonction`.

## Notations
Le paramètre `cron` est une chaine de caractères composées de cinq éléments
séparés par un espace. Les éléments représentent :
1. les minutes : `0` à `59` ;
2. les heures : `0` à `23` ;
3. le jour du mois : `0` à `31` ;
4. le mois : `1` ou `jan`, `2` ou `feb`, ..., `12` ou `dec` ;
5. le jour de la semaine : `0`, `7` ou `sun`, `1` ou `mon`, ..., `6` ou `sat`.
Pour chaque élément, des compositions sont possibles :
- `*` : chaque unité (`0`, `1`, `2`, ...) ;
- `-` : définir un interval (`1-3` corresponds aux unités `1`, `2` et `3`) ;
- `/` : indiquer le pas (`2-6/2` corresponds aux unités `2`, `4` et `6`) ;
- `,` : créer une liste (`4,8` corresponds aux unités `4` et `8`).

Il existe aussi des raccourcies :
- `"@yearly"` ou `"@annually"` : tous les ans, le 1er janvier ;
- `"@monthly"` : le 1er jour de chaque mois ;
- `"@weekly"` : une fois par semaine, le dimanche ;
- `"@daily"` ou `"@midnight"` : tous les jours à minuit ;
- `"@hourly"` : toutes les heures.

## Exemples
```JavaScript
// Appeler la fonction poissonDAvril tous les 1er avril à 8h00.
var cronID = setCron(poinssonDAvril, "0 8 1 apr *");

// Appeler la fonction jouerAuLoto, avec les numéros à jouer en paramètres, tous
// les vendredi 13 à 13h13.
setCron(jouerAuLoto, "13 13 13 * fri", 31, 15, 33, 27, 36, 8);

// Appeler la fonction anonyme toutes les cinq minutes au travail (entre 9h et
// 14h puis entre 14h et 18h) en semaine (du lundi au vendredi).
setCron(function() {
    alert("Tic-tac !");
}, "*/5 9-12,14-18 * * 1-5");

// Supprimer la tâche du poisson d'avril.
clearCron(cronID);
```

## Compatibilité
Voici les versions minimales nécessaire pour utiliser la bibliothèque avec les
principaux navigateurs.

 Chrome | Firefox | Internet Explorer | Opera | Safari
:------:|:-------:|:-----------------:|:-----:|:------:
   4    |    5    |         9         |  12   |   5

## Dépendances
Aucune bibliothèque tierce n'est nécessaire pour utiliser Scronpt.

## Contributeur
- [Sébastien Règne](https://github.com/regseb/)

## Licence
La bibliothèque est publiée sous la
[Licence Public Rien À Branler](http://sam.zoy.org/lprab/ "LPRAB").
