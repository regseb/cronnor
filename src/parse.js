import Field from "./field.js";

/**
 * Les chaines spéciales avec leur équivalent.
 *
 * @type {Object<string, string>}
 */
const NICKNAMES = {
    "@yearly": "0 0 0 1 1 *",
    "@annually": "0 0 0 1 1 *",
    "@monthly": "0 0 0 1 * *",
    "@weekly": "0 0 0 * * 0",
    "@daily": "0 0 0 * * *",
    "@midnight": "0 0 0 * * *",
    "@hourly": "0 0 * * * *",
};

/**
 * Les formes littérales des mois et des jours de la semaine avec leur
 * équivalent numérique. Les autres champs (secondes, minutes, heures et jour du
 * mois) n'en ont pas.
 *
 * @type {Object<string, number>[]}
 */
const BASE_NAMES = [
    // Secondes.
    {},
    // Minutes.
    {},
    // Heures.
    {},
    // Jour du mois.
    {},
    // Mois.
    {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
    },
    // Jour de la semaine.
    {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
    },
];

/**
 * Les formes littérales des mois et des jours de la semaine avec leur
 * équivalent numérique pour la borne minimum et maximum. La seule différence
 * entre le minimum et la maximum est pour le dimanche qui utilise le nombre
 * <code>0</code> ou <code>7</code>.
 *
 * @type {Object<string, Object<string, number>[]>}
 */
const NAMES = {
    MIN: BASE_NAMES,
    MAX: BASE_NAMES.map((n) => ("sun" in n ? { ...n, sun: 7 } : { ...n })),
};

/**
 * Les valeurs minimales et maximales (incluses) saisissables dans les cinq
 * champs (pour des valeurs simples ou des intervalles).
 *
 * @type {Object<string, number[]>}
 */
const LIMITS = {
    // Secondes, Minutes, heures, jour du mois, mois, jour de la semaine.
    MIN: [0, 0, 0, 1, 1, 0],
    MAX: [59, 59, 23, 31, 12, 7],
};

/**
 * Le pas par défaut pour les intervalles.
 *
 * @type {Object<string, number>}
 */
const DEFAULT_STEPS = {
    NORMAL: 1,
    // Utiliser un grand nombre pour que l'algorithme sélectionne une seule
    // valeur (aléatoire) dans l'intervalle.
    RANDOM: Number.MAX_SAFE_INTEGER,
};

/**
 * Le nombre maximum de jours pour chaque mois.
 *
 * @type {number[]}
 */
const MAX_DAYS_IN_MONTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Le message d'erreur (qui sera suivi de l'expression <em>cron</em>) envoyé
 * dans l'exception.
 *
 * @type {string}
 */
const ERROR = "Syntax error, unrecognized expression: ";

/**
 * Les formats des sous-champs d'un motif.
 *
 * @type {any[][]}
 */
const FORMATS = [
    ["*", { extra: { restricted: false } }],
    ["*/{step}"],
    ["{min}", { max: "=" }],
    ["{min}-{max}"],
    ["{min}-{max}/{step}"],
    ["~", { extra: { random: true } }],
    ["~/{step}", { extra: { random: true } }],
    ["{min}~", { extra: { random: true } }],
    ["{min}~/{step}", { extra: { random: true } }],
    ["~{max}", { extra: { random: true } }],
    ["~{max}/{step}", { extra: { random: true } }],
    ["{min}~{max}", { extra: { random: true } }],
    ["{min}~{max}/{step}", { extra: { random: true } }],
].map(([format, complements]) => [
    new RegExp(
        "^" +
            /** @type {string} */ (format)
                .replaceAll("*", "\\*")
                .replaceAll("{step}", "(?<step>\\d+)")
                .replaceAll("{min}", "(?<min>[\\da-z?]+)")
                .replaceAll("{max}", "(?<max>[\\da-z?]+)") +
            "$",
        "iu",
    ),
    complements,
]);

/**
 * Retourne la valeur d'une date en fonction de l'index du champ.
 *
 * @param {Date}    date  La date.
 * @param {number}  index L'index du champ.
 * @param {boolean} [max] La marque indiquant si la valeur est pour le maximum
 *                        (utilisé pour le jour de la semaine).
 * @returns {number} La valeur du champ.
 * @throws {TypeError} Si l'index est invalide.
 */
const getIndexValue = (date, index, max = false) => {
    switch (index) {
        case 0:
            return date.getSeconds();
        case 1:
            return date.getMinutes();
        case 2:
            return date.getHours();
        case 3:
            return date.getDate();
        case 4:
            // Incrémenter d'un pour faire commencer les mois à un.
            return date.getMonth() + 1;
        case 5:
            // Utiliser le nombre sept pour le dimanche quand il est placé dans
            // la borne supérieure.
            return max && 0 === date.getDay() ? 7 : date.getDay();
        // Stryker disable next-line all: Désactiver Stryker pour le défaut car
        // la fonction getIndexValue() est toujours appelée avec un index entre
        // 0 et 5. Il est donc impossible de tester cette condition.
        default:
            // Stryker disable next-line all
            throw new TypeError(`Invalid index ${index}`);
    }
};

