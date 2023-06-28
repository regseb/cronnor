/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import Field from "../src/field.js";

describe("field.js", function () {
    describe("Field", function () {
        describe("range()", function () {
            it("should create field with interval", function () {
                let field = Field.range(0, 3, 1, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.values(), [0, 1, 2, 3]);
                assert.equal(field.restricted, true);

                field = Field.range(0, 10, 2, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.values(), [0, 2, 4, 6, 8, 10]);
                assert.equal(field.restricted, true);

                field = Field.range(0, 5, 3, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.values(), [0, 3]);
                assert.equal(field.restricted, true);

                field = Field.range(0, 2, 4, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.values(), [0]);
                assert.equal(field.restricted, true);
            });

            it("should create field with all values", function () {
                const field = Field.range(0, 7, 1, {
                    restricted: false,
                    random: false,
                });
                assert.deepEqual(field.values(), [0, 1, 2, 3, 4, 5, 6, 7]);
                assert.equal(field.restricted, false);
            });

            it("should support MAX_SAFE_INTEGER for step", function () {
                const field = Field.range(1, 12, Number.MAX_SAFE_INTEGER, {
                    restricted: false,
                    random: false,
                });
                assert.deepEqual(field.values(), [1]);
                assert.equal(field.restricted, false);
            });

            it("should create field with random value", function () {
                const stub = sinon.stub(Math, "random").returns(0);

                const field = Field.range(1, 4, 2, {
                    restricted: true,
                    random: true,
                });
                assert.equal(field.values().length, 2);
                assert.deepEqual(field.values(), [1, 3]);
                assert.equal(field.restricted, true);

                stub.restore();
            });
        });

        describe("flat()", function () {
            it("should flat fields", function () {
                const field = Field.flat([
                    Field.range(1, 1, 1, { restricted: true, random: false }),
                    Field.range(2, 2, 1, { restricted: true, random: false }),
                    Field.range(0, 4, 2, { restricted: true, random: false }),
                ]);
                assert.deepEqual(field.values(), [0, 1, 2, 4]);
                assert.equal(field.restricted, true);
            });
        });

        describe("get min()", function () {
            it("should return min", function () {
                const field = Field.range(2, 5, 1, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.min, 2);
            });
        });

        describe("get max()", function () {
            it("should return max", function () {
                const field = Field.range(1, 3, 1, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.max, 3);
            });
        });

        describe("values()", function () {
            it("should return values", function () {
                const field = Field.range(53, 59, 3, {
                    restricted: true,
                    random: false,
                });
                assert.deepEqual(field.values(), [53, 56, 59]);
            });
        });

        describe("map()", function () {
            it("should apply function to values", function () {
                const field1 = Field.range(10, 12, 1, {
                    restricted: true,
                    random: false,
                });
                const field2 = field1.map((v) => v - 1);
                assert.deepEqual(field1.values(), [10, 11, 12]);
                assert.equal(field1.restricted, true);
                assert.deepEqual(field2.values(), [9, 10, 11]);
                assert.equal(field2.restricted, true);
            });

            it("should transmit restricted property", function () {
                const field1 = Field.range(1, 3, 1, {
                    restricted: false,
                    random: false,
                });
                const field2 = field1.map((v) => v * 2);
                assert.deepEqual(field1.values(), [1, 2, 3]);
                assert.equal(field1.restricted, false);
                assert.deepEqual(field2.values(), [2, 4, 6]);
                assert.equal(field2.restricted, false);
            });
        });

        describe("test()", function () {
            it("should test if value is present", function () {
                const field = Field.range(21, 23, 1, {
                    restricted: true,
                    random: false,
                });
                assert.ok(!field.test(20));
                assert.ok(field.test(21));
                assert.ok(field.test(22));
                assert.ok(field.test(23));
                assert.ok(!field.test(24));
            });
        });

        describe("next()", function () {
            it("should calculate next value", function () {
                const field = Field.range(11, 44, 11, {
                    restricted: true,
                    random: false,
                });
                assert.equal(field.next(10), 11);
                assert.equal(field.next(22), 33);
                assert.equal(field.next(34), 44);
            });

            it("should return 'undefined'", function () {
                const field = Field.range(3, 9, 3, {
                    restricted: true,
                    random: false,
                });
                assert.equal(field.next(9), undefined);
                assert.equal(field.next(10), undefined);
            });
        });
    });
});
