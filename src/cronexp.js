/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Field from "./field.js";

/**
 * Les chaines spéciales avec leur équivalent.
 *
 * @type {Object<string, string>}
 */
const NICKNAMES = {
    "@yearly":   "0 0 1 1 *",
    "@annually": "0 0 1 1 *",
    "@monthly":  "0 0 1 * *",
    "@weekly":   "0 0 * * 0",
    "@daily":    "0 0 * * *",
    "@midnight": "0 0 * * *",
    "@hourly":   "0 * * * *",
};

/**
 * Les formes littérales des mois et des jours de la semaine avec leur
 * équivalent numérique. Les autres champs (minutes, heures et jour du mois)
 * n'en ont pas.
 *
 * @type {Object<string, number>[]}
 */
const NAMES = [
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
 * équivalent numérique dans le cas où ils sont utilisés dans la valeur maximale
 * d'un intervalle.
 *
 * @type {Object<string, number>[]}
 */
const NAMES_MAX = NAMES.map((n) => ("sun" in n ? { ...n, sun: 7 }
                                               : { ...n }));

/**
 * Les expressions rationnelles pour découper un intervalle.
 *
 * @type {RegExp[]}
 */
const RANGE_REGEXES = NAMES.map((n) => new RegExp(
    `^(?<min>\\d{1,2}|${Object.keys(n).join("|")})` +
        `(?:-(?<max>\\d{1,2}|${Object.keys(n).join("|")})` +
        "(?:/(?<step>\\d+))?)?$",
    "u",
));

/**
 * Les valeurs minimales et maximales (incluses) saisissables dans les cinq
 * champs (pour des valeurs simples ou des intervalles).
 *
 * @type {Object<string, number>[]}
 */
const LIMITS = [
    // Minutes.
    { min: 0, max: 59 },
    // Heures.
    { min: 0, max: 23 },
    // Jour du mois.
    { min: 1, max: 31 },
    // Mois.
    { min: 1, max: 12 },
    // Jour de la semaine.
    { min: 0, max: 7 },
];

/**
 * Le nombre maximum de jours pour chaque mois.
 *
 * @type {number[]}
 */
const MAX_DAYS_IN_MONTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Le message d'erreur (qui sera suivi de l'expression <em>cron</em>) renvoyé
 * dans l'exception.
 *
 * @type {string}
 */
const ERROR = "Syntax error, unrecognized expression: ";

/**
 * La classe d'une expression <em>cron</em>.
 *
 * @class
 */
export default class CronExp {

    /**
     * Les valeurs possibles pour les minutes.
     *
     * @type {Field}
     */
    #minutes;

    /**
     * Les valeurs possibles pour les heures.
     *
     * @type {Field}
     */
    #hours;

    /**
     * Les valeurs possibles pour le jour du mois.
     *
     * @type {Field}
     */
    #date;

    /**
     * Les valeurs possibles pour le mois (dont les numéros commencent à zéro
     * afin d'utiliser la même numérotation que
     * <code>Date.prototype.getMonth()</code>).
     *
     * @type {Field}
     */
    #month;

    /**
     * Les valeurs possibles pour le jour de la semaine (en utilisant toujours
     * <code>0</code> pour le dimanche afin d'utiliser la même numéroration que
     * <code>Date.prototype.getDay()</code>).
     *
     * @type {Field}
     */
    #day;

    /**
     * Crée une expression <em>cron</em>.
     *
     * @param {string} pattern Le motif de l'expression <em>cron</em>.
     * @throws {Error}      Si la syntaxe du motif est incorrecte.
     * @throws {RangeError} Si un intervalle est invalide (hors limite ou quand
     *                      la borne supérieure est plus petite que la borne
     *                      inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé
     *                      <code>new</code> ou si le motif n'est pas une chaine
     *                      de caractères.
     */
    constructor(pattern) {
        // Remplacer l'éventuelle chaine spéciale par son équivalent et séparer
        // les cinq champs (minutes, heures, jour du mois, mois et jour de la
        // semaine).
        const fields = (NICKNAMES[pattern] ?? pattern).toLowerCase()
                                                      .split(/\s+/u);
        if (5 !== fields.length) {
            throw new Error(ERROR + pattern);
        }

        // Parcourir les cinq champs.
        const conds = fields.map((field, index) => {
            if ("*" === field) {
                return Field.all(LIMITS[index].min, LIMITS[index].max);
            }

            // Gérer les motifs "*/x".
            const result = (/^\*\/(?<step>\d+)$/u).exec(field);
            if (undefined !== result?.groups) {
                const step = Number.parseInt(result.groups.step, 10);
                if (0 === step) {
                    throw new RangeError(ERROR + pattern);
                }

                return Field.range(LIMITS[index].min, LIMITS[index].max, step);
            }

            // Gérer les listes.
            return Field.flat(field.split(",").map((range) => {
                const subresult = RANGE_REGEXES[index].exec(range);
                if (undefined === subresult?.groups) {
                    throw new Error(ERROR + pattern);
                }

                const min = NAMES[index][subresult.groups.min] ??
                            Number.parseInt(subresult.groups.min, 10);
                const max = undefined === subresult.groups.max
                                    ? min
                                    : NAMES_MAX[index][subresult.groups.max] ??
                                      Number.parseInt(subresult.groups.max, 10);
                const step = undefined === subresult.groups.step
                                   ? 1
                                   : Number.parseInt(subresult.groups.step, 10);

                // Vérifier que les valeurs sont dans les intervalles.
                if (min < LIMITS[index].min || LIMITS[index].max < max ||
                        max < min || 0 === step) {
                    throw new RangeError(ERROR + pattern);
                }

                return Field.range(min, max, step);
            }));
        });

        this.#minutes = conds[0];
        this.#hours = conds[1];
        this.#date = conds[2];
        // Faire commencer les mois à zéro.
        this.#month = conds[3].map((v) => v - 1);
        // Toujours utiliser zéro pour le dimanche.
        this.#day = conds[4].map((v) => (7 === v ? 0 : v));

        // Récupérer le nombre maximum de jours du mois le plus long parmi tous
        // les mois autorisés.
        const max = Math.max(...this.#month.values()
                                           .map((m) => MAX_DAYS_IN_MONTHS[m]));
        if (max < this.#date.min) {
            throw new RangeError(ERROR + pattern);
        }
    }

