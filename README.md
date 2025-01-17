# Cronnor

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage] [![semver][img-semver]][link-semver]

> Bibliothèque JavaScript implémentant un programme _cron_.

## Description

**Cronnor** est une bibliothèque moderne fournissant une classe **`Cron`** pour
créer des tâches récurrentes. Elle est disponible pour Node.js, Bun, Deno et les
navigateurs.

```javascript
import Cron from "cronnor";

function task() {
  // Awesome task to be done every working day at 8am.
}

const cron = new Cron("0 8 * * mon-fri", task);

// It's holiday time!
cron.stop();
```

## Installation

Cronnor est publiée dans [npm][link-npm] (ses CDN :
[esm.sh](https://esm.sh/cronnor),
[jsDelivr](https://www.jsdelivr.com/package/npm/cronnor),
[UNPKG](https://unpkg.com/browse/cronnor/)),
[JSR](https://jsr.io/@regseb/cronnor) et [Deno](https://deno.land/x/cronnor).

```javascript
// Node.js et Bun (après `npm install cronnor`) :
import Cron from "cronnor";

// Navigateurs :
import Cron from "https://esm.sh/cronnor@2";
import Cron from "https://cdn.jsdelivr.net/npm/cronnor@2";
import Cron from "https://unpkg.com/cronnor@2";

// Deno (après `deno add jsr:@regseb/cronnor`) :
import Cron from "jsr:@regseb/cronnor";
```

## API

- [Cron](#cron)
  - [`new Cron(cronex, func, [options])`](#new-croncronex-func-options)
  - [`Cron.active`](#cronactive)
  - [`Cron.run()`](#cronrun)
  - [`Cron.start()`](#cronstart)
  - [`Cron.stop()`](#cronstop)
  - [`Cron.test([date])`](#crontestdate)
  - [`Cron.next([start])`](#cronnextstart)
- [CronExp](#cronexp)
  - [`new CronExp(pattern)`](#new-cronexppattern)
  - [`CronExp.test([date])`](#cronexptestdate)
  - [`CronExp.next([start])`](#cronexpnextstart)
- [At](#at)
  - [`new At(date, func, [options])`](#new-atdate-func-options)
  - [`At.run()`](#atrun)
  - [`At.abort()`](#atabort)

### Cron

```javascript
import Cron from "cronnor/cron";
// import Cron from "https://esm.sh/cronnor@2/cron";
// import Cron from "jsr:@regseb/cronnor/cron";
```

#### `new Cron(cronex, func, [options])`

Crée une tâche _cronée_.

- Paramètres :
  - `cronex` (`string` ou `string[]`) : La ou les
    [expressions _cron_](#expression-cron) indiquant les horaires d'exécution de
    la tâche.
  - `func` (`Function`) : La fonction appelée à chaque horaire indiqué dans les
    expressions _cron_.
  - `options` (`Object`) : Les options de la tâche _cronée_.
    - `active` (`boolean`) : `true` (par défaut) pour activer la tâche ; sinon
      `false`.
    - `thisArg` (`any`) : Le `this` utilisé pour la fonction (la tâche _cronée_
      par défaut).
    - `args` (`any[]`) : Les paramètres passés à la fonction (aucun paramètre
      par défaut).
- Exceptions :
  - `Error` : Si la syntaxe d'une expression _cron_ est incorrecte.
  - `RangeError` : Si un intervalle d'une expression _cron_ est invalide (hors
    limite ou quand la borne supérieure est plus petite que la borne
    inférieure).
  - `TypeError` : Si le constructeur est appelé sans le mot clé `new` ou si un
    des paramètres n'a pas le bon type.

#### `Cron.active`

Récupère ou définit l'état de la tâche (active ou non) :

- `true` si la tâche est active ou pour l'activer.
- `false` si elle est inactive ou pour la désactiver.

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
- Valeur retournée : La prochaine date respectant une des expressions.

### CronExp

```javascript
import CronExp from "cronnor/cronexp";
// import CronExp from "https://esm.sh/cronnor@2/cronexp";
// import CronExp from "jsr:@regseb/cronnor/cronexp";
```

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

#### `CronExp.next([start])`

Calcule la prochaine date respectant l'expression.

- Paramètre :
  - `start` (`Date`) : La date de début (ou l'instant présent par défaut).
- Valeur retournée : La prochaine date respectant l'expression.

### At

```javascript
import At from "cronnor/at";
// import At from "https://esm.sh/cronnor@2/at";
// import At from "jsr:@regseb/cronnor/at";
```

#### `new At(date, func, [options])`

Crée une tâche planifiée.

- Paramètres :
  - `date` (`Date`) : La date de planification de la tâche.
  - `func` (`Function`) : La fonction appelée à la date planifiée.
  - `options` (`Object`) : Les options de la planification de la tâche.
    - `thisArg` (`any`) : Le `this` utilisé pour la fonction (la tâche planifiée
      par défaut).
    - `args` (`any[]`) : Les paramètres passés à la fonction (aucun paramètre
      par défaut).
- Exceptions :
  - `TypeError` : Si le constructeur est appelé sans le mot clé `new`.

#### `At.run()`

Exécute manuellement la fonction.

#### `At.abort()`

Annule la planification.

## Expression _cron_

Les expressions _cron_ sont des chaines de caractères composées de cinq ou six
éléments séparés par une espace. Les éléments représentent :

1. les secondes (optionnel ; `0` par défaut) : `0` à `59` ;
2. les minutes : `0` à `59` ;
3. les heures : `0` à `23` ;
4. le jour du mois : `1` à `31` ;
5. le mois : `1` ou `jan`, `2` ou `feb`, …, `12` ou `dec` ;
6. le jour de la semaine : `0`, `7` ou `sun`, `1` ou `mon`, …, `6` ou `sat`.

Pour chaque élément, des compositions sont possibles :

- `*` : couvrir toutes les unités (`0`, `1`, `2`, …) ;
- `-` : définir un intervalle (`1-3` corresponds aux unités `1`, `2` et `3`) ;
- `/` : indiquer le pas (`2-6/2` corresponds aux unités `2`, `4` et `6`) ;
- `,` : créer une liste (`4,8` corresponds aux unités `4` et `8`) ;
- `?` : affecter l'unité courante à la création (pour une expression _cron_
  créée à 13h37, la valeur `13` sera utilisée pour les heures et `37` pour les
  minutes) ;
- `~` : générer un nombre aléatoire.

Il existe aussi des chaines spéciales :

- `"@yearly"` ou `"@annually"` : tous les ans, le 1er janvier (`"0 0 1 1 *"`) ;
- `"@monthly"` : le 1er jour de chaque mois (`"0 0 1 * *"`) ;
- `"@weekly"` : une fois par semaine, le dimanche (`"0 0 * * 0"`) ;
- `"@daily"` ou `"@midnight"` : tous les jours à minuit (`"0 0 * * *"`) ;
- `"@hourly"` : toutes les heures (`"0 * * * *"`).

Pour plus d'information, vous pouvez consulter le
[manuel de _crontab_](https://man7.org/linux/man-pages/man5/crontab.5.html).

[img-npm]:
  https://img.shields.io/npm/dm/cronnor?label=npm&logo=npm&logoColor=whitesmoke
[img-build]:
  https://img.shields.io/github/actions/workflow/status/regseb/cronnor/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]:
  https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fcronnor%2Fmain
[img-semver]:
  https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/cronnor
[link-build]:
  https://github.com/regseb/cronnor/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:
  https://dashboard.stryker-mutator.io/reports/github.com/regseb/cronnor/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
