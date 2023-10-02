/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import parse from "./parse.js";

/**
 * @typedef {import("./field.js").default} Field
 */

/**
 * La classe d'une expression <em>cron</em>.
 *
 * @class
 */
export default class CronExp {
    /**
     * Les valeurs possibles pour les secondes.
     *
     * @type {Field}
     */
    #seconds;

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
     * <code>0</code> pour le dimanche afin d'utiliser la même numérotation que
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
        const fields = parse(pattern);
        this.#seconds = fields.seconds;
        this.#minutes = fields.minutes;
        this.#hours = fields.hours;
        this.#date = fields.date;
        this.#month = fields.month;
        this.#day = fields.day;
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
        // Vérifier que les secondes, minutes, les heures et le mois respectent
        // les conditions.
        if (
            !this.#seconds.test(date.getSeconds()) ||
            !this.#minutes.test(date.getMinutes()) ||
            !this.#hours.test(date.getHours()) ||
            !this.#month.test(date.getMonth())
        ) {
            return false;
        }

        // Quand le jour du mois et le jour de la semaine sont renseignés
        // (différent de l'astérisque), vérifier si au moins une des deux
        // conditions est respectée.
        if (this.#date.restricted && this.#day.restricted) {
            return (
                this.#date.test(date.getDate()) || this.#day.test(date.getDay())
            );
        }

        // Sinon : soit le jour du mois, soit le jour de la semaine ou aucun des
        // deux ne sont renseignés. Dans ce cas, vérifier classiquement les deux
        // conditions.
        return this.#date.test(date.getDate()) && this.#day.test(date.getDay());
    }

    /**
     * Calcule la prochaine date (ou garde la date de début si les secondes
     * respectent la condition) en vérifiant seulement la condition des
     * secondes.
     *
     * @param {Date} start La date de début.
     * @returns {Date} La prochaine date vérifiant la condition des secondes.
     */
    #nextSeconds(start) {
        if (this.#seconds.test(start.getSeconds())) {
            return start;
        }

        const date = new Date(start.getTime());
        const next = this.#seconds.next(date.getSeconds());
        if (undefined === next) {
            date.setMinutes(date.getMinutes() + 1);
            date.setSeconds(this.#seconds.min);
        } else {
            date.setSeconds(next);
        }
        return date;
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
        date.setSeconds(this.#seconds.min);
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
        date.setSeconds(this.#seconds.min);
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
        date.setSeconds(this.#seconds.min);
        const next = this.#date.next(date.getDate());
        if (
            undefined === next ||
            next >
                new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        ) {
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
        date.setSeconds(this.#seconds.min);
        const next = this.#day.next(date.getDay()) ?? this.#day.min;
        date.setDate(date.getDate() + ((next + (7 - date.getDay())) % 7));
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
        // après avoir trouvé le bon mois.
        date.setDate(1);
        date.setHours(this.#hours.min);
        date.setMinutes(this.#minutes.min);
        date.setSeconds(this.#seconds.min);
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
        date.setMilliseconds(0);
        date.setSeconds(date.getSeconds() + 1);

        date = this.#nextSeconds(date);
        date = this.#nextMinutes(date);
        date = this.#nextHours(date);
        date = this.#nextDateDay(date);
        date = this.#nextMonth(date);
        return date;
    }
}
