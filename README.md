# Scronpt
**Bibliothèque JavaScript implémentant un programme Unix cron.**

[Site Internet](https://regseb.github.io/scronpt)

## Description
La bibliothèque JavaScript **Scronpt** fourni une classe **`Cron`** pour créer
des tâches récurentes.

## API
### Constructeur
```JavaScript
new Cron(notation, [état], fonction, [, param1, param2, ...])
```
où
- `notation` contient la notation *cron* indiquant quand sera appelé la
  `fonction` ;
- `état` est un booléen indiquant si la tâche est active : `true` (valeur par
  défaut), sinon : `false` ;
- `fonction` est la fonction qui sera appelée à chaque horaire indiqué dans la
  `notation` ;
- `param1`, `param2`, `...` sont des paramètres qui seront passés à la
  `fonction`.

Le constructeur peut lancer une exception :
- `Error` si la syntaxe de la notation *cron* est incorrecte ;
- `RangeError` si un intervalle est invalide (hors limite ou la borne supérieure
  est plus grand que la borne inférieure).

### Méthodes
```JavaScript
Cron.prototype.start()
```
Activer la tâche. Si la tâche est déjà active : la méthode n'a aucun effet.

```JavaScript
Cron.prototype.stop()
```
Désactiver la tâche. Si la tâche est déjà inactive : la méthode n'a aucun effet.

```JavaScript
Cron.prototype.status()
```
Récupérer l'état de la tâche. La méthode retourne `true` si la tâche est
active ; et `false` pour une tâche inactive.

## Téléchargement
Vous pouvez récupérer le script minifié en vous rendant sur le site Internet de
la bibliothèque : http://regseb.github.io/scronpt/.

Si vous utiliser
[npm](https://www.npmjs.org/package/scronpt "Node Packaged Modules") ou
[bower](http://bower.io/), la bibliothèque est disponible avec les lignes de
commande suivantes :
```
npm install scronpt
bower install scronpt
```

## Utilisation
### AMD
Pour l'utilisation de la bibliothèque avec un chargeur
[AMD](https://github.com/amdjs/amdjs-api "Asynchronous Module Definition") (par
exemple [RequireJS](http://requirejs.org/)) :
```JavaScript
require(["scronpt"], function (Cron) {
    // ...
    var cron = new Cron(/* ... */);
});
// Ou :
define(["scronpt"], function (Cron) {
    // ...
    var cron = new Cron(/* ... */);
});
```

### CommonJS
Si vous souhaitez utiliser la bibliothèque dans [Node.js](http://nodejs.org/)
(qui utilise le protocole CommonJS), voici un exemple :
```JavaScript
var Cron = require("scronpt");
// ...
var cron = new Cron(/* ... */);
```

### Variable global
Il suffit de télécharger le script et de l'inclure dans la page HTML.
```HTML
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <script src="scronpt.js"></script>
    <!-- ... -->
    <script>
      var cron = new Cron(/* ... */);
    </script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## Notations
Le paramètre `notation` est une chaine de caractères composées de cinq éléments
séparés par une espace. Les éléments représentent :

1. les minutes : `0` à `59` ;
2. les heures : `0` à `23` ;
3. le jour du mois : `0` à `31` ;
4. le mois : `1` ou `jan`, `2` ou `feb`, ..., `12` ou `dec` ;
5. le jour de la semaine : `0`, `7` ou `sun`, `1` ou `mon`, ..., `6` ou `sat`.

Pour chaque élément, des compositions sont possibles :
- `*` : chaque unité (`0`, `1`, `2`, ...) ;
- `-` : définir un intervalle (`1-3` corresponds aux unités `1`, `2` et `3`) ;
- `/` : indiquer le pas (`2-6/2` corresponds aux unités `2`, `4` et `6`) ;
- `,` : créer une liste (`4,8` corresponds aux unités `4` et `8`).

Il existe aussi des chaines spéciales :
- `"@yearly"` ou `"@annually"` : tous les ans, le 1er janvier ;
- `"@monthly"` : le 1er jour de chaque mois ;
- `"@weekly"` : une fois par semaine, le dimanche ;
- `"@daily"` ou `"@midnight"` : tous les jours à minuit ;
- `"@hourly"` : toutes les heures.

Pour plus d'information, vous pouvez consulter le [manuel de `crontab`]
(http://manpages.debian.org/cgi-bin/man.cgi?query=crontab&sektion=5&locale=fr).

## Exemples
```JavaScript
// Appeler la fonction poissonDAvril tous les 1er avril à 8h00.
var cron = new Cron("0 8 1 apr *", poissonDAvril);

// Appeler la fonction anonyme toutes les cinq minutes au travail (entre
// 9h et 18h) en semaine (du lundi au vendredi).
new Cron("0,30 9-18 * * mon-fri", alert, "Ding ! Dong !");

// Arrêter la tâche du poisson d'avril, ce n'est plus de notre age.
cron.stop();

// Finalement, il n'y a pas d'age pour s'amuser.
cron.start();
```

## Compatibilité
Voici les versions minimales nécessaires pour utiliser la bibliothèque avec les
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
