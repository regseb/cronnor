/**
 * @module
 * @author Sébastien Règne
 * @license MIT
 */

/**
 * @typedef {function(number, number, number[]): number} NumberToNumberFunction
 */

/**
 * La classe d'un champ d'une expression cron.
 *
 * @class Field
 * @public
 */
export const Field = class {

    /**
     * Crée un champ d'une expression cron autorisant une seule valeur.
     *
     * @param {number} value La valeur autorisée pour le champ.
     * @returns {Field} Le champ avec la valeur.
     * @public
     */
    static of(value) {
        return new Field([value]);
    }

    /**
     * Crée un champ d'une expression cron avec toutes les valeurs autorisées
     * (sans restriction).
     *
     * @param {number} min La valeur minimale (incluse) autorisée.
     * @param {number} max La valeur maximale (incluse) autorisée.
     * @returns {Field} Le champ avec toutes les valeurs (sans restriction).
     * @public
     */
    static all(min, max) {
        const values = [];
        for (let value = min; value <= max; ++value) {
            values.push(value);
        }
        return new Field(values, false);
    }

    /**
     * Crée un champ d'une expression cron avec un intervalle de valeurs
     * autorisées.
     *
     * @param {number} min La valeur minimale (incluse) autorisée.
     * @param {number} max La valeur maximale (incluse) autorisée.
     * @param {number} step Le pas entre les valeurs.
     * @returns {Field} Le champ avec l'intervalle de valeurs.
     * @public
     */
    static range(min, max, step) {
        const values = [];
        for (let value = min; value <= max; value += step) {
            values.push(value);
        }
        return new Field(values);
    }

    /**
     * Regroupe les valeurs de plusieurs champs.
     *
     * @param {Field[]} fields La liste des champs qui seront regroupés.
     * @returns {Field} Le champ avec toutes les valeurs.
     * @public
     */
    static flat(fields) {
        return new Field(fields.flatMap((f) => f._values));
    }

    /**
     * Crée un champ d'une expression cron.
     *
     * @param {number[]} values       La liste des valeurs autorisées pour le
     *                                champ.
     * @param {boolean}  [restricted] <code>true</code> (par défaut) pour un
     *                                champ était différent de
     *                                <code>"*"</code> ; sinon
     *                                <code>false</code>.
     * @public
     */
    constructor(values, restricted = true) {
        // eslint-disable-next-line padded-blocks

        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        this._values = values.filter((v, i, a) => i === a.indexOf(v))
                             .sort((v1, v2) => v1 - v2);

        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        this._restricted = restricted;
    }

    /**
     * Retourne la marque indiquant si le champ était différent de
     * <code>"*"</code>.
     *
     * @returns {boolean} <code>true</code> si le champ était différent de
     *                    <code>"*"</code> ; sinon <code>false</code>.
     * @public
     */
    get restricted() {
        return this._restricted;
    }

    /**
     * Retourne la valeur minimale.
     *
     * @returns {number} La valeur minimale.
     * @public
     */
    get min() {
        return this._values[0];
    }

    /**
     * Retourne la valeur maximale.
     *
     * @returns {number} La valeur maximale.
     * @public
     */
    get max() {
        return this._values[this._values.length - 1];
    }

    /**
     * Retourne la liste des valeurs autorisées pour le champ.
     *
     * @returns {number[]} La liste des valeurs.
     * @public
     */
    values() {
        return this._values;
    }

    /**
     * Applique une fonction sur toutes les valeurs.
     *
     * @param {NumberToNumberFunction} callback La fonction appelée sur les
     *                                          valeurs.
     * @returns {Field} Le nouveau champ avec les valeurs modifiées.
     * @public
     */
    map(callback) {
        return new Field(this._values.map(callback), this._restricted);
    }

    /**
     * Teste si une valeur est dans présent dans la liste des valeurs.
     *
     * @param {number} value La valeur qui sera testée.
     * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
     *                    <code>false</code>.
     * @public
     */
    test(value) {
        return this._values.includes(value);
    }

    /**
     * Calcule la prochaine valeur supérieure à une valeur.
     *
     * @param {number} value La valeur initiale.
     * @returns {number|undefined} La prochaine valeur ; ou
     *                             <code>undefined</code> si la valeur initiale
     *                             est supérieure à la valeur maximale.
     * @public
     */
    next(value) {
        return this._values.find((v) => value < v);
    }
};