/**
 * Parse le sous-champ d'un motif.
 *
 * @param {Object}  parts                    Les données du pseudo-intervalle.
 * @param {string}  [parts.min]              La valeur minimale du
 *                                           pseudo-intervalle.
 * @param {string}  [parts.max]              La valeur maximale du
 *                                           pseudo-intervalle.
 * @param {string}  [parts.step]             Le pas du pseudo-intervalle.
 * @param {Object}  [parts.extra]            Les informations supplémentaires.
 * @param {boolean} [parts.extra.restricted] <code>true</code> (par défaut) pour
 *                                           un champ qui était différent de
 *                                           <code>"*"</code> ; sinon
 *                                           <code>false</code>.
 * @param {boolean} [parts.extra.random]     <code>false</code> (par défaut)
 *                                           pour générer un nombre aléatoire
 *                                           pour le minimum.
 * @param {number}  index                    L'index du champ.
 * @param {Date}    now                      La date courante.
 * @param {string}  pattern                  Le motif complet.
 * @returns {Field} Le sous-champ du motif.
 * @throws {Error}      Si la syntaxe du sous-champ est incorrecte.
 * @throws {RangeError} Si l'intervalle est invalide (hors limite ou quand la
 *                      borne supérieure est plus petite que la borne
 *                      inférieure).
 */
const parseField = (parts, index, now, pattern) => {
    let min;
    if (undefined === parts.min) {
        min = LIMITS.MIN[index];
    } else if ("?" === parts.min) {
        min = getIndexValue(now, index);
    } else if (parts.min.toLowerCase() in NAMES.MIN[index]) {
        min = NAMES.MIN[index][parts.min.toLowerCase()];
    } else if (/^\d+$/u.test(parts.min)) {
        min = Number(parts.min);
    } else {
        throw new Error(ERROR + pattern);
    }
    let max;
    if (undefined === parts.max) {
        max = LIMITS.MAX[index];
    } else if ("=" === parts.max) {
        max = min;
    } else if ("?" === parts.max) {
        max = getIndexValue(now, index, true);
    } else if (parts.max.toLowerCase() in NAMES.MAX[index]) {
        max = NAMES.MAX[index][parts.max.toLowerCase()];
    } else if (/^\d+$/u.test(parts.max)) {
        max = Number(parts.max);
    } else {
        throw new Error(ERROR + pattern);
    }
    const step =
        undefined === parts.step
            ? parts.extra?.random
                ? DEFAULT_STEPS.RANDOM
                : DEFAULT_STEPS.NORMAL
            : Number(parts.step);
    const extra = {
        random: false,
        restricted: true,
        ...parts.extra,
    };

    // Vérifier que les valeurs sont dans les intervalles.
    if (
        min < LIMITS.MIN[index] ||
        LIMITS.MAX[index] < max ||
        max < min ||
        0 === step
    ) {
        throw new RangeError(ERROR + pattern);
    }

    return Field.range(min, max, step, extra);
};

/**
 * Extrait les valeurs d'une expression <em>cron</em>.
 *
 * @param {string} pattern Le motif de l'expression <em>cron</em>
 * @returns {Object<string, Field>} Les valeurs de l'expression <em>cron</em>
 *                                  pour chaque champ.
 * @throws {Error}      Si la syntaxe du motif est incorrecte.
 * @throws {RangeError} Si un intervalle est invalide (hors limite ou quand la
 *                      borne supérieure est plus petite que la borne
 *                      inférieure).
 */
export default function parse(pattern) {
    // Remplacer l'éventuelle chaine spéciale par son équivalent et séparer
    // les cinq ou six champs (secondes, minutes, heures, jour du mois, mois et
    // jour de la semaine).
    const fields = (NICKNAMES[pattern.toLowerCase()] ?? pattern).split(/\s+/u);
    if (5 === fields.length) {
        // Ajouter la valeur "0" pour les secondes (car elles ne sont pas
        // renseignées).
        fields.unshift("0");
    } else if (6 !== fields.length) {
        throw new Error(ERROR + pattern);
    }

    // Figer la date courante pour remplacer tous les éventuelles "?" par les
    // mêmes valeurs.
    const now = new Date();

    // Parcourir les six champs.
    const [seconds, minutes, hours, date, month, day] = fields.map(
        (field, index) =>
            Field.flat(
                // Parcourir les sous-champs.
                field.split(",").map((subfield) => {
                    for (const [format, complements] of FORMATS) {
                        const result = format.exec(subfield);
                        if (null !== result) {
                            const parts = {
                                ...result.groups,
                                ...complements,
                            };
                            return parseField(parts, index, now, pattern);
                        }
                    }
                    throw new Error(ERROR + pattern);
                }),
            ),
    );

    // Récupérer le nombre maximum de jours du mois le plus long parmi tous
    // les mois autorisés.
    const max = Math.max(
        // Décrémenter d'un pour faire commencer les mois à zéro.
        ...month.values().map((m) => MAX_DAYS_IN_MONTHS[m - 1]),
    );
    if (max < date.min) {
        throw new RangeError(ERROR + pattern);
    }

    return {
        seconds,
        minutes,
        hours,
        date,
        // Faire commencer les mois à zéro.
        month: month.map((v) => v - 1),
        // Toujours utiliser zéro pour le dimanche.
        day: day.map((v) => (7 === v ? 0 : v)),
    };
}
