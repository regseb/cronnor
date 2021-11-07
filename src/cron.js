/**
 * @module
 * @author Sébastien Règne
 * @license MIT
 */

import { CronExp } from "./cronexp.js";

/**
 * La valeur maximale du délai accepté par <em>Node.js</em>.
 *
 * @type {number}
 * @see https://nodejs.org/api/timers.html
 */
const MAX_DELAY = 2_147_483_647;

/**
 * La classe d'une tâche <em>cronée</em>.
 *
 * @class Cron
 */
export const Cron = class {

    /**
     * La liste des expressions <em>cron</em> indiquant les horaires d'exécution
     * de la tâche.
     *
     * @type {CronExp[]}
     */
    #cronexes;

    /**
     * La fonction appelée à chaque horaire indiqué dans les expressions
     * <em>cron</em>.
     *
     * @type {Function}
     */
    #func;

    /**
     * Le <code>this</code> utilisé pour la fonction.
     *
     * @type {any}
     */
    // eslint-disable-next-line no-invalid-this
    #thisArg = this;

    /**
     * La liste des paramètres passés à la fonction.
     *
     * @type {any[]}
     */
    #args = [];

    /**
     * L'identifiant du minuteur de la prochaine exécution ; ou
     * <code>undefined</code> si la tâche est active, mais qu'il n'y a pas de
     * prochaine exécution (car il n'y a aucune expression <em>cron</em>) ; ou
     * <code>null</code> si la tâche est désactivée.
     *
     * @type {any}
     */
    #timeoutID = null;

    /**
     * Crée une tâche <em>cronée</em>.
     *
     * @param {string|string[]} cronex   La ou les expressions <em>cron</em>
     *                                   indiquant les horaires d'exécution de
     *                                   la tâche. Avec un tableau vide, la
     *                                   tâche ne sera jamais exécutée.
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
     *                      est plus petite que la borne inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé
     *                      <code>new</code> ou si un des paramètres n'a pas le
     *                      bon type.
     */
    constructor(cronex, func, active = true) {
        const cronexes = Array.isArray(cronex) ? cronex
                                               : [cronex];
        this.#cronexes = cronexes.map((p) => new CronExp(p));
        this.#func = func;

        if (active) {
            this.#schedule();
        }
    }

    /**
     * Récupère l'état de la tâche (active ou non).
     *
     * @returns {boolean} <code>true</code> si la tâche est active ; sinon
     *                    <code>false</code>.
     */
    get active() {
        return null !== this.#timeoutID;
    }

    /**
     * Définit l'état de la tâche.
     *
     * @param {boolean} value <code>true</code> pour activer la tâche ; sinon
     *                        <code>false</code>.
     */
    set active(value) {
        if (value) {
            this.start();
        } else {
            this.stop();
        }
    }

    /**
     * Définit le <code>this</code> et les paramètres passés à la fonction.
     *
     * @param {any}    thisArg Le <code>this</code> utilisé pour la fonction.
     * @param {...any} args    Les paramètres passés à la fonction.
     * @returns {Cron} La tâche elle-même.
     */
    bind(thisArg, ...args) {
        this.#thisArg = thisArg;
        this.#args = args;
        return this;
    }

    /**
     * Remet les valeurs par défaut pour le <code>this</code> et les paramètres
     * passés à la fonction.
     *
     * @returns {Cron} La tâche elle-même.
     */
    unbind() {
        this.#thisArg = this;
        this.#args = [];
        return this;
    }

    /**
     * Définit les paramètres passés à la fonction.
     *
     * @param {...any} args Les paramètres passés à la fonction.
     * @returns {Cron} La tâche elle-même.
     */
    withArguments(...args) {
        this.#args = args;
        return this;
    }

    /**
     * Enlève les paramètres passés à la fonction.
     *
     * @returns {Cron} La tâche elle-même.
     */
    withoutArguments() {
        this.#args = [];
        return this;
    }

    /**
     * Exécute manuellement la fonction.
     */
    run() {
        this.#func.bind(this.#thisArg)(...this.#args);
    }

    /**
     * Programme la prochaine exécution.
     */
    #schedule() {
        const next = this.next();
        if (undefined === next) {
            // Ne pas planifier de prochaine exécution, mais définir une valeur
            // différente de null pour l'identifiant du minuteur afin d'indiquer
            // que la tâche est active.
            this.#timeoutID = undefined;
        } else {
            const delay = next.getTime() - Date.now();
            if (MAX_DELAY >= delay) {
                // Planifier la prochaine exécution.
                this.#timeoutID = setTimeout(() => {
                    this.#schedule();
                    this.run();
                }, delay);
            } else {
                // Planifier des étapes intermédiaires car Node.js n'accepte pas
                // un grand délai.
                this.#timeoutID = setTimeout(() => {
                    this.#schedule();
                }, MAX_DELAY);
            }
        }
    }

    /**
     * Annule les prochaines exécutions.
     */
    #cancel() {
        clearTimeout(this.#timeoutID);
        this.#timeoutID = null;
    }

    /**
     * Active la tâche.
     *
     * @returns {boolean} <code>true</code> quand la tâche a été activée ;
     *                    <code>false</code> si elle était déjà active.
     */
    start() {
        if (this.active) {
            return false;
        }
        this.#schedule();
        return true;
    }

    /**
     * Désactive la tâche.
     *
     * @returns {boolean} <code>true</code> quand la tâche a été désactivée ;
     *                    <code>false</code> si elle était déjà inactive.
     */
    stop() {
        if (!this.active) {
            return false;
        }
        this.#cancel();
        return true;
    }

    /**
     * Teste si une date respecte une des expressions <em>cron</em> de la tâche.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} <code>true</code> si une des expressions est
     *                    respectée ; sinon <code>false</code>.
     */
    test(date = new Date()) {
        return this.#cronexes.some((c) => c.test(date));
    }

    /**
     * Calcule la prochaine date respectant une des expressions <em>cron</em> de
     * la tâche.
     *
     * @param {Date} [start] La date de début (ou l'instant présent par défaut).
     * @returns {Date|undefined} La prochaine date respectant une des
     *                           expressions ou <code>undefined</code> s'il n'y
     *                           a pas de prochaine date (car il n'y a aucune
     *                           expression <em>cron</em>).
     */
    next(start = new Date()) {
        if (0 === this.#cronexes.length) {
            return undefined;
        }

        return new Date(Math.min(
            ...this.#cronexes.map((c) => c.next(start).getTime()),
        ));
    }
};
