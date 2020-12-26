/**
 * La classe d'une expression cron.
 *
 * @class CronExp
 * @public
 */
export const CronExp: {
    new (pattern: string): {
        /**
         * Les valeurs possibles pour les minutes.
         *
         * @type {Field}
         * @private
         */
        minutes: {
            _values: number[];
            restricted: boolean;
            readonly min: number;
            readonly max: number;
            values(): number[];
            map(callback: (arg0: number, arg1: number, arg2: number[]) => number): any;
            test(value: number): boolean;
            next(value: number): number | undefined;
        };
        /**
         * Les valeurs possibles pour les heures.
         *
         * @type {Field}
         * @private
         */
        hours: {
            _values: number[];
            restricted: boolean;
            readonly min: number;
            readonly max: number;
            values(): number[];
            map(callback: (arg0: number, arg1: number, arg2: number[]) => number): any;
            test(value: number): boolean;
            next(value: number): number | undefined;
        };
        /**
         * Les valeurs possibles pour le jour du mois.
         *
         * @type {Field}
         * @private
         */
        date: {
            _values: number[];
            restricted: boolean;
            readonly min: number;
            readonly max: number;
            values(): number[];
            map(callback: (arg0: number, arg1: number, arg2: number[]) => number): any;
            test(value: number): boolean;
            next(value: number): number | undefined;
        };
        /**
         * Les valeurs possibles pour le mois (dont le numéro commence à zéro
         * pour janvier).
         *
         * @type {Field}
         * @private
         */
        month: {
            _values: number[];
            restricted: boolean;
            readonly min: number;
            readonly max: number;
            values(): number[];
            map(callback: (arg0: number, arg1: number, arg2: number[]) => number): any;
            test(value: number): boolean;
            next(value: number): number | undefined;
        };
        /**
         * Les valeurs possibles pour le jour de la semaine.
         *
         * @type {Field}
         * @private
         */
        day: {
            _values: number[];
            restricted: boolean;
            readonly min: number;
            readonly max: number;
            values(): number[];
            map(callback: (arg0: number, arg1: number, arg2: number[]) => number): any;
            test(value: number): boolean;
            next(value: number): number | undefined;
        };
        /**
         * Teste si l'expression est respectée.
         *
         * @param {Date} [date] La date qui sera testée (ou l'instant présent par
         *                      défaut).
         * @returns {boolean} <code>true</code> si l'expression est respectée ;
         *                    sinon <code>false</code>.
         */
        test(date?: Date | undefined): boolean;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition des minutes.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition des minutes.
         * @private
         */
        _nextMinutes(start: Date): Date;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition des heures.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition des heures.
         * @private
         */
        _nextHours(start: Date): Date;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition du jour du mois.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition du jour du
         *                 mois.
         * @private
         */
        _nextDate(start: Date): Date;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition du jour de la semaine.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition du jour de la
         *                 semaine.
         * @private
         */
        _nextDay(start: Date): Date;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition du jour du mois ou de la semaine.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition du jour du
         *                 mois ou de la semaine.
         * @private
         */
        _nextDateDay(start: Date): Date;
        /**
         * Calcule la prochaine date (ou la date de début) en vérifiant seulement la
         * condition du mois.
         *
         * @param {Date} start La date de début.
         * @returns {Date} La prochaine date vérifiant la condition du mois.
         * @private
         */
        _nextMonth(start: Date): Date;
        /**
         * Calcule la prochaine date respectant l'expression.
         *
         * @param {Date} [start] La date de début (ou l'instant présent par défaut).
         * @returns {Date} La prochaine date respectant l'expression.
         */
        next(start?: Date | undefined): Date;
    };
};