    /**
     * Teste si une date respecte l'expression.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} <code>true</code> si l'expression est respectée ;
     *                    sinon <code>false</code>.
     */
    test(date = new Date()) {
        // Vérifier que les minutes, les heures et le mois respectent les
        // conditions.
        if (!this.#minutes.test(date.getMinutes()) ||
                !this.#hours.test(date.getHours()) ||
                !this.#month.test(date.getMonth())) {
            return false;
        }

        // Quand le jour du mois et le jour de la semaine sont renseignés
        // (différent de l'astérisque), vérifier si au moins une des deux
        // conditions est respectée.
        if (this.#date.restricted && this.#day.restricted) {
            return this.#date.test(date.getDate()) ||
                   this.#day.test(date.getDay());
        }

        // Sinon : soit le jour du mois, soit le jour de la semaine ou aucun des
        // deux ne sont renseignés. Dans ce cas, vérifier classiquement les deux
        // conditions.
        return this.#date.test(date.getDate()) &&
               this.#day.test(date.getDay());
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si les minutes
     * respectent la condition) en vérifiant seulement la condition des minutes.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des minutes.
     */
    #nextMinutes(start) {
        if (this.#minutes.test(start.getMinutes())) {
            return start;
        }

        const date = new Date(start.getTime());
        const next = this.#minutes.next(date.getMinutes());
        if (undefined === next) {
            date.setHours(date.getHours() + 1);
            date.setMinutes(this.#minutes.min);
        } else {
            date.setMinutes(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si les heures
     * respectent la condition) en vérifiant seulement la condition des heures.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des heures.
     */
    #nextHours(start) {
        if (this.#hours.test(start.getHours())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setMinutes(this.#minutes.min);
        const next = this.#hours.next(date.getHours());
        if (undefined === next) {
            date.setDate(date.getDate() + 1);
            date.setHours(this.#hours.min);
        } else {
            date.setHours(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le jour du mois
     * respecte la condition) en vérifiant seulement la condition du jour du
     * mois.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour du mois.
     */
    #nextDate(start) {
        if (this.#date.test(start.getDate())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this.#hours.min);
        date.setMinutes(this.#minutes.min);
        const next = this.#date.next(date.getDate());
        if (undefined === next ||
                next > new Date(date.getFullYear(),
                                date.getMonth() + 1,
                                0).getDate()) {
            date.setMonth(date.getMonth() + 1);
            date.setDate(this.#date.min);
        } else {
            date.setDate(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le jour de la
     * semaine respecte la condition) en vérifiant seulement la condition du
     * jour de la semaine.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour de la
     *                 semaine.
     */
    #nextDay(start) {
        if (this.#day.test(start.getDay())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this.#hours.min);
        date.setMinutes(this.#minutes.min);
        const next = this.#day.next(date.getDay()) ?? this.#day.min;
        date.setDate(date.getDate() + (next + (7 - date.getDay())) % 7);
        return date;
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le jour du mois
     * ou de la semaine respecte la condition) en vérifiant seulement la
     * condition du jour du mois ou de la semaine.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour du mois
     *                 ou de la semaine.
     */
    #nextDateDay(start) {
        const nextDate = this.#nextDate(start);
        const nextDay = this.#nextDay(start);
        // Si le jour du mois et de la semaine sont renseignés (différent de
        // l'astérisque), prendre la prochaine date la plus proche (qui est
        // l'équivalent de prendre la prochaine date vérifiant au moins une des
        // deux conditions).
        // Sinon, prendre la prochaine date la plus éloignée (qui est
        // l'équivalent de prendre la prochaine date vérifiant les deux
        // conditions dont au moins une n'a aucune contrainte).
        return this.#date.restricted && this.#day.restricted
                    ? new Date(Math.min(nextDate.getTime(), nextDay.getTime()))
                    : new Date(Math.max(nextDate.getTime(), nextDay.getTime()));
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le mois respecte
     * la condition) en vérifiant seulement la condition du mois.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du mois.
     */
    #nextMonth(start) {
        if (this.#month.test(start.getMonth())) {
            return start;
        }

        const date = new Date(start.getTime());
        // Mettre temporairement le premier jour du mois et calculer le bon jour
        // après avoir trouver le bon mois.
        date.setDate(1);
        date.setHours(this.#hours.min);
        date.setMinutes(this.#minutes.min);
        const next = this.#month.next(date.getMonth());
        if (undefined === next) {
            date.setFullYear(date.getFullYear() + 1);
            date.setMonth(this.#month.min);
        } else {
            date.setMonth(next);
        }

        return this.#nextDateDay(date);
    }

    /**
     * Calcule la prochaine date respectant l'expression.
     *
     * @param {Date} [start] La date de début (ou l'instant présent par défaut).
     * @returns {Date} La prochaine date respectant l'expression.
     */
    next(start = new Date()) {
        let date = new Date(start.getTime());
        date.setSeconds(0, 0);
        date.setMinutes(date.getMinutes() + 1);

        date = this.#nextMinutes(date);
        date = this.#nextHours(date);
        date = this.#nextDateDay(date);
        date = this.#nextMonth(date);
        return date;
    }
}
