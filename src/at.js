/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * La valeur maximale du délai accepté par _Node.js_.
 *
 * @type {number}
 * @see https://nodejs.org/api/timers.html#settimeoutcallback-delay-args
 */
const MAX_DELAY = 2_147_483_647;

/**
 * La classe d'une tâche planifiée.
 *
 * @class
 */
export default class At {
    /**
     * La date de planification de la tâche.
     *
     * @type {Date}
     */
    #date;

    /**
     * La fonction appelée à la date planifiée.
     *
     * @type {Function}
     */
    #func;

    /**
     * L'identifiant du minuteur de la planification.
     *
     * @type {any}
     */
    #timeoutID;

    /**
     * Crée une tâche planifiée.
     *
     * @param {Date}     date              La date de planification de la tâche.
     * @param {Function} func              La fonction appelée à la date
     *                                     planifiée.
     * @param {Object}   [options]         Les options de la planification de la
     *                                     tâche.
     * @param {any}      [options.thisArg] Le `this` utilisé pour la fonction
     *                                     (la tâche planifiée par défaut).
     * @param {any[]}    [options.args]    Les paramètres passés à la fonction
     *                                     (aucun paramètre par défaut).
     * @throws {TypeError} Si le constructeur est appelé sans le mot clé `new`.
     */
    constructor(date, func, options) {
        this.#date = date;
        this.#func = func.bind(
            options?.thisArg ?? this,
            ...(options?.args ?? []),
        );

        this.#schedule();
    }

    /**
     * Exécute manuellement la fonction.
     */
    run() {
        this.#func();
    }

    /**
     * Planifie l'exécution.
     */
    #schedule() {
        const delay = this.#date.getTime() - Date.now();
        if (MAX_DELAY >= delay) {
            // Planifier l'exécution.
            this.#timeoutID = setTimeout(() => this.run(), delay);
        } else {
            // Planifier des étapes intermédiaires, car Node.js n'accepte pas
            // un grand délai.
            this.#timeoutID = setTimeout(() => this.#schedule(), MAX_DELAY);
        }
    }

    /**
     * Annule la planification.
     */
    abort() {
        clearTimeout(this.#timeoutID);
    }
}
