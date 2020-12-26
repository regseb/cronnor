/**
 * @module
 * @author Sébastien Règne
 * @license MIT
 */

import { Field } from "./field.js";

/**
 * Les formes littérales des mois et des jours de la semaine. Les autres champs
 * (minute, heure et jour du mois) n'en ont pas. Ce sont les index des éléments
 * dans le tableau qui sont utilisés pour la correspondance.
 *
 * @type {string[][]}
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
        "",
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

/**
 * Les valeurs minimales et maximales (incluses) pouvant être saisies dans les
 * cinq champs (pour des valeurs simples ou des intervalles).
 *
 * @type {Object<string, number>[]}
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

/**
 * Le nombre maximum de jours pour chaque mois.
 *
 * @type {number[]}
 * @private
 */
const MAX_DAYS_IN_MONTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Le message d'erreur (suivi de l'expression cron) renvoyé dans l'exception.
 *
 * @constant {string}
 * @private
 */
const ERROR = "Syntax error, unrecognized expression: ";

/**
 * La classe d'une expression cron.
 *
 * @class CronExp
 * @public
 */
export const CronExp = class {

    /**
     * Crée une expression cron.
     *
     * @param {string} pattern Le motif de l'expression cron.
     * @throws {Error}      Si la syntaxe du motif est incorrecte.
     * @throws {RangeError} Si un intervalle est invalide (hors limite ou quand
     *                      la borne supérieure est plus grande que la borne
     *                      inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé
     *                      <code>new</code> ou si le motif n'est pas une chaine
     *                      de caractères.
     * @public
     */
    constructor(pattern) {
        // Remplacer les chaines spéciales.
        let deciphered;
        switch (pattern) {
            case "@yearly": case "@annually": deciphered = "0 0 1 1 *"; break;
            case "@monthly":                  deciphered = "0 0 1 * *"; break;
            case "@weekly":                   deciphered = "0 0 * * 0"; break;
            case "@daily": case "@midnight":  deciphered = "0 0 * * *"; break;
            case "@hourly":                   deciphered = "0 * * * *"; break;
            default:                          deciphered = pattern;
        }

        // Séparer les cinq champs (minute, heure, jour du mois, mois et jour de
        // la semaine).
        const fields = deciphered.split(/\s+/u);
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

        /**
         * Les valeurs possibles pour les minutes.
         *
         * @type {Field}
         * @private
         */
        this.minutes = conds[0];

        /**
         * Les valeurs possibles pour les heures.
         *
         * @type {Field}
         * @private
         */
        this.hours = conds[1];

        /**
         * Les valeurs possibles pour le jour du mois.
         *
         * @type {Field}
         * @private
         */
        this.date = conds[2];

        /**
         * Les valeurs possibles pour le mois (dont le numéro commence à zéro
         * pour janvier).
         *
         * @type {Field}
         * @private
         */
        this.month = conds[3].map((v) => v - 1);

        /**
         * Les valeurs possibles pour le jour de la semaine.
         *
         * @type {Field}
         * @private
         */
        this.day = conds[4].map((v) => (7 === v ? 0 : v));

        const max = Math.max(...this.month.values()
                                          .map((m) => MAX_DAYS_IN_MONTHS[m]));
        if (max < this.date.min) {
            throw new RangeError(ERROR + pattern);
        }
    }

    /**
     * Teste si l'expression est respectée.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} <code>true</code> si l'expression est respectée ;
     *                    sinon <code>false</code>.
     */
    test(date = new Date()) {
        // Vérifier que la minute, l'heure et le mois respectent les conditions.
        if (!this.minutes.test(date.getMinutes()) ||
                !this.hours.test(date.getHours()) ||
                !this.month.test(date.getMonth())) {
            return false;
        }

        // Quand le jour du mois et le jour de la semaine sont renseignés
        // (différent de l'astérisque), la tâche est exécutée si au moins une
        // des deux conditions est respectée.
        if (this.date.restricted && this.day.restricted) {
            return this.date.test(date.getDate()) ||
                   this.day.test(date.getDay());
        }

        // Sinon : soit le jour du mois, soit le jour de la semaine ou aucun des
        // deux ne sont renseignés. Dans ce cas, vérifier classiquement les deux
        // conditions.
        return this.date.test(date.getDate()) &&
               this.day.test(date.getDay());
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition des minutes.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des minutes.
     * @private
     */
    _nextMinutes(start) {
        if (this.minutes.test(start.getMinutes())) {
            return start;
        }

        const date = new Date(start.getTime());
        const next = this.minutes.next(date.getMinutes());
        if (undefined === next) {
            date.setHours(date.getHours() + 1);
            date.setMinutes(this.minutes.min);
        } else {
            date.setMinutes(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition des heures.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des heures.
     * @private
     */
    _nextHours(start) {
        if (this.hours.test(start.getHours())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setMinutes(this.minutes.min);
        const next = this.hours.next(date.getHours());
        if (undefined === next) {
            date.setDate(date.getDate() + 1);
            date.setHours(this.hours.min);
        } else {
            date.setHours(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition du jour du mois.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour du
     *                 mois.
     * @private
     */
    _nextDate(start) {
        if (this.date.test(start.getDate())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this.hours.min);
        date.setMinutes(this.minutes.min);
        const next = this.date.next(date.getDate());
        if (undefined === next ||
                next > new Date(date.getFullYear(),
                                date.getMonth() + 1,
                                0).getDate()) {
            date.setMonth(date.getMonth() + 1);
            date.setDate(this.date.min);
        } else {
            date.setDate(next);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition du jour de la semaine.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour de la
     *                 semaine.
     * @private
     */
    _nextDay(start) {
        if (this.day.test(start.getDay())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setHours(this.hours.min);
        date.setMinutes(this.minutes.min);
        const next = this.day.next(date.getDay());
        if (undefined === next) {
            date.setDate(date.getDate() +
                         (this.day.min + (7 - date.getDay())) % 7);
        } else {
            date.setDate(date.getDate() + (next + (7 - date.getDay())) % 7);
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition du jour du mois ou de la semaine.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du jour du
     *                 mois ou de la semaine.
     * @private
     */
    _nextDateDay(start) {
        let date = new Date(start.getTime());
        if (this.date.restricted && !this.day.restricted) {
            date = this._nextDate(date);
        } else if (!this.date.restricted && this.day.restricted) {
            date = this._nextDay(date);
        } else if (this.date.restricted && this.day.restricted) {
            const nextDate = this._nextDate(date);
            const nextDay = this._nextDay(date);
            date = nextDate.getTime() < nextDay.getTime() ? nextDate
                                                          : nextDay;
        }
        return date;
    }

    /**
     * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
     * condition du mois.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition du mois.
     * @private
     */
    _nextMonth(start) {
        if (this.month.test(start.getMonth())) {
            return start;
        }

        const date = new Date(start.getTime());
        date.setDate(1);
        date.setHours(this.hours.min);
        date.setMinutes(this.minutes.min);
        const next = this.month.next(date.getMonth());
        if (undefined === next) {
            date.setFullYear(date.getFullYear() + 1);
            date.setMonth(this.month.min);
        } else {
            date.setMonth(next);
        }

        return this._nextDateDay(date);
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

        date = this._nextMinutes(date);
        date = this._nextHours(date);
        date = this._nextDateDay(date);
        date = this._nextMonth(date);
        return date;
    }
};
