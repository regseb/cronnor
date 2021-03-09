/**
 * @module
 * @author Sébastien Règne
 * @license MIT
 */

import { CronExp } from "./cronexp.js";

/**
 * La valeur maximale du delai accepté par <em>Node.js</em>.
 *
 * @type {number}
 * @private
 * @see https://nodejs.org/api/timers.html
 */
const MAX_DELAY = 2147483647;

/**
 * La classe d'une tâche <em>cronée</em>.
 *
 * @class Cron
 * @public
 */
export const Cron = class {

    /**
     * Crée une tâche <em>cronée</em>.
     *
     * @param {string|string[]} cronex   La ou les expressions <em>cron</em>
     *                                   indiquant
     *                                   les horaires d'exécution de la tâche.
     * @param {Function}        func     La fonction appelée à chaque horaire
     *                                   indiqué dans les expressions
     *                                   <em>cron</em>.
     * @param {boolean}         [active] <code>true</code> (par défaut) pour
     *                                   activer la tâche ; sinon
     *                                   <code>false</code>.
     * @throws {Error}      Si la syntaxe d'une expession <em>cron</em> est
     *                      incorrecte.
     * @throws {RangeError} Si un intervalle d'une expression <em>cron</em> est
     *                      invalide (hors limite ou quand la borne supérieure
     *                      est plus grande que la borne inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé
     *                      <code>new</code> ou si un des paramètres n'a pas le
     *                      bon type.
     * @public
     */
    constructor(cronex, func, active = true) {
        const cronexes = Array.isArray(cronex) ? cronex
                                               : [cronex];

        /**
         * La liste des expressions <em>cron</em> indiquant les horaires
         * d'exécution de la tâche.
         *
         * @type {CronExp[]}
         * @private
         */
        this._cronexes = cronexes.map((n) => new CronExp(n));

        /**
         * La fonction appelée à chaque horaire indiqué dans les expressions
         * <em>cron</em>.
         *
         * @type {Function}
         * @private
         */
        this._func = func;

        /**
         * Le <code>this</code> utilisé pour la fonction.
         *
         * @type {any}
         * @private
         */
        this._thisArg = this;

        /**
         * La liste des paramètres passés à la fonction.
         *
         * @type {any[]}
         * @private
         */
        this._args = [];

        /**
         * L'identifiant du minuteur de la prochaine exécution ; ou
         * <code>null</code> si la tâche est désactivée.
         *
         * @type {any}
         * @private
         */
        this._timeoutID = null;

        if (active) {
            this._schedule();
        }
    }

    /**
     * Récupère l'état de la tâche (active ou non).
     *
     * @returns {boolean} <code>true</code> si la tâche est active ; sinon
     *                    <code>false</code>.
     * @public
     */
    get active() {
        return null !== this._timeoutID;
    }

    /**
     * Définit le <code>this</code> et les paramètres passés à la fonction.
     *
     * @param {any}    thisArg Le <code>this</code> utilisé pour la fonction.
     * @param {...any} args    Les paramètres passés à la fonction.
     * @returns {Cron} La tâche elle-même.
     * @public
     */
    bind(thisArg, ...args) {
        this._thisArg = thisArg;
        this._args = args;
        return this;
    }

    /**
     * Remet les valeurs par défaut pour le <code>this</code> et les paramètres
     * passés à la fonction.
     *
     * @returns {Cron} La tâche elle-même.
     * @public
     */
    unbind() {
        this._thisArg = this;
        this._args = [];
        return this;
    }

    /**
     * Définit les paramètres passés à la fonction.
     *
     * @param {...any} args Les paramètres passés à la fonction.
     * @returns {Cron} La tâche elle-même.
     * @public
     */
    withArguments(...args) {
        this._args = args;
        return this;
    }

    /**
     * Exécute manuellement la fonction.
     *
     * @public
     */
    run() {
        this._func.bind(this._thisArg)(...this._args);
    }

    /**
     * Programme la prochaine exécution.
     *
     * @private
     */
    _schedule() {
        const next = this.next();
        if (undefined === next) {
            // Ne pas planifier de prochaine exécution, mais définir une valeur
            // différente de null pour l'identifiant du minuteur afin d'indiquer
            // que la tâche est active.
            this._timeoutID = undefined;
        } else {
            const delay = next.getTime() - Date.now();
            if (MAX_DELAY >= delay) {
                // Planifier la prochaine exécution.
                this._timeoutID = setTimeout(() => {
                    this._schedule();
                    this.run();
                }, delay);
            } else {
                // Planifier des étapes intermédiaires car Node.js n'accepte pas
                // un grand délai.
                this._timeoutID = setTimeout(() => {
                    this._schedule();
                }, MAX_DELAY);
            }
        }
    }

    /**
     * Annule les prochaines exécutions.
     *
     * @private
     */
    _cancel() {
        if (undefined !== this._timeoutID) {
            clearTimeout(this._timeoutID);
        }
        this._timeoutID = null;
    }

    /**
     * Active la tâche.
     *
     * @returns {boolean} <code>true</code> quand la tâche a été activée ;
     *                    <code>false</code> si elle était déjà active.
     * @public
     */
    start() {
        if (this.active) {
            return false;
        }
        this._schedule();
        return true;
    }

    /**
     * Désactive la tâche.
     *
     * @returns {boolean} <code>true</code> quand la tâche a été désactivée ;
     *                    <code>false</code> si elle était déjà inactive.
     * @public
     */
    stop() {
        if (!this.active) {
            return false;
        }
        this._cancel();
        return true;
    }

    /**
     * Teste si une expression <em>cron</em> de la tâche est respectée.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} <code>true</code> si une expression est respectée ;
     *                    sinon <code>false</code>.
     * @public
     */
    test(date = new Date()) {
        return this._cronexes.some((c) => c.test(date));
    }

    /**
     * Calcule la prochaine date respectant une expression <em>cron</em> de la
     * tâche.
     *
     * @param {Date} [start] La date de début (ou l'instant présent par défaut).
     * @returns {Date|undefined} La prochaine date respectant une expression ou
     *                           <code>undefined</code> s'il n'y a pas de
     *                           prochaine date (quand il n'y a aucune
     *                           expression <em>cron</em>).
     * @public
     */
    next(start = new Date()) {
        if (0 === this._cronexes.length) {
            return undefined;
        }

        return new Date(Math.min(
            ...this._cronexes.map((c) => c.next(start).getTime()),
        ));
    }
};
