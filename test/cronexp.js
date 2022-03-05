import assert from "node:assert";
import CronExp from "../src/cronexp.js";

describe("cronexp.js", function () {
    describe("CronExp", function () {
        describe("constructor()", function () {
            it(`should support "@yearly"`, function () {
                const cronex = new CronExp("@yearly");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(!cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-01T00:00")));
            });

            it(`should support "@annually"`, function () {
                const cronex = new CronExp("@annually");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(!cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-01T00:00")));
            });

            it(`should support "@monthly"`, function () {
                const cronex = new CronExp("@monthly");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(!cronex.test(new Date("2000-01-02T00:00")));
            });

            it(`should support "@weekly"`, function () {
                const cronex = new CronExp("@weekly");
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-01-09T00:00")));
                assert.ok(cronex.test(new Date("2000-02-06T00:00")));
                assert.ok(cronex.test(new Date("2001-01-07T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-01T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-02T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(!cronex.test(new Date("2000-01-03T00:00")));
            });

            it(`should support "@daily"`, function () {
                const cronex = new CronExp("@daily");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
            });

            it(`should support "@midnight"`, function () {
                const cronex = new CronExp("@midnight");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T01:00")));
            });

            it(`should support "@hourly"`, function () {
                const cronex = new CronExp("@hourly");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
            });

            it("should reject when too many fields", function () {
                assert.throws(() => new CronExp("* * * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * * * *",
                });
            });

            it("should reject when not enough fields", function () {
                assert.throws(() => new CronExp("* * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression: * * * *",
                });
            });

            it("should support many spaces", function () {
                const cronex = new CronExp("* *  *   *    *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T01:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
            });


            it(`should support "*"`, function () {
                const cronex = new CronExp("* * * * *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T01:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
            });

            it(`should reject prefix "a*/x"`, function () {
                assert.throws(() => new CronExp("foo*/1 * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " foo*/1 * * * *",
                });
                assert.throws(() => new CronExp("* bar*/1 * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * bar*/1 * * *",
                });
                assert.throws(() => new CronExp("* * baz*/1 * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * * baz*/1 * *",
                });
                assert.throws(() => new CronExp("* * * qux*/1 *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * * * qux*/1 *",
                });
                assert.throws(() => new CronExp("* * * * quux*/0"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                             " * * * * quux*/0",
                });
                assert.throws(() => new CronExp("foo*/1 bar*/1 baz*/1 qux*/1" +
                                                " quux*/1"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                         " foo*/1 bar*/1 baz*/1 qux*/1 quux*/1",
                });
            });

            it(`should reject suffix "*/xa"`, function () {
                assert.throws(() => new CronExp("*/1foo * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " */1foo * * * *",
                });
                assert.throws(() => new CronExp("* */1bar * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * */1bar * * *",
                });
                assert.throws(() => new CronExp("* * */1baz * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * * */1baz * *",
                });
                assert.throws(() => new CronExp("* * * */1qux *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * * * */1qux *",
                });
                assert.throws(() => new CronExp("* * * * */0quux"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                             " * * * * */0quux",
                });
                assert.throws(() => new CronExp("*/1foo */1bar */1baz */1qux" +
                                                " */1quux"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                         " */1foo */1bar */1baz */1qux */1quux",
                });
            });

            it(`should support "*/x"`, function () {
                const cronex = new CronExp("*/1 */2 */3 */4 */5");
                assert.ok(cronex.test(new Date("2000-01-07T00:00")));
                assert.ok(cronex.test(new Date("2000-01-07T00:01")));
                assert.ok(cronex.test(new Date("2000-01-07T02:00")));
                assert.ok(cronex.test(new Date("2000-01-16T00:00")));
                assert.ok(cronex.test(new Date("2000-05-07T00:00")));
                assert.ok(cronex.test(new Date("2001-01-07T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-06T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-07T01:00")));
                assert.ok(!cronex.test(new Date("2000-01-08T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-07T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-08T00:00")));
            });

            it(`should support "*/xx"`, function () {
                const cronex = new CronExp("*/10 */11 */12 */13 */14");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T00:10")));
                assert.ok(cronex.test(new Date("2000-01-01T11:00")));
                assert.ok(cronex.test(new Date("2000-01-13T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T10:00")));
                assert.ok(!cronex.test(new Date("2000-01-12T00:00")));
                assert.ok(!cronex.test(new Date("2000-12-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:01")));
            });

            it(`should reject "*/0"`, function () {
                assert.throws(() => new CronExp("*/0 * * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " */0 * * * *",
                });
                assert.throws(() => new CronExp("* */0 * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * */0 * * *",
                });
                assert.throws(() => new CronExp("* * */0 * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * */0 * *",
                });
                assert.throws(() => new CronExp("* * * */0 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * */0 *",
                });
                assert.throws(() => new CronExp("* * * * */0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * * */0",
                });
                assert.throws(() => new CronExp("*/0 */0 */0 */0 */0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                         " */0 */0 */0 */0 */0",
                });
            });

            it(`should support "jan"`, function () {
                const cronex = new CronExp("* * * jan *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-31T23:59")));
                assert.ok(cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-02-01T00:00")));
            });

            it(`should support "feb"`, function () {
                const cronex = new CronExp("* * * feb *");
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2000-02-29T23:59")));
                assert.ok(cronex.test(new Date("2000-02-01T00:01")));
                assert.ok(cronex.test(new Date("2000-02-01T01:00")));
                assert.ok(cronex.test(new Date("2000-02-02T00:00")));
                assert.ok(cronex.test(new Date("2001-02-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-03-01T00:00")));
            });

            it(`should support "mar"`, function () {
                const cronex = new CronExp("* * * mar *");
                assert.ok(cronex.test(new Date("2000-03-01T00:00")));
                assert.ok(cronex.test(new Date("2000-03-31T23:59")));
                assert.ok(cronex.test(new Date("2000-03-01T00:01")));
                assert.ok(cronex.test(new Date("2000-03-01T01:00")));
                assert.ok(cronex.test(new Date("2000-03-02T00:00")));
                assert.ok(cronex.test(new Date("2001-03-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-29T23:59")));
                assert.ok(!cronex.test(new Date("2000-04-01T00:00")));
            });

            it(`should support "apr"`, function () {
                const cronex = new CronExp("* * * apr *");
                assert.ok(cronex.test(new Date("2000-04-01T00:00")));
                assert.ok(cronex.test(new Date("2000-04-30T23:59")));
                assert.ok(cronex.test(new Date("2000-04-01T00:01")));
                assert.ok(cronex.test(new Date("2000-04-01T01:00")));
                assert.ok(cronex.test(new Date("2000-04-02T00:00")));
                assert.ok(cronex.test(new Date("2001-04-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-03-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-05-01T00:00")));
            });

            it(`should support "may"`, function () {
                const cronex = new CronExp("* * * may *");
                assert.ok(cronex.test(new Date("2000-05-01T00:00")));
                assert.ok(cronex.test(new Date("2000-05-31T23:59")));
                assert.ok(cronex.test(new Date("2000-05-01T00:01")));
                assert.ok(cronex.test(new Date("2000-05-01T01:00")));
                assert.ok(cronex.test(new Date("2000-05-02T00:00")));
                assert.ok(cronex.test(new Date("2001-05-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-04-30T23:59")));
                assert.ok(!cronex.test(new Date("2000-06-01T00:00")));
            });

            it(`should support "jun"`, function () {
                const cronex = new CronExp("* * * jun *");
                assert.ok(cronex.test(new Date("2000-06-01T00:00")));
                assert.ok(cronex.test(new Date("2000-06-30T23:59")));
                assert.ok(cronex.test(new Date("2000-06-01T00:01")));
                assert.ok(cronex.test(new Date("2000-06-01T01:00")));
                assert.ok(cronex.test(new Date("2000-06-02T00:00")));
                assert.ok(cronex.test(new Date("2001-06-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-05-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-07-01T00:00")));
            });

            it(`should support "jul"`, function () {
                const cronex = new CronExp("* * * jul *");
                assert.ok(cronex.test(new Date("2000-07-01T00:00")));
                assert.ok(cronex.test(new Date("2000-07-31T23:59")));
                assert.ok(cronex.test(new Date("2000-07-01T00:01")));
                assert.ok(cronex.test(new Date("2000-07-01T01:00")));
                assert.ok(cronex.test(new Date("2000-07-02T00:00")));
                assert.ok(cronex.test(new Date("2001-07-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-06-30T23:59")));
                assert.ok(!cronex.test(new Date("2000-08-01T00:00")));
            });

            it(`should support "aug"`, function () {
                const cronex = new CronExp("* * * aug *");
                assert.ok(cronex.test(new Date("2000-08-01T00:00")));
                assert.ok(cronex.test(new Date("2000-08-31T23:59")));
                assert.ok(cronex.test(new Date("2000-08-01T00:01")));
                assert.ok(cronex.test(new Date("2000-08-01T01:00")));
                assert.ok(cronex.test(new Date("2000-08-02T00:00")));
                assert.ok(cronex.test(new Date("2001-08-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-07-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-09-01T00:00")));
            });

            it(`should support "sep"`, function () {
                const cronex = new CronExp("* * * sep *");
                assert.ok(cronex.test(new Date("2000-09-01T00:00")));
                assert.ok(cronex.test(new Date("2000-09-30T23:59")));
                assert.ok(cronex.test(new Date("2000-09-01T00:01")));
                assert.ok(cronex.test(new Date("2000-09-01T01:00")));
                assert.ok(cronex.test(new Date("2000-09-02T00:00")));
                assert.ok(cronex.test(new Date("2001-09-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-08-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-10-01T00:00")));
            });

            it(`should support "oct"`, function () {
                const cronex = new CronExp("* * * oct *");
                assert.ok(cronex.test(new Date("2000-10-01T00:00")));
                assert.ok(cronex.test(new Date("2000-10-31T23:59")));
                assert.ok(cronex.test(new Date("2000-10-01T00:01")));
                assert.ok(cronex.test(new Date("2000-10-01T01:00")));
                assert.ok(cronex.test(new Date("2000-10-02T00:00")));
                assert.ok(cronex.test(new Date("2001-10-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-09-30T23:59")));
                assert.ok(!cronex.test(new Date("2000-11-01T00:00")));
            });

            it(`should support "nov"`, function () {
                const cronex = new CronExp("* * * nov *");
                assert.ok(cronex.test(new Date("2000-11-01T00:00")));
                assert.ok(cronex.test(new Date("2000-11-30T23:59")));
                assert.ok(cronex.test(new Date("2000-11-01T00:01")));
                assert.ok(cronex.test(new Date("2000-11-01T01:00")));
                assert.ok(cronex.test(new Date("2000-11-02T00:00")));
                assert.ok(cronex.test(new Date("2001-11-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-10-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-12-01T00:00")));
            });

            it(`should support "dec"`, function () {
                const cronex = new CronExp("* * * dec *");
                assert.ok(cronex.test(new Date("2000-12-01T00:00")));
                assert.ok(cronex.test(new Date("2000-12-31T23:59")));
                assert.ok(cronex.test(new Date("2000-12-01T00:01")));
                assert.ok(cronex.test(new Date("2000-12-01T01:00")));
                assert.ok(cronex.test(new Date("2000-12-02T00:00")));
                assert.ok(cronex.test(new Date("2001-12-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-11-30T23:59")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:00")));
            });

            it("should support month name in min range", function () {
                const cronex = new CronExp("* * * jan-2 *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-02-29T23:59")));
                assert.ok(cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-03-01T00:00")));
            });

            it("should support month name in max range", function () {
                const cronex = new CronExp("* * * 10-dec *");
                assert.ok(cronex.test(new Date("2000-10-01T00:00")));
                assert.ok(cronex.test(new Date("2000-12-31T23:59")));
                assert.ok(cronex.test(new Date("2000-10-01T00:01")));
                assert.ok(cronex.test(new Date("2000-10-01T01:00")));
                assert.ok(cronex.test(new Date("2000-10-02T00:00")));
                assert.ok(cronex.test(new Date("2000-12-01T00:00")));
                assert.ok(cronex.test(new Date("2001-10-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-09-30T23:59")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:00")));
            });

            it(`should support month name in range with step"`, function () {
                const cronex = new CronExp("* * * mar-jun/2 *");
                assert.ok(cronex.test(new Date("2000-03-01T00:00")));
                assert.ok(cronex.test(new Date("2000-05-30T23:59")));
                assert.ok(cronex.test(new Date("2000-03-01T00:01")));
                assert.ok(cronex.test(new Date("2000-03-01T01:00")));
                assert.ok(cronex.test(new Date("2000-03-02T00:00")));
                assert.ok(cronex.test(new Date("2000-05-01T00:00")));
                assert.ok(cronex.test(new Date("2001-03-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-29T23:59")));
                assert.ok(!cronex.test(new Date("2000-04-01T00:00")));
            });

            it(`should support month name in uppercase"`, function () {
                const cronex = new CronExp("* * * JUL-SEP *");
                assert.ok(cronex.test(new Date("2000-07-01T00:00")));
                assert.ok(cronex.test(new Date("2000-09-30T23:59")));
                assert.ok(cronex.test(new Date("2000-07-01T00:01")));
                assert.ok(cronex.test(new Date("2000-07-01T01:00")));
                assert.ok(cronex.test(new Date("2000-07-02T00:00")));
                assert.ok(cronex.test(new Date("2000-08-01T00:00")));
                assert.ok(cronex.test(new Date("2001-07-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-06-30T23:59")));
                assert.ok(!cronex.test(new Date("2000-10-01T00:00")));
            });

            it(`should support "sun"`, function () {
                const cronex = new CronExp("* * * * sun");
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T23:59")));
                assert.ok(cronex.test(new Date("2000-01-02T00:01")));
                assert.ok(cronex.test(new Date("2000-01-02T01:00")));
                assert.ok(cronex.test(new Date("2000-01-09T00:00")));
                assert.ok(cronex.test(new Date("2000-02-06T00:00")));
                assert.ok(cronex.test(new Date("2001-01-07T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-01T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-02T00:00")));
            });

            it(`should support "mon"`, function () {
                const cronex = new CronExp("* * * * mon");
                assert.ok(cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(cronex.test(new Date("2000-01-03T23:59")));
                assert.ok(cronex.test(new Date("2000-01-03T00:01")));
                assert.ok(cronex.test(new Date("2000-01-03T01:00")));
                assert.ok(cronex.test(new Date("2000-01-10T00:00")));
                assert.ok(cronex.test(new Date("2000-02-07T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-02T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-04T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-03T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-03T00:00")));
            });

            it(`should support "tue"`, function () {
                const cronex = new CronExp("* * * * tue");
                assert.ok(cronex.test(new Date("2000-01-04T00:00")));
                assert.ok(cronex.test(new Date("2000-01-04T23:59")));
                assert.ok(cronex.test(new Date("2000-01-04T00:01")));
                assert.ok(cronex.test(new Date("2000-01-04T01:00")));
                assert.ok(cronex.test(new Date("2000-01-11T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-03T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-05T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-04T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-04T00:00")));
            });

            it(`should support "wed"`, function () {
                const cronex = new CronExp("* * * * wed");
                assert.ok(cronex.test(new Date("2000-01-05T00:00")));
                assert.ok(cronex.test(new Date("2000-01-05T23:59")));
                assert.ok(cronex.test(new Date("2000-01-05T00:01")));
                assert.ok(cronex.test(new Date("2000-01-05T01:00")));
                assert.ok(cronex.test(new Date("2000-01-12T00:00")));
                assert.ok(cronex.test(new Date("2000-02-02T00:00")));
                assert.ok(cronex.test(new Date("2001-01-03T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-04T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-06T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-05T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-05T00:00")));
            });

            it(`should support "thu"`, function () {
                const cronex = new CronExp("* * * * thu");
                assert.ok(cronex.test(new Date("2000-01-06T00:00")));
                assert.ok(cronex.test(new Date("2000-01-06T23:59")));
                assert.ok(cronex.test(new Date("2000-01-06T00:01")));
                assert.ok(cronex.test(new Date("2000-01-06T01:00")));
                assert.ok(cronex.test(new Date("2000-01-13T00:00")));
                assert.ok(cronex.test(new Date("2000-02-03T00:00")));
                assert.ok(cronex.test(new Date("2001-01-04T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-05T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-07T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-06T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-06T00:00")));
            });

            it(`should support "fri"`, function () {
                const cronex = new CronExp("* * * * fri");
                assert.ok(cronex.test(new Date("2000-01-07T00:00")));
                assert.ok(cronex.test(new Date("2000-01-07T23:59")));
                assert.ok(cronex.test(new Date("2000-01-07T00:01")));
                assert.ok(cronex.test(new Date("2000-01-07T01:00")));
                assert.ok(cronex.test(new Date("2000-01-14T00:00")));
                assert.ok(cronex.test(new Date("2000-02-04T00:00")));
                assert.ok(cronex.test(new Date("2001-01-05T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-06T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-08T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-07T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-07T00:00")));
            });

            it(`should support "sat"`, function () {
                const cronex = new CronExp("* * * * sat");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T23:59")));
                assert.ok(cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-08T00:00")));
                assert.ok(cronex.test(new Date("2000-02-05T00:00")));
                assert.ok(cronex.test(new Date("2001-01-06T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-09T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-08T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-08T00:00")));
            });

            it("should support day of week name in min range", function () {
                const cronex = new CronExp("* * * * sun-1");
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-01-03T23:59")));
                assert.ok(cronex.test(new Date("2000-01-02T00:01")));
                assert.ok(cronex.test(new Date("2000-01-02T01:00")));
                assert.ok(cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(cronex.test(new Date("2000-02-06T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-01T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-04T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-02T00:00")));
            });

            it("should support day of week name in max range", function () {
                const cronex = new CronExp("* * * * 6-sun");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T23:59")));
                assert.ok(cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(cronex.test(new Date("2000-01-01T01:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(cronex.test(new Date("2000-02-05T00:00")));
                assert.ok(cronex.test(new Date("2001-01-06T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:00")));
            });

            it("should support day of week name in range with step",
                                                                   function () {
                const cronex = new CronExp("* * * * tue-wed/2");
                assert.ok(cronex.test(new Date("2000-01-04T00:00")));
                assert.ok(cronex.test(new Date("2000-01-04T23:59")));
                assert.ok(cronex.test(new Date("2000-01-04T00:01")));
                assert.ok(cronex.test(new Date("2000-01-04T01:00")));
                assert.ok(cronex.test(new Date("2000-01-11T00:00")));
                assert.ok(cronex.test(new Date("2000-02-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-03T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-05T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-04T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-04T00:00")));
            });

            it("should support day of week name in uppercase", function () {
                const cronex = new CronExp("* * * * THU-FRI/3");
                assert.ok(cronex.test(new Date("2000-01-06T00:00")));
                assert.ok(cronex.test(new Date("2000-01-06T23:59")));
                assert.ok(cronex.test(new Date("2000-01-06T00:01")));
                assert.ok(cronex.test(new Date("2000-01-06T01:00")));
                assert.ok(cronex.test(new Date("2000-01-13T00:00")));
                assert.ok(cronex.test(new Date("2000-02-03T00:00")));
                assert.ok(cronex.test(new Date("2001-01-04T00:00")));
                assert.ok(!cronex.test(new Date("2000-01-05T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-07T00:00")));
                assert.ok(!cronex.test(new Date("2000-02-06T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-06T00:00")));
            });

            it(`should support "x,y"`, function () {
                const cronex = new CronExp("0,1 2,4 6,7,8 12,10 7,0");
                assert.ok(cronex.test(new Date("2000-10-01T02:00")));
                assert.ok(cronex.test(new Date("2000-10-01T02:01")));
                assert.ok(cronex.test(new Date("2000-10-01T04:00")));
                assert.ok(cronex.test(new Date("2000-10-06T02:00")));
                assert.ok(cronex.test(new Date("2000-10-07T02:00")));
                assert.ok(cronex.test(new Date("2000-10-08T02:00")));
                assert.ok(cronex.test(new Date("2000-10-01T02:00")));
                assert.ok(cronex.test(new Date("2000-12-03T02:00")));
                assert.ok(!cronex.test(new Date("2000-10-01T01:59")));
                assert.ok(!cronex.test(new Date("2000-10-01T02:02")));
                assert.ok(!cronex.test(new Date("2000-10-01T03:00")));
                assert.ok(!cronex.test(new Date("2000-10-02T02:00")));
                assert.ok(!cronex.test(new Date("2000-11-01T02:00")));
                assert.ok(!cronex.test(new Date("2001-10-01T02:00")));
            });

            it("should reject invalid input", function () {
                assert.throws(() => new CronExp("foo * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " foo * * * *",
                });
                assert.throws(() => new CronExp("* foo * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * foo * * *",
                });
                assert.throws(() => new CronExp("* * foo * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * foo * *",
                });
                assert.throws(() => new CronExp("* * * foo *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * foo *",
                });
                assert.throws(() => new CronExp("* * * * foo"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * * foo",
                });
                assert.throws(() => new CronExp("foo bar baz qux quux"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                        " foo bar baz qux quux",
                });
            });

            it(`should reject prefix "ax"`, function () {
                assert.throws(() => new CronExp("foo0 * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " foo0 * * * *",
                });
                assert.throws(() => new CronExp("* bar0 * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * bar0 * * *",
                });
                assert.throws(() => new CronExp("* * baz1 * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * baz1 * *",
                });
                assert.throws(() => new CronExp("* * * qux1 *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * * qux1 *",
                });
                assert.throws(() => new CronExp("* * * * quux0"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * * * quux0",
                });
                assert.throws(() => new CronExp("foo0 bar0 baz1 qux1 quux0"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                   " foo0 bar0 baz1 qux1 quux0",
                });
            });

            it(`should reject suffix "ax"`, function () {
                assert.throws(() => new CronExp("0foo * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " 0foo * * * *",
                });
                assert.throws(() => new CronExp("* 0bar * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * 0bar * * *",
                });
                assert.throws(() => new CronExp("* * 1baz * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * 1baz * *",
                });
                assert.throws(() => new CronExp("* * * 1qux *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * * 1qux *",
                });
                assert.throws(() => new CronExp("* * * * 0quux"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * * * 0quux",
                });
                assert.throws(() => new CronExp("0foo 0bar 1baz 1qux 0quux"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                   " 0foo 0bar 1baz 1qux 0quux",
                });
            });

            it("should reject input under limit", function () {
                assert.throws(() => new CronExp("* * 0 * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression: * * 0 * *",
                });
                assert.throws(() => new CronExp("* * * 0 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression: * * * 0 *",
                });
                assert.throws(() => new CronExp("* * 0 0 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression: * * 0 0 *",
                });
            });

            it("should reject input over limit", function () {
                assert.throws(() => new CronExp("60 * * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                  " 60 * * * *",
                });
                assert.throws(() => new CronExp("* 60 * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                  " * 60 * * *",
                });
                assert.throws(() => new CronExp("* * 32 * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                  " * * 32 * *",
                });
                assert.throws(() => new CronExp("* * * 13 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                  " * * * 13 *",
                });
                assert.throws(() => new CronExp("* * * * 8"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression: * * * * 8",
                });
                assert.throws(() => new CronExp("60 60 32 13 8"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                               " 60 60 32 13 8",
                });
            });

            it("should reject input min to long", function () {
                assert.throws(() => new CronExp("100 * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " 100 * * * *",
                });
                assert.throws(() => new CronExp("* 100 * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * 100 * * *",
                });
                assert.throws(() => new CronExp("* * 100 * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * 100 * *",
                });
                assert.throws(() => new CronExp("* * * 100 *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * 100 *",
                });
                assert.throws(() => new CronExp("* * * * 100"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * * 100",
                });
            });

            it("should reject input max to long", function () {
                assert.throws(() => new CronExp("0-100 * * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " 0-100 * * * *",
                });
                assert.throws(() => new CronExp("* 0-100 * * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * 0-100 * * *",
                });
                assert.throws(() => new CronExp("* * 1-100 * *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * 1-100 * *",
                });
                assert.throws(() => new CronExp("* * * 1-100 *"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * * 1-100 *",
                });
                assert.throws(() => new CronExp("* * * * 0-100"), {
                    name:    "Error",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * * * 0-100",
                });
            });

            it("should reject min over max", function () {
                assert.throws(() => new CronExp("1-0 * * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " 1-0 * * * *",
                });
                assert.throws(() => new CronExp("* 3-2 * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * 3-2 * * *",
                });
                assert.throws(() => new CronExp("* * 7-4 * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * 7-4 * *",
                });
                assert.throws(() => new CronExp("* * * 12-8 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * * 12-8 *",
                });
                assert.throws(() => new CronExp("* * * * 7-0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                 " * * * * 7-0",
                });
                assert.throws(() => new CronExp("1-0 3-2 7-4 12-8 7-0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                        " 1-0 3-2 7-4 12-8 7-0",
                });
            });

            it("should reject step equal zero", function () {
                assert.throws(() => new CronExp("0-1/0 * * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                               " 0-1/0 * * * *",
                });
                assert.throws(() => new CronExp("* 2-3/0 * * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * 2-3/0 * * *",
                });
                assert.throws(() => new CronExp("* * 4-7/0 * *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * 4-7/0 * *",
                });
                assert.throws(() => new CronExp("* * * 8-12/0 *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                              " * * * 8-12/0 *",
                });
                assert.throws(() => new CronExp("* * * * 0-7/0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                               " * * * * 0-7/0",
                });
                assert.throws(() => new CronExp("0-1/0 2-3/0 4-7/0 8-12/0" +
                                                " 0-7/0"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                              " 0-1/0 2-3/0 4-7/0 8-12/0 0-7/0",
                });
            });

            it(`should support "x-y"`, function () {
                const cronex = new CronExp("0-1 2-4 6-9 11-12 1-6");
                assert.ok(cronex.test(new Date("2000-11-01T02:00")));
                assert.ok(cronex.test(new Date("2000-11-01T02:01")));
                assert.ok(cronex.test(new Date("2000-11-01T03:00")));
                assert.ok(cronex.test(new Date("2000-11-01T04:00")));
                assert.ok(cronex.test(new Date("2000-11-02T02:00")));
                assert.ok(cronex.test(new Date("2000-11-03T02:00")));
                assert.ok(cronex.test(new Date("2000-11-04T02:00")));
                assert.ok(cronex.test(new Date("2000-11-06T02:00")));
                assert.ok(cronex.test(new Date("2000-11-07T02:00")));
                assert.ok(cronex.test(new Date("2000-11-08T02:00")));
                assert.ok(cronex.test(new Date("2000-11-09T02:00")));
                assert.ok(cronex.test(new Date("2000-12-01T02:00")));
                assert.ok(cronex.test(new Date("2001-11-01T02:00")));
                assert.ok(!cronex.test(new Date("2000-10-31T23:59")));
                assert.ok(!cronex.test(new Date("2000-11-01T02:02")));
                assert.ok(!cronex.test(new Date("2000-11-01T05:00")));
                assert.ok(!cronex.test(new Date("2000-11-12T02:00")));
                assert.ok(!cronex.test(new Date("2000-12-03T02:00")));
                assert.ok(!cronex.test(new Date("2001-11-04T02:00")));
            });

            it(`should support "x-y/z"`, function () {
                const cronex = new CronExp("0-1/1 2-4/2 6-9/3 11-12/4" +
                                              " 1-6/5");
                assert.ok(cronex.test(new Date("2000-11-04T02:00")));
                assert.ok(cronex.test(new Date("2000-11-04T02:01")));
                assert.ok(cronex.test(new Date("2000-11-04T04:00")));
                assert.ok(cronex.test(new Date("2000-11-06T02:00")));
                assert.ok(cronex.test(new Date("2000-11-09T02:00")));
                assert.ok(cronex.test(new Date("2000-11-11T02:00")));
                assert.ok(cronex.test(new Date("2000-11-13T02:00")));
                assert.ok(cronex.test(new Date("2001-11-03T02:00")));
                assert.ok(!cronex.test(new Date("2000-11-04T01:59")));
                assert.ok(!cronex.test(new Date("2000-11-04T02:02")));
                assert.ok(!cronex.test(new Date("2000-11-04T03:00")));
                assert.ok(!cronex.test(new Date("2000-11-05T02:00")));
                assert.ok(!cronex.test(new Date("2000-12-04T02:00")));
                assert.ok(!cronex.test(new Date("2001-11-04T02:00")));
            });

            it(`should support "x-y/zz"`, function () {
                const cronex = new CronExp("0-59/10 0-23/11 1-31/12 1-12/11 *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-01T00:10")));
                assert.ok(cronex.test(new Date("2000-01-01T11:00")));
                assert.ok(cronex.test(new Date("2000-01-13T00:00")));
                assert.ok(cronex.test(new Date("2000-12-01T00:00")));
                assert.ok(cronex.test(new Date("2001-01-01T00:00")));
                assert.ok(!cronex.test(new Date("1999-12-01T23:59")));
                assert.ok(!cronex.test(new Date("2000-01-01T00:01")));
                assert.ok(!cronex.test(new Date("2000-01-01T10:00")));
                assert.ok(!cronex.test(new Date("2000-01-12T00:00")));
                assert.ok(!cronex.test(new Date("2000-11-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:01")));
            });

            it("should reject min date over max days in month", function () {
                assert.throws(() => new CronExp("* * 31 feb *"), {
                    name:    "RangeError",
                    message: "Syntax error, unrecognized expression:" +
                                                                " * * 31 feb *",
                });
            });
        });

        describe("test()", function () {
            it("should check minutes", function () {
                const cronex = new CronExp("0 * * * *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-01T00:01")));
            });

            it("should check hours", function () {
                const cronex = new CronExp("* 0 * * *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-01T01:00")));
            });

            it("should check month", function () {
                const cronex = new CronExp("* * * jan *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-02-01T00:00")));
            });

            it("should check date", function () {
                const cronex = new CronExp("* * 1 * *");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-02T00:00")));
            });

            it("should check day", function () {
                const cronex = new CronExp("* * * * 1");
                assert.ok(cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-04T00:00")));
            });

            it("should check sunday", function () {
                let cronex = new CronExp("* * * * 0");
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-03T00:00")));

                cronex = new CronExp("* * * * 7");
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-03T00:00")));
            });

            it("should check date and day", function () {
                const cronex = new CronExp("* * 1 * 1");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-03T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-02T00:00")));
            });

            it("should check date and sunday", function () {
                let cronex = new CronExp("* * 1 * 0");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-03T00:00")));

                cronex = new CronExp("* * 1 * 7");
                assert.ok(cronex.test(new Date("2000-01-01T00:00")));
                assert.ok(cronex.test(new Date("2000-01-02T00:00")));
                assert.ok(!cronex.test(new Date("2001-01-03T00:00")));
            });
        });

        describe("next()", function () {
            it("should ignore minutes", function () {
                const cronex = new CronExp("2 * * * *");
                const next = cronex.next(new Date("2000-01-01T00:01"));
                assert.deepStrictEqual(next, new Date("2000-01-01T00:02"));
            });

            it("should get next minutes", function () {
                const cronex = new CronExp("2 * * * *");
                const next = cronex.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-01T00:02"));
            });

            it("should get next minutes with change hours", function () {
                const cronex = new CronExp("2 * * * *");
                const next = cronex.next(new Date("2000-01-01T00:03"));
                assert.deepStrictEqual(next, new Date("2000-01-01T01:02"));
            });

            it("should ignore hours", function () {
                const cronex = new CronExp("* 2 * * *");
                const next = cronex.next(new Date("2000-01-01T02:00"));
                assert.deepStrictEqual(next, new Date("2000-01-01T02:01"));
            });

            it("should get next hours", function () {
                const cronex = new CronExp("* 2 * * *");
                const next = cronex.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-01T02:00"));
            });

            it("should get next hours with change date", function () {
                const cronex = new CronExp("* 2 * * *");
                const next = cronex.next(new Date("2000-01-01T03:00"));
                assert.deepStrictEqual(next, new Date("2000-01-02T02:00"));
            });

            it("should ignore date", function () {
                const cronex = new CronExp("* * 3 * *");
                const next = cronex.next(new Date("2000-01-03T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-03T00:01"));
            });

            it("should get next date", function () {
                const cronex = new CronExp("* * 3 * *");
                const next = cronex.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-03T00:00"));
            });

            it("should get next date (which is the last date of the month)",
                                                                   function () {
                const cronex = new CronExp("* * 31 * *");
                const next = cronex.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-31T00:00"));
            });

            it("should get next date with change month", function () {
                let cronex = new CronExp("* * 3 * *");
                let next = cronex.next(new Date("2000-01-04T00:00"));
                assert.deepStrictEqual(next, new Date("2000-02-03T00:00"));

                cronex = new CronExp("* * 30 * *");
                next = cronex.next(new Date("2000-02-29T00:00"));
                assert.deepStrictEqual(next, new Date("2000-03-30T00:00"));
            });

            it("should ignore day", function () {
                const cronex = new CronExp("* * * * 2");
                const next = cronex.next(new Date("2000-01-04T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-04T00:01"));
            });

            it("should get next day", function () {
                const cronex = new CronExp("* * * * 2");
                const next = cronex.next(new Date("2000-01-02T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-04T00:00"));
            });

            it("should get next day (without being the first day)",
                                                                   function () {
                const cronex = new CronExp("* * * * 1,3");
                const next = cronex.next(new Date("2000-01-04T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-05T00:00"));
            });

            it("should get next day with change week", function () {
                const cronex = new CronExp("* * * * 2");
                const next = cronex.next(new Date("2000-01-05T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-11T00:00"));
            });

            it("should ignore date and day", function () {
                const cronex = new CronExp("* * 3 * 2");
                const next = cronex.next(new Date("2000-10-03T00:00"));
                assert.deepStrictEqual(next, new Date("2000-10-03T00:01"));
            });

            it("should get next date (with day restricted)", function () {
                const cronex = new CronExp("* * 3 * 2");
                const next = cronex.next(new Date("2000-01-02T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-03T00:00"));
            });

            it("should get next day (with date restricted)", function () {
                const cronex = new CronExp("* * 3 * 2");
                const next = cronex.next(new Date("2000-01-10T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-11T00:00"));
            });

            it("should ignore month", function () {
                const cronex = new CronExp("* * * 3 *");
                const next = cronex.next(new Date("2000-03-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-03-01T00:01"));
            });

            it("should get next month", function () {
                const cronex = new CronExp("* * * 3 *");
                const next = cronex.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-03-01T00:00"));
            });

            it("should get next month with change year", function () {
                const cronex = new CronExp("* * * 3 *");
                const next = cronex.next(new Date("2000-04-01T00:00"));
                assert.deepStrictEqual(next, new Date("2001-03-01T00:00"));
            });
        });
    });
});
