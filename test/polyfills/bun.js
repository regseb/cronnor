/**
 * Prothèses pour des APIs de Node.js qui ne sont pas dans Bun.
 *
 * @license MIT
 * @author Sébastien Règne
 */

import { mock as mockNode } from "node:test";
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import { mock as mockBun, setSystemTime, spyOn } from "bun:test";

/**
 * @import { Mock, MockTimersOptions } from "node:test"
 */

/**
 * Résultat d'une fonction mockée.
 *
 * @typedef {Object} MockFunctionResult
 * @prop {string} type  Type du résultat (`"incomplete"`, `"return"` ou
 *                      `"throw"`).
 * @prop {any}    value Valeur du résultat pour le type `"return"`.
 * @see https://github.com/oven-sh/bun/blob/bun-v1.3.5/packages/bun-types/test.d.ts#L2101
 */

/**
 * Données pour simuler un `setTimeout()`.
 *
 * @typedef {Object} Timeout
 * @prop {Function} fn     Fonction à exécuter.
 * @prop {number}   date   Date de l'exécution.
 * @prop {any[]}    args   Arguments à passer à la fonction.
 * @prop {boolean}  active Marque indiquant si le `setTimeout()` est actif.
 */

/**
 * Le gestionnaire du proxy pour adapter l'API de Bun à celle de Node.js.
 *
 * @type {Object}
 * @see https://bun.com/docs/runtime/nodejs-compat#node%3Atest
 * @see https://github.com/oven-sh/bun/issues/24255
 */
const handler = {
    /**
     * Modifie la propriété `mock` pour qu'elle corresponde à l'API de Node.js.
     *
     * @param {any}    target Une fonction mockée par Bun.
     * @param {string} key    Le nom de la propriété.
     * @returns {any} La valeur de la propriété.
     */
    get(target, key) {
        if ("mock" !== key) {
            return Reflect.get(target, key);
        }
        return {
            callCount: () =>
                target.mock.results.filter(
                    (/** @type {MockFunctionResult} */ r) =>
                        "incomplete" !== r.type,
                ).length,
            get calls() {
                const calls = [];
                for (let i = 0; i < target.mock.calls.length; ++i) {
                    calls.push({
                        arguments: target.mock.calls[i],
                        this: target.mock.contexts[i],
                    });
                }
                return calls;
            },
        };
    },
};

/**
 * Crée un mock de fonction.
 *
 * @param {Function} [implementation] L'implémentation de la fonction mockée.
 * @returns {Mock<Function>} La fonction mockée.
 * @see https://nodejs.org/api/test.html#mockfnoriginal-implementation-options
 */
mockNode.fn = (implementation) => {
    // @ts-expect-error
    return new Proxy(mockBun(implementation), handler);
};

/**
 * Crée un mock pour une méthode d'un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}                                            object         L'objet
 *                                                                      contenant
 *                                                                      la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {keyof T}                                      methodName     Le nom
 *                                                                      de la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {Extract<T[keyof T], (...args: any[]) => any>} implementation L'implémentation
 *                                                                      de la
 *                                                                      méthode
 *                                                                      mockée.
 * @returns {Mock<Function>} La méthode mockée.
 * @see https://nodejs.org/api/test.html#mockmethodobject-methodname-implementation-options
 */
mockNode.method = (object, methodName, implementation) => {
    // @ts-expect-error
    return new Proxy(
        spyOn(object, methodName).mockImplementation(implementation),
        handler,
    );
};

/**
 * Liste des `setTimeout()` mockés.
 *
 * @type {Timeout[]}
 */
const timeouts = [];

// @ts-expect-error
mockNode.timers = {
    /**
     * Active le mock du temps.
     *
     * @param {MockTimersOptions} enableOptions Options pour mocker le temps.
     * @see https://nodejs.org/api/test.html#timersenableenableoptions
     */
    enable(enableOptions) {
        mockNode.method(
            globalThis,
            "setTimeout",
            (
                /** @type {Function} */ fn,
                /** @type {number} */ ms,
                /** @type {any[]} */ ...args
            ) => {
                timeouts.push({
                    fn,
                    date: Date.now() + ms,
                    args,
                    active: true,
                });
                return timeouts.length - 1;
            },
        );
        mockNode.method(
            globalThis,
            "clearTimeout",
            (/** @type {number} */ timeoutID) => {
                timeouts[timeoutID].active = false;
            },
        );
        setSystemTime(enableOptions.now);
    },

    /**
     * Avance dans le temps mocké.
     *
     * @param {number} milliseconds Nombre de millisecondes à avancer.
     * @see https://nodejs.org/api/test.html#timerstickmilliseconds
     */
    tick(milliseconds = 1) {
        setSystemTime(Date.now() + milliseconds);
        for (const timeout of timeouts) {
            if (timeout.active && Date.now() >= timeout.date) {
                timeout.active = false;
                timeout.fn(...timeout.args);
            }
        }
    },
};

/**
 * Annule les mocks.
 *
 * @see https://nodejs.org/api/test.html#mockreset
 */
mockNode.reset = () => {
    mockBun.restore();
    setSystemTime();
    timeouts.length = 0;
};
