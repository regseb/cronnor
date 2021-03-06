# Cronnor

Bibliothèque JavaScript implémentant un programme _cron_.

[![npm][img-npm]][link-npm]
[![jsdelivr][img-jsdelivr]][link-jsdelivr]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![dependencies][img-dependencies]][link-dependencies]
[![semver][img-semver]][link-semver]

## Description

La bibliothèque JavaScript **Cronnor** fournit une classe **`Cron`** pour créer
des tâches récurrentes. Elle est disponible pour _Node.js_ et les navigateurs.

```JavaScript
import { Cron } from "cronnor";

function task() {
    // Awesome task to be done every working day at 8am.
};

const cron = new Cron("0 8 * * 1-5", task);

// It's holiday time !
cron.stop();
```

## Installation

Cronnor est publiée dans [_npm_](https://www.npmjs.com/package/cronnor) :

```shell
npm install cronnor
```

Elle est aussi accessible directement avec le CDN
[_jsDelivr_](https://www.jsdelivr.com/package/npm/cronnor) :

```JavaScript
import { Cron } from "https://cdn.jsdelivr.net/npm/cronnor@v1";
```

## API

- [`new Cron(cronex, func, [active])`](#new-croncronex-func-active)
  - [`Cron.active`](#cronactive-lecture-seule)
  - [`Cron.bind(thisArg, ...args)`](#cronbindthisarg-args)
  - [`Cron.unbind()`](#cronunbind)
  - [`Cron.withArguments(...args)`](#cronwithargumentsargs)
  - [`Cron.run()`](#cronrun)
  - [`Cron.start()`](#cronstart)
  - [`Cron.stop()`](#cronstop)
  - [`Cron.test([date])`](#crontestdate)
  - [`Cron.next([start])`](#cronnextstart)
- [`new CronExp(pattern)`](#new-cronexppattern)
  - [`CronExp.test([date])`](#cronexptestdate)
  - [`CronExp.next([start])`](#cronexpnextstart)

### Cron

#### `new Cron(cronex, func, [active])`

Crée une tâche _cronée_.

- Paramètres :
  - `cronex` (`string` ou `string[]`) : La ou les [expressions
    _cron_](#expression-cron) indiquant les horaires d'exécution de la tâche.
    Avec un tableau vide, la tâche ne sera jamais exécutée.
  - `func` (`Function`) : La fonction appelée à chaque horaire indiqué dans les
    expressions _cron_.
  - `active` (`boolean`) : `true` (par défaut) pour activer la tâche ; sinon
    `false`.
- Exceptions :
  - `Error` : Si la syntaxe d'une expession _cron_ est incorrecte.
  - `RangeError` : Si un intervalle d'une expression _cron_ est invalide (hors
    limite ou quand la borne supérieure est plus petite que la borne
    inférieure).
  - `TypeError` : Si le constructeur est appelé sans le mot clé `new` ou si un
    des paramètres n'a pas le bon type.

#### `Cron.active` (lecture seule)

Récupère l'état de la tâche (active ou non).

- Valeur retournée : `true` si la tâche est active ; sinon `false`.

#### `Cron.bind(thisArg, ...args)`

Définit le `this` et les paramètres passés à la fonction.

- Paramètres :
  - `thisArg` (`any`) : Le `this` utilisé pour la fonction.
  - `args` (`...any`) : Les paramètres passés à la fonction.
- Valeur retournée : La tâche elle-même.

#### `Cron.unbind()`

Remet les valeurs par défaut pour le `this` et les paramètres passés à la
fonction.

- Valeur retournée : La tâche elle-même.

#### `Cron.withArguments(...args)`

Définit les paramètres passés à la fonction.

- Paramètres :
  - `args` (`...any`) : Les paramètres passés à la fonction.
- Valeur retournée : La tâche elle-même.

#### `Cron.run()`

Exécute manuellement la fonction.

#### `Cron.start()`

Active la tâche.

- Valeur retournée : `true` quand la tâche a été activée ; `false` si elle était
  déjà active.

#### `Cron.stop()`

Désactive la tâche.

- Valeur retournée : `true` quand la tâche a été désactivée ; `false` si elle
  était déjà inactive.

#### `Cron.test([date])`

Teste si une date respecte une des expressions _cron_ de la tâche.

- Paramètre :
  - `date` (`Date`) : La date qui sera testée (ou l'instant présent par défaut).
- Valeur retournée : `true` si une des expressions est respectée ; sinon
  `false`.

#### `Cron.next([start])`

Calcule la prochaine date respectant une des expressions _cron_ de la tâche.

- Paramètre :
  - `start` (`Date`) : La date de début (ou l'instant présent par défaut).
- Valeur retournée : La prochaine date respectant une des expressions ou
  `undefined` s'il n'y a pas de prochaine date (quand il y a aucune expression
  _cron_).

### CronExp

#### `new CronExp(pattern)`

Crée une expression _cron_.

- Paramètre :
  - `pattern` (`string`) : Le motif de l'expression _cron_
- Exceptions :
  - `Error` : Si la syntaxe du motif est incorrecte.
  - `RangeError` : Si un intervalle est invalide (hors limite ou quand la borne
    supérieure est plus petite que la borne inférieure).
  - `TypeError` : Si le constructeur est appelé sans le mot clé `new` ou si le
    motif n'est pas une chaine de caractères.

#### `CronExp.test([date])`

Teste si une date respecte l'expression.

- Paramètre :
  - `date` (`Date`) : La date qui sera testée (ou l'instant présent par défaut).
- Valeur retournée : `true` si l'expression est respectée ; sinon `false`.

#### `CronExp.next([date])`

Calcule la prochaine date respectant l'expression.

- Paramètre :
  - `start` (`Date`) : La date de début (ou l'instant présent par défaut).
- Valeur retournée : La prochaine date respectant l'expression.

## Expression _cron_

Les expressions _cron_ sont des chaines de caractères composées de cinq éléments
séparés par une espace. Les éléments représentent :

1. les minutes : `0` à `59` ;
2. les heures : `0` à `23` ;
3. le jour du mois : `1` à `31` ;
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

Pour plus d'information, vous pouvez consulter le [manuel de
_crontab_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html).

[img-npm]:https://img.shields.io/npm/dm/cronnor?label=npm
[img-jsdelivr]:https://img.shields.io/jsdelivr/npm/hm/cronnor
[img-build]:https://img.shields.io/github/workflow/status/regseb/cronnor/CI
[img-coverage]:https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fcronnor%2Fmaster
[img-dependencies]:https://img.shields.io/david/regseb/cronnor
[img-semver]:https://img.shields.io/badge/semver-2.0.0-blue

[link-npm]:https://www.npmjs.com/package/cronnor
[link-jsdelivr]:https://www.jsdelivr.com/package/npm/cronnor
[link-build]:https://github.com/regseb/castkodi/actions/workflows/ci.yml?query=branch%3Amaster
[link-coverage]:https://dashboard.stryker-mutator.io/reports/github.com/regseb/cronnor/master
[link-dependencies]:https://david-dm.org/regseb/cronnor
[link-semver]:https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
