/**
 * @file Bibliothèque JavaScript Scronpt implémentant un programme Unix cron.
 * @author Sébastien Règne
 * @version 1.0
 * @license Licence Public Rien À Branler
 */

(function() {
    "use strict";

    /**
     * La séquence utilisée pour déterminer l'identifiant d'une nouvelle tâche.
     *
     * @type {!number}
     * @private
     */
    var sequence = 0;

    /**
     * La liste des tâches.
     *
     * @type {!Object}
     * @private
     */
    var jobs = { };

    /**
     * L'identifiant de l'intervalle qui vérifie toutes les minutes si des
     * tâches doivent-être exécutées.
     *
     * @type {?number}
     * @private
     */
    var intervalID = null;


    /**
     * Parser une notation cron.
     *
     * @param {!string} input - la notation cron.
     * @return {!Object} Retourne les conditions pour exécuter la tâche.
     * @private
     */
    var parse = function(input) {
        // Remplacer les raccourcis.
        switch(input) {
            case "@yearly": case "@annually": input = "0 0 1 1 *"; break;
            case "@monthly":                  input = "0 0 1 * *"; break;
            case "@weekly":                   input = "0 0 * * 0"; break;
            case "@daily": case "@midnight":  input = "0 0 * * *"; break;
            case "@hourly":                   input = "0 * * * *";
        }

        var fields = input.split(" ");
        if (5 !== fields.length)
            throw new Error("Syntax error, 5 fields (separated by one space)" +
                            " expected: '" + input + "'");

        // Remplacer les formes littérales des mois.
        fields[3] = fields[3].replace(/jan/g,  "1")
                             .replace(/feb/g,  "2")
                             .replace(/mar/g,  "3")
                             .replace(/apr/g,  "4")
                             .replace(/may/g,  "5")
                             .replace(/jun/g,  "6")
                             .replace(/jul/g,  "7")
                             .replace(/aug/g,  "8")
                             .replace(/sep/g,  "9")
                             .replace(/oct/g, "10")
                             .replace(/nov/g, "11")
                             .replace(/dec/g, "12");
        // Remplacer les formes littérales des jours de la semaine.
        fields[4] = fields[4].replace(/sun/g, "0")
                             .replace(/mon/g, "1")
                             .replace(/tue/g, "2")
                             .replace(/wed/g, "3")
                             .replace(/thu/g, "4")
                             .replace(/fri/g, "5")
                             .replace(/sat/g, "6");

        var conds = [];
        for (var i in fields) {
            var cond = [];
            var ranges = fields[i].split(",");
            for (var j in ranges) {
                var result = /^(\*|\d+)(-\d+)?(\/\d+)?$/.exec(ranges[j]);
                if (null === result)
                    throw new Error("Syntax error: '" + input + "'");

                var min  = 0,
                    max  = Infinity,
                    step = 1;

                if ("*" !== result[1])
                    min = max = parseInt(result[1], 10);
                if (undefined !== result[2])
                    max = parseInt(result[2].substr(1), 10);
                if (undefined !== result[3])
                    step = parseInt(result[3].substr(1), 10);

                cond.push({
                    "min":  min,
                    "max":  max,
                    "step": step
                });
            }
            conds.push(cond);
        }
        return conds;
    }; // parse()

    /**
     * Vérifier qu'une tâche doit-être exécutée.
     *
     * @param {!Object} conds - les conditions pour exécuter la tâche.
     * @param {!number} value - la valeur qui sera testée.
     * @return {!boolean} Retourne <code>true</code> si la tâche doit-être
     *                    exécutée : sinon <code>false</code>.
     * @private
     */
    var valide = function(conds, value) {
        for (var i in conds) {
            var cond = conds[i];

            if (cond.min <= value && value <= cond.max &&
                    0 === (value - cond.min) % cond.step)
                return true;
        }
        return false;
    }; // valide()

    /**
     * Exécuter une tâche.
     *
     * @param {!Object} job - la tâche contenant la méthode à appeler et les
     *                        paramètres à lui passer.
     * @private
     */
    var run = function(job) {
        job.func.apply(window, job.args);
    }; // run()


    /**
     * Ajouter une tâche.
     *
     * @param {!function()} func - la fonction effectuant la tâche.
     * @param {!string}     cron - les horaires quand la tâche sera effectuée.
     * @param {...*}        args - les paramètres qui seront passés à la
                                   fonction.
     * @return {!number} Retourne un identifiant pour pouvoir supprimer la tâche
     *                   créée.
     * @see clearCron
     * @public
     */
    window.setCron = function(func, cron, args) {
        var cronID = ++sequence;
        jobs[cronID.toString()] = {
            "conds": parse(cron),
            "func":  func,
            "args":  Array.prototype.slice.call(arguments, 2)
        };

        if (null === intervalID)
            // Créer la boucle qui vérifiera chaque minute : si une tâche
            // doit-être exécutée.
            intervalID = setInterval(function() {
                var now = new Date();
                for (var id in jobs) {
                    var job = jobs[id];
                    if (valide(job.conds[0], now.getMinutes()) &&
                            valide(job.conds[1], now.getHours()) &&
                            (valide(job.conds[2], now.getDay()) ||
                                    0 === now.getDay() &&
                                    valide(job.conds[2], 7)) &&
                            valide(job.conds[3], now.getMonth() + 1) &&
                            valide(job.conds[4], now.getDate()))
                        setTimeout(run, 0, job);
                }
            }, 60000);

        return cronID;
    }; // setCron()

    /**
     * Supprimer une tâche.
     *
     * @param {!number} cronID - l'identifiant de la tâche à supprimer.
     * @see setCron
     * @public
     */
    window.clearCron = function(cronID) {
        delete jobs[cronID.toString()];

        if (0 === Object.keys(jobs).length) {
            clearInterval(intervalID);
            intervalID = null;
        }
    }; // clearCron()

})();
