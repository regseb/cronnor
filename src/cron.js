/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import At from "./at.js";
import CronExp from "./cronexp.js";

/**
 * La classe d'une tâche <em>cronée</em>.
 *
 * @class
 */
export default class Cron {
    /**
     * La liste des expressions <em>cron</em> indiquant les horaires d'exécution
     * de la tâche.
     *
     * @type {CronExp[]}
     */
    #cronexps;

    /**
     * La fonction appelée à chaque horaire indiqué dans les expressions
     * <em>cron</em>.
     *
     * @type {Function}
     */
    #func;

    /**
     * La planification de la prochaine exécution ; ou <code>undefined</code> si
     * la tâche est désactivée.
     *
     * @type {At|undefined}
     */
    #at;

    /**
     * Crée une tâche <em>cronée</em>.
     *
     * @param {string|string[]} cronex            La ou les expressions
     *                                            <em>cron</em> indiquant les
     *                                            horaires d'exécution de la
     *                                            tâche.
     * @param {Function}        func              La fonction appelée à chaque
     *                                            horaire indiqué dans les
     *                                            expressions <em>cron</em>.
     * @param {Object}          [options]         Les options de la tâche
     *                                            <em>cronée</em>.
     * @param {boolean}         [options.active]  <code>true</code> (par défaut)
     *                                            pour activer la tâche ; sinon
     *                                            <code>false</code>.
     * @param {any}             [options.thisArg] Le <code>this</code> utilisé
     *                                            pour la fonction (la tâche
     *                                            <em>cronée</em> par défaut).
     * @param {any[]}           [options.args]    Les paramètres passés à la
     *                                            fonction (aucun paramètre par
     *                                            défaut).
     * @throws {Error}      Si la syntaxe d'une expression <em>cron</em> est
     *                      incorrecte.
     * @throws {RangeError} Si un intervalle d'une expression <em>cron</em> est
     *                      invalide (hors limite ou quand la borne supérieure
     *                      est plus petite que la borne inférieure).
     * @throws {TypeError}  Si le constructeur est appelé sans le mot clé
     *                      <code>new</code> ou si un des paramètres n'a pas le
     *                      bon type.
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
     * @returns {boolean} <code>true</code> si la tâche est active ; sinon
     *                    <code>false</code>.
     */
    get active() {
        return undefined !== this.#at;
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
     * @returns {boolean} <code>true</code> quand la tâche a été activée ;
     *                    <code>false</code> si elle était déjà active.
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
     * @returns {boolean} <code>true</code> quand la tâche a été désactivée ;
     *                    <code>false</code> si elle était déjà inactive.
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
     * Teste si une date respecte une des expressions <em>cron</em> de la tâche.
     *
     * @param {Date} [date] La date qui sera testée (ou l'instant présent par
     *                      défaut).
     * @returns {boolean} <code>true</code> si une des expressions est
     *                    respectée ; sinon <code>false</code>.
     */
    test(date = new Date()) {
        return this.#cronexps.some((c) => c.test(date));
    }

    /**
     * Calcule la prochaine date respectant une des expressions <em>cron</em> de
     * la tâche.
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
