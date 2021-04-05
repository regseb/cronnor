/**
 * @module
 * @author Sébastien Règne
 * @license MIT
 */

import { Field } from "./field.js";

/**
 * Les chaines spéciales avec leur équivalent.
 *
 * @type {Object<string, string>}
 * @private
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

/* eslint-disable jsdoc/check-types -- Utiliser la notation Array<> car l'outil
 *     JSDoc ne gère pas les tableaux de types complexes déclarés avec [].
 *     https://github.com/jsdoc/jsdoc/issues/1133 */
/**
 * Les formes littérales des mois et des jours de la semaine. Les autres champs
 * (minute, heure et jour du mois) n'en ont pas. Ce sont les index des éléments
 * dans le tableau qui sont utilisés pour la correspondance.
 *
 * @type {Array<Array<?string>>}
 * @private
 */
const NAMES = [
    // Minute.
    [],
    // Heure.
    [],
    // Jour du mois.
    [],
    // Mois.
    [
        // Commencer par une valeur nulle pour que le mois de janvier soit à
        // l'index 1.
        null,
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
    ],
    // Jour de la semaine.
    [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
    ],
];
/* eslint-enable jsdoc/check-types */

/* eslint-disable jsdoc/check-types -- Utiliser la notation Array<> car l'outil
 *     JSDoc ne gère pas les tableaux de types complexes déclarés avec [].
 *     https://github.com/jsdoc/jsdoc/issues/1133 */
/**
 * Les valeurs minimales et maximales (incluses) saisissables dans les cinq
 * champs (pour des valeurs simples ou des intervalles).
 *
 * @type {Array<Object<string, number>>}
 * @private
 */
const LIMITS = [
    // Minute.
    { min: 0, max: 59 },
    // Heure.
    { min: 0, max: 23 },
    // Jour du mois.
    { min: 1, max: 31 },
    // Mois.
    { min: 1, max: 12 },
    // Jour de la semaine.
    { min: 0, max: 7 },
];
/* eslint-enable jsdoc/check-types */

/**
 * Le nombre maximum de jours pour chaque mois.
 *
 * @type {number[]}
 * @private
 */
const MAX_DAYS_IN_MONTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Le message d'erreur (qui sera suivi de l'expression <em>cron</em>) renvoyé
 * dans l'exception.
 *
 * @type {string}
 * @private
 */
const ERROR = "Syntax error, unrecognized expression: ";

/**
 * La classe d'une expression <em>cron</em>.
 *
 * @class CronExp
 */
