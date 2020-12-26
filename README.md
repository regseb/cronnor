# Cronnor

[![npm][img-npm]][link-npm]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![dependencies][img-dependencies]][link-dependencies]
[![semver][img-semver]][link-semver]
[![license][img-license]][link-license]

> Bibliothèque JavaScript implémentant un programme cron.

[Site Internet](https://regseb.github.io/cronnor/)

## Description

La bibliothèque JavaScript **Cronnor** fournit une classe **`Cron`** pour créer
des tâches récurrentes.

```JavaScript
import { Cron } from "cronnor";

function task() {
    // Awesome task to be done every working day at 8am.
};

const cron = new Cron("0 8 * * 1-5", task);
```

## Installation

```shell
npm install cronnor
```

## API

### `Cron(notation, func, [status])`

Crée une tâche cronée, où :

- `notation` contient la ou les notations *cron* indiquant quand sera appelé la
  fonction ;
- `func` est la fonction appelée à chaque horaire indiqué dans la notation ;
- `status` est un booléen indiquant si la tâche est active : `true` (valeur par
  défaut), sinon : `false`.

Le constructeur peut lancer une exception :

- `Error` si la syntaxe de la notation *cron* est incorrecte ;
- `RangeError` si un intervalle est invalide (hors limite ou quand la borne
  supérieure est plus grande que la borne inférieure) ;
- `TypeError` si le constructeur est appelé sans le mot clé `new` ou si des
  paramètres n'ont pas le bon type.

### `.status` (lecture seule)

Récupérer l'état de la tâche. La propriété contient `true` si la tâche est
active ; et `false` pour une tâche inactive.

### `.start()`

Activer la tâche. Si la tâche est déjà active : la méthode n'a aucun effet.

### `.stop()`

Désactiver la tâche. Si la tâche est déjà inactive : la méthode n'a aucun effet.

## Notations

Le paramètre `notation` est une chaine de caractères composée de cinq éléments
séparés par une espace. Les éléments représentent :

1. les minutes : `0` à `59` ;
2. les heures : `0` à `23` ;
3. le jour du mois : `0` à `31` ;
4. le mois : `1` ou `jan`, `2` ou `feb`, ..., `12` ou `dec` ;
5. le jour de la semaine : `0`, `7` ou `sun`, `1` ou `mon`, ..., `6` ou `sat`.

Pour chaque élément, des compositions sont possibles :

- `*` : couvrir toutes les unités (`0`, `1`, `2`, ...) ;
- `-` : définir un intervalle (`1-3` corresponds aux unités `1`, `2` et `3`) ;
- `/` : indiquer le pas (`2-6/2` corresponds aux unités `2`, `4` et `6`) ;
- `,` : créer une liste (`4,8` corresponds aux unités `4` et `8`).

Il existe aussi des chaines spéciales :

- `"@yearly"` ou `"@annually"` : tous les ans, le 1er janvier ;
- `"@monthly"` : le 1er jour de chaque mois ;
- `"@weekly"` : une fois par semaine, le dimanche ;
- `"@daily"` ou `"@midnight"` : tous les jours à minuit ;
- `"@hourly"` : toutes les heures.

Pour plus d'information, vous pouvez consulter le
[manuel de *crontab*](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html).

[img-npm]:https://img.shields.io/npm/v/cronnor.svg
[img-build]:https://img.shields.io/github/workflow/status/regseb/cronnor/CI
[img-coverage]:https://img.shields.io/coveralls/github/regseb/cronnor
[img-dependencies]:https://img.shields.io/david/regseb/cronnor.svg
[img-semver]:https://img.shields.io/badge/semver-2.0.0-blue.svg
[img-license]:https://img.shields.io/badge/license-MIT-blue.svg

[link-npm]:https://www.npmjs.com/package/cronnor
[link-build]:https://github.com/regseb/cronnor/actions?query=workflow%3ACI
[link-coverage]:https://coveralls.io/github/regseb/cronnor
[link-dependencies]:https://david-dm.org/regseb/cronnor
[link-semver]:https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
[link-license]:https://github.com/regseb/cronnor/blob/master/LICENSE
