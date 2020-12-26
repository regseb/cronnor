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
export const Field: {
    new (values: number[], restricted?: boolean | undefined): {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    };
    /**
     * Crée un champ d'une expression cron autorisant une seule valeur.
     *
     * @param {number} value La valeur autorisée pour le champ.
     * @returns {Field} Le champ avec la valeur.
     * @public
     */
    of(value: number): {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    };
    /**
     * Crée un champ d'une expression cron avec toutes les valeurs autorisées
     * (sans restriction).
     *
     * @param {number} min La valeur minimale (incluse) autorisée.
     * @param {number} max La valeur maximale (incluse) autorisée.
     * @returns {Field} Le champ avec toutes les valeurs (sans restriction).
     * @public
     */
    all(min: number, max: number): {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    };
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
    range(min: number, max: number, step: number): {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    };
    /**
     * Regroupe les valeurs de plusieurs champs.
     *
     * @param {Field[]} fields La liste des champs qui seront regroupés.
     * @returns {Field} Le champ avec toutes les valeurs.
     * @public
     */
    flat(fields: {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    }[]): {
        /**
         * La liste des valeurs autorisées pour le champ.
         *
         * @type {number[]}
         * @private
         */
        _values: number[];
        /**
         * <code>true</code> si le champ était différent de <code>"*"</code> ;
         * sinon <code>false</code>.
         *
         * @type {boolean}
         * @public
         */
        restricted: boolean;
        /**
         * Retourne la valeur minimale.
         *
         * @returns {number} La valeur minimale.
         * @public
         */
        readonly min: number;
        /**
         * Retourne la valeur maximale.
         *
         * @returns {number} La valeur maximale.
         * @public
         */
        readonly max: number;
        /**
         * Retourne la liste des valeurs autorisées pour le champ.
         *
         * @returns {number[]} La liste des valeurs.
         * @public
         */
        values(): number[];
        /**
         * Applique une fonction sur toutes les valeurs.
         *
         * @param {NumberToNumberFunction} callback La fonction appelée sur les
         *                                          valeurs.
         * @returns {Field} Le nouveau champ avec les valeurs modifiées.
         * @public
         */
        map(callback: NumberToNumberFunction): any;
        /**
         * Teste si une valeur est dans présent dans la liste des valeurs.
         *
         * @param {number} value La valeur qui sera testée.
         * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
         *                    <code>false</code>.
         * @public
         */
        test(value: number): boolean;
        /**
         * Calcule la prochaine valeur supérieure à une valeur.
         *
         * @param {number} value La valeur initiale.
         * @returns {number|undefined} La prochaine valeur ; ou
         *                             <code>undefined</code> si la valeur initiale
         *                             est supérieure à la valeur maximale.
         * @public
         */
        next(value: number): number | undefined;
    };
};
export type NumberToNumberFunction = (arg0: number, arg1: number, arg2: number[]) => number;
