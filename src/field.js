/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Génère un nombre aléatoire entre le minimum et le maximum.
 *
 * @param {number} min La valeur minimale (incluse).
 * @param {number} max La valeur maximale (incluse).
 * @returns {number} Le nombre aléatoire généré.
 */
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * La classe d'un champ d'une expression <em>cron</em>.
 *
 * @class
 */
export default class Field {
    /**
     * Crée un champ d'une expression <em>cron</em> avec un intervalle de
     * valeurs autorisées.
     *
     * @param {number}  min              La valeur minimale (incluse) autorisée.
     * @param {number}  max              La valeur maximale (incluse) autorisée.
     * @param {number}  step             Le pas entre les valeurs.
     * @param {Object}  extra            Les informations supplémentaires.
     * @param {boolean} extra.restricted <code>true</code> pour un champ qui
     *                                   était différent de <code>"*"</code> ;
     *                                   sinon <code>false</code>.
     * @param {boolean} extra.random     <code>false</code> pour générer un
     *                                   nombre aléatoire pour le minimum.
     * @returns {Field} Le champ avec les valeurs de l'intervalle.
     */
    static range(min, max, step, extra) {
        const values = [];
        for (
            let value = extra.random
                ? random(min, Math.min(min + step - 1, max))
                : min;
            value <= max;
            value += step
        ) {
            values.push(value);
        }
        return new Field(values, extra.restricted);
    }

    /**
     * Regroupe les valeurs de plusieurs champs.
     *
     * @param {Field[]} fields La liste des champs qui seront regroupés.
     * @returns {Field} Le champ avec la fusion des valeurs.
     */
    static flat(fields) {
        return 1 === fields.length
            ? fields[0]
            : new Field(
                  fields.flatMap((f) => f.#values),
                  true,
              );
    }

    /**
     * La liste des valeurs autorisées pour le champ (sans doublons et triée).
     *
     * @type {number[]}
     */
    #values;

    /**
     * <code>true</code> si le champ était différent de <code>"*"</code> ; sinon
     * <code>false</code>.
     *
     * @type {boolean}
     */
    #restricted;

    /**
     * Crée un champ d'une expression <em>cron</em>.
     *
     * @param {number[]} values     La liste des valeurs autorisées pour le
     *                              champ.
     * @param {boolean}  restricted <code>true</code> pour un champ qui était
     *                              différent de <code>"*"</code> ; sinon
     *                              <code>false</code>.
     */
    constructor(values, restricted) {
        // Enlever les doublons et trier les valeurs pour faciliter les
        // algorithmes.
        this.#values = values
            .filter((v, i, a) => i === a.indexOf(v))
            .sort((v1, v2) => v1 - v2);
        this.#restricted = restricted;
    }

    /**
     * Retourne la marque indiquant si le champ était différent de
     * <code>"*"</code>.
     *
     * @returns {boolean} <code>true</code> si le champ était différent de
     *                    <code>"*"</code> ; sinon <code>false</code>.
     */
    get restricted() {
        return this.#restricted;
    }

    /**
     * Retourne la valeur minimale.
     *
     * @returns {number} La valeur minimale.
     */
    get min() {
        return this.#values[0];
    }

    /**
     * Retourne la valeur maximale.
     *
     * @returns {number} La valeur maximale.
     */
    get max() {
        // Indiquer que la valeur ne sera pas undefined car la liste des valeurs
        // n'est jamais vide.
        return /** @type {number} */ (this.#values.at(-1));
    }

    /**
     * Retourne la liste des valeurs autorisées pour le champ.
     *
     * @returns {number[]} La liste des valeurs.
     */
    values() {
        return this.#values;
    }

    /**
     * Applique une fonction sur toutes les valeurs.
     *
     * @param {function(number, number, number[]): number} callback La fonction
     *                                                              appelée sur
     *                                                              les valeurs.
     * @returns {Field} Le nouveau champ avec les valeurs modifiées.
     */
    map(callback) {
        return new Field(this.#values.map(callback), this.#restricted);
    }

    /**
     * Teste si une valeur est présente dans la liste des valeurs.
     *
     * @param {number} value La valeur qui sera testée.
     * @returns {boolean} <code>true</code> si la valeur est présente ; sinon
     *                    <code>false</code>.
     */
    test(value) {
        return this.#values.includes(value);
    }

    /**
     * Calcule la prochaine valeur supérieure à une valeur.
     *
     * @param {number} value La valeur initiale.
     * @returns {number|undefined} La prochaine valeur ; ou
     *                             <code>undefined</code> si la valeur initiale
     *                             est supérieure à la valeur maximale.
     */
    next(value) {
        return this.#values.find((v) => value < v);
    }
}