export const CronExp = class {

    /**
     * Les valeurs possibles pour les minutes.
     *
     * @type {Field}
     * @private
     */
    _minutes;

    /**
     * Les valeurs possibles pour les heures.
     *
     * @type {Field}
     * @private
     */
    _hours;

    /**
     * Les valeurs possibles pour le jour du mois.
     *
     * @type {Field}
     * @private
     */
    _date;

    /**
     * Les valeurs possibles pour le mois (dont les numéros commencent à zéro
     * pour utiliser la même numérotation que
     * <code>Date.prototype.getMonth()</code>).
     *
     * @type {Field}
     * @private
     */
    _month;

    /**
     * Les valeurs possibles pour le jour de la semaine (en utilisant toujours
     * <code>0</code> pour le dimanche pour utiliser la même numéroration que
     * <code>Date.prototype.getDay()</code>).
     *
     * @type {Field}
     * @private
     */
    _day;

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
        // les cinq champs (minute, heure, jour du mois, mois et jour de la
        // semaine).
        const fields = (NICKNAMES[pattern] ?? pattern).split(/\s+/u);
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

            // Gérer le nom des mois ("jan", "feb", ...) et des jours de la
            // semaine ("sun", "mon", ...).
            const value = NAMES[index].indexOf(field.toLowerCase());
            if (-1 !== value) {
                return Field.of(value);
            }

            // Gérer les listes.
            return Field.flat(field.split(",").map((range) => {
                const subresult =
                    // eslint-disable-next-line unicorn/no-unsafe-regex
                    (/^(?<min>\d+)(?:-(?<max>\d+)(?:\/(?<step>\d+))?)?$/u)
                                                                   .exec(range);
                if (undefined === subresult?.groups) {
                    throw new Error(ERROR + pattern);
                }

                const min  = Number.parseInt(subresult.groups.min, 10);
                const max  = undefined === subresult.groups.max
                                    ? min
                                    : Number.parseInt(subresult.groups.max, 10);
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

        this._minutes = conds[0];
        this._hours = conds[1];
        this._date = conds[2];
        // Faire commencer les mois à zéro pour janvier.
        this._month = conds[3].map((v) => v - 1);
        // Toujours utiliser zéro pour le dimanche.
        this._day = conds[4].map((v) => (7 === v ? 0 : v));

        // Récupérer le mois le plus long parmi tous les mois autorisés.
        const max = Math.max(...this._month.values()
                                           .map((m) => MAX_DAYS_IN_MONTHS[m]));
        if (max < this._date.min) {
            throw new RangeError(ERROR + pattern);
        }
    }

    /**
     * Teste si une date respecte l'expression.
     *
     * @param {Date} [date=new Date()] La date qui sera testée (ou l'instant
     *                                 présent par défaut).
     * @returns {boolean} <code>true</code> si l'expression est respectée ;
     *                    sinon <code>false</code>.
     */
    test(date = new Date()) {
        // Vérifier que la minute, l'heure et le mois respectent les conditions.
        if (!this._minutes.test(date.getMinutes()) ||
                !this._hours.test(date.getHours()) ||
                !this._month.test(date.getMonth())) {
            return false;
        }

        // Quand le jour du mois et le jour de la semaine sont renseignés
        // (différent de l'astérisque), vérifier si au moins une des deux
        // conditions est respectée.
        if (this._date.restricted && this._day.restricted) {
            return this._date.test(date.getDate()) ||
                   this._day.test(date.getDay());
        }

        // Sinon : soit le jour du mois, soit le jour de la semaine ou aucun des
        // deux ne sont renseignés. Dans ce cas, vérifier classiquement les deux
        // conditions.
        return this._date.test(date.getDate()) &&
               this._day.test(date.getDay());
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si les minutes
     * respectent la condition) en vérifiant seulement la condition des minutes.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des minutes.
     * @private
     */
    _nextMinutes(start) {
        if (this._minutes.test(start.getMinutes())) {
            return start;
        }

        const date = new Date(start.getTime());
        const next = this._minutes.next(date.getMinutes());
        if (undefined === next) {
            date.setHours(date.getHours() + 1);
            date.setMinutes(this._minutes.min);
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
     * @private
     */
    _nextHours(start) {
        if (this._hours.test(start.getHours())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setMinutes(this._minutes.min);
        const next = this._hours.next(date.getHours());
        if (undefined === next) {
            date.setDate(date.getDate() + 1);
            date.setHours(this._hours.min);
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
     * @returns {Date} La prochaine date vérifiant la condition du jour du
     *                 mois.
     * @private
     */
    _nextDate(start) {
        if (this._date.test(start.getDate())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this._hours.min);
        date.setMinutes(this._minutes.min);
        const next = this._date.next(date.getDate());
        if (undefined === next ||
                next > new Date(date.getFullYear(),
                                date.getMonth() + 1,
                                0).getDate()) {
            date.setMonth(date.getMonth() + 1);
            date.setDate(this._date.min);
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
     * @private
     */
    _nextDay(start) {
        if (this._day.test(start.getDay())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this._hours.min);
        date.setMinutes(this._minutes.min);
        const next = this._day.next(date.getDay()) ?? this._day.min;
        date.setDate(date.getDate() + (next + (7 - date.getDay())) % 7);
        return date;
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le jour du mois
     * ou de la semaine respecte la condition) en vérifiant seulement la
     * condition du jour du mois ou de la semaine.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour du
     *                 mois ou de la semaine.
     * @private
     */
    _nextDateDay(start) {
        const nextDate = this._nextDate(start);
        const nextDay = this._nextDay(start);
        // Si le jour du mois et de la semaine sont renseignés (différent de
        // l'astérisque), prendre la prochaine date la plus proche (qui est
        // l'équivalent de prendre la prochaine date vérifiant au moins une des
        // deux conditions).
        // Sinon, prendre la prochaine date la plus éloignée (qui est
        // l'équivalent de prendre la prochaine date vérifiant les deux
        // conditions).
        return this._date.restricted && this._day.restricted
                    ? new Date(Math.min(nextDate.getTime(), nextDay.getTime()))
                    : new Date(Math.max(nextDate.getTime(), nextDay.getTime()));
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si le mois respecte
     * la condition) en vérifiant seulement la condition du mois.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du mois.
     * @private
     */
    _nextMonth(start) {
        if (this._month.test(start.getMonth())) {
            return start;
        }

        const date = new Date(start.getTime());
        // Mettre temporairement le premier jour du mois et calculer le bon jour
        // après avoir trouver le bon mois.
        date.setDate(1);
        date.setHours(this._hours.min);
        date.setMinutes(this._minutes.min);
        const next = this._month.next(date.getMonth());
        if (undefined === next) {
            date.setFullYear(date.getFullYear() + 1);
            date.setMonth(this._month.min);
        } else {
            date.setMonth(next);
        }

        return this._nextDateDay(date);
    }

    /**
     * Calcule la prochaine date respectant l'expression.
     *
     * @param {Date} [start=new Date()] La date de début (ou l'instant présent
     *                                  par défaut).
     * @returns {Date} La prochaine date respectant l'expression.
     */
    next(start = new Date()) {
        let date = new Date(start.getTime());
        date.setSeconds(0, 0);
        date.setMinutes(date.getMinutes() + 1);

        date = this._nextMinutes(date);
        date = this._nextHours(date);
        date = this._nextDateDay(date);
        date = this._nextMonth(date);
        return date;
    }
};
