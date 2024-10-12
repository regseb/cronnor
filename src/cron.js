/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import At from "./at.js";
import CronExp from "./cronexp.js";

/**
 * La classe d'une tâche _cronée_.
 *
 * @class
 */
export default class Cron {
    /**
     * La liste des expressions _cron_ indiquant les horaires d'exécution de la
     * tâche.
     *
     * @type {CronExp[]}
     */
    #cronexps;

    /**
     * La fonction appelée à chaque horaire indiqué dans les expressions _cron_.
     *
     * @type {Function}
     */
    #func;

    /**
     * La planification de la prochaine exécution ; ou `undefined` si la tâche
     * est désactivée.
     *
     * @type {At|undefined}
     */
    #at;

    /**
     * Crée une tâche _cronée_.
     *
     * @param {string|string[]} cronex            La ou les expressions _cron_
     *                                            indiquant les horaires
     *                                            d'exécution de la tâche.
     * @param {Function}        func              La fonction appelée à chaque
     *                                            horaire indiqué dans les
     *                                            expressions _cron_.
     * @param {Object}          [options]         Les options de la tâche
     *                                            _cronée_.
     * @param {boolean}         [options.active]  `true` (par défaut) pour
     *                                            activer la tâche ; sinon
     *                                            `false`.
     * @param {any}             [options.thisArg] Le `this` utilisé pour la
     *                                            fonction (la tâche _cronée_
     *                                            par défaut).
     * @param {any[]}           [options.args]    Les paramètres passés à la
     *                                            fonction (aucun paramètre par
     *                                            défaut).
     * @throws {Error}      Si la syntaxe d'une expression _cron_ est
     *                      incorrecte.
     * @throws {RangeError} Si un intervalle d'une expression _cron_ est
     *                      invalide (hors limite ou quand la borne supérieure
     *                      est plus petite que la borne inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé `new`
     *                      ou si un des paramètres n'a pas le bon type.
     */
    constructor(cronex, func, options) {
        this.#cronexps = Array.isArray(cronex)
            ? cronex.map((c) => new CronExp(c))
            : [new CronExp(cronex)];
        this.#func = func.bind(
            options?.thisArg ?? this,
            ...(options?.args ?? []),
        );

        if (options?.active ?? true) {
            this.#schedule();
        }
    }

    /**
     * Récupère l'état de la tâche (active ou non).
     *
     * @returns {boolean} `true` si la tâche est active ; sinon `false`.
     */
    get active() {
        return undefined !== this.#at;
    }

    /**
     * Définit l'état de la tâche.
     *
     * @param {boolean} value `true` pour activer la tâche ; sinon `false`.
     */
    set active(value) {
        if (value) {
            this.start();
        } else {
            this.stop();
        }
    }

    /**
     * Exécute manuellement la fonction.
     */
    run() {
        this.#func();
    }

    /**
     * Programme la prochaine exécution.
     */
    #schedule() {
        this.#at = new At(this.next(), () => {
            this.#schedule();
            this.run();
        });
    }

    /**
     * Active la tâche.
     *
     * @returns {boolean} `true` quand la tâche a été activée ; `false` si elle
     *                    était déjà active.
     */
    start() {
        if (undefined !== this.#at) {
            return false;
        }
        this.#schedule();
        return true;
    }

    /**
     * Désactive la tâche.
     *
     * @returns {boolean} `true` quand la tâche a été désactivée ; `false` si
     *                    elle était déjà inactive.
     */
    stop() {
        if (undefined === this.#at) {
            return false;
        }
        this.#at.abort();
        this.#at = undefined;
        return true;
    }

    /**
     * Teste si une date respecte une des expressions _cron_ de la tâche.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} `true` si une des expressions est respectée ; sinon
     *                    `false`.
     */
    test(date = new Date()) {
        return this.#cronexps.some((c) => c.test(date));
    }

    /**
     * Calcule la prochaine date respectant une des expressions _cron_ de la
     * tâche.
     *
     * @param {Date} [start] La date de début (ou l'instant présent par défaut).
     * @returns {Date} La prochaine date respectant une des expressions.
     */
    next(start = new Date()) {
        return new Date(
            Math.min(...this.#cronexps.map((c) => c.next(start).getTime())),
        );
    }
}
