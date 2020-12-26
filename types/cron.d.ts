/**
 * La classe d'une tâche cronée.
 *
 * @class Cron
 * @public
 */
export const Cron: {
    new (cronex: string | string[], func: Function, active?: boolean | undefined): {
        /**
         * La liste des expressions cron indiquant les horaires d'exécution de
         * la tâche.
         *
         * @type {CronExp[]}
         * @private
         */
        _cronexes: {
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
            test(date?: Date | undefined): boolean;
            _nextMinutes(start: Date): Date;
            _nextHours(start: Date): Date;
            _nextDate(start: Date): Date;
            _nextDay(start: Date): Date;
            _nextDateDay(start: Date): Date;
            _nextMonth(start: Date): Date;
            next(start?: Date | undefined): Date;
        }[];
        /**
         * La fonction appelée à chaque horaire indiqué dans les expressions
         * cron.
         *
         * @type {Function}
         * @private
         */
        _func: Function;
        /**
         * Le <code>this</code> utilisé pour la fonction.
         *
         * @type {?*}
         * @private
         */
        _thisArgs: any | null;
        /**
         * La liste des paramètres passés à la fonction.
         *
         * @type {(?*)[]}
         * @private
         */
        _args: (any | null)[];
        /**
         * L'identifiant du minuteur de la prochaine exécution ; ou
         * <code>null</code> si la tâche est désactivée.
         *
         * @type {?*}
         * @private
         */
        _timeoutID: any | null;
        /**
         * Récupère l'état de la tâche (active ou non).
         *
         * @returns {boolean} <code>true</code> si la tâche est active ; sinon
         *                    <code>false</code>.
         * @public
         */
        readonly active: boolean;
        /**
         * Définit le <code>this</code> et les paramètres passés à la fonction.
         *
         * @param {*}    thisArgs Le <code>this</code> utilisé pour la fonction.
         * @param {...*} args     Les paramètres passés à la fonction.
         * @returns {Cron} Retourne la tâche elle-même.
         * @public
         */
        bind(thisArgs: any, ...args: any[]): any;
        /**
         * Remet les valeurs par défaut pour le <code>this/<code> et les paramètres
         * passés à la fonction.
         *
         * @returns {Cron} Retourne la tâche elle-même.
         * @public
         */
        unbind(): any;
        /**
         * Définit les paramètres passés à la fonction.
         *
         * @param {...*} args Les paramètres passés à la fonction.
         * @returns {Cron} Retourne la tâche elle-même.
         * @public
         */
        withArguments(...args: any[]): any;
        /**
         * Exécute la fonction.
         *
         * @public
         */
        run(): void;
        /**
         * Programme la prochaine exécution.
         *
         * @private
         */
        _schedule(): void;
        /**
         * Annule les prochaines exécutions.
         *
         * @private
         */
        _cancel(): void;
        /**
         * Active la tâche.
         *
         * @returns {boolean} <code>true</code> quand la tâche a été activée ;
         *                    <code>false</code> si elle était déjà active.
         * @public
         */
        start(): boolean;
        /**
         * Désactive la tâche.
         *
         * @returns {boolean} <code>true</code> quand la tâche a été désactivée ;
         *                    <code>false</code> si elle était déjà inactive.
         * @public
         */
        stop(): boolean;
        /**
         * Teste si une expression cron de la tâche est respectée.
         *
         * @param {Date} [date] La date qui sera testée (ou l'instant présent par
         *                      défaut).
         * @returns {boolean} <code>true</code> si une expression est respectée ;
         *                    sinon <code>false</code>.
         * @public
         */
        test(date?: Date | undefined): boolean;
        /**
         * Calcule la prochaine date respectant une expression cron de la tâche.
         *
         * @param {Date} [start] La date de début (ou l'instant présent par défaut).
         * @returns {Date} La prochaine date respectant une expression.
         * @public
         */
        next(start?: Date | undefined): Date;
    };
};
