import assert    from "assert";
import { Field } from "../src/field.js";

describe("field.js", function () {
    describe("Field", function () {
        describe("of()", function () {
            it("should create field with one value", function () {
                const field = Field.of(1);
                assert.deepStrictEqual(field.values(), [1]);
                assert.ok(field.restricted);
            });
        });

        describe("all()", function () {
            it("should create field with all values", function () {
                const field = Field.all(0, 6);
                assert.deepStrictEqual(field.values(), [0, 1, 2, 3, 4, 5, 6]);
                assert.ok(!field.restricted);
            });
        });

        describe("range()", function () {
            it("should create field with interval", function () {
                let field = Field.range(0, 3, 1);
                assert.deepStrictEqual(field.values(), [0, 1, 2, 3]);
                assert.ok(field.restricted);

                field = Field.range(0, 10, 2);
                assert.deepStrictEqual(field.values(), [0, 2, 4, 6, 8, 10]);
                assert.ok(field.restricted);

                field = Field.range(0, 5, 3);
                assert.deepStrictEqual(field.values(), [0, 3]);
                assert.ok(field.restricted);

                field = Field.range(0, 2, 4);
                assert.deepStrictEqual(field.values(), [0]);
                assert.ok(field.restricted);
            });
        });

        describe("flat()", function () {
            it("should flat fields", function () {
                const field = Field.flat([Field.of(0),
                                          Field.range(0, 2, 1),
                                          Field.of(4)]);
                assert.deepStrictEqual(field.values(), [0, 1, 2, 4]);
                assert.ok(field.restricted);
            });
        });

        describe("constructor()", function () {
            it("should accept one value", function () {
                const field = new Field([0]);
                assert.deepStrictEqual(field.values(), [0]);
                assert.ok(field.restricted);
            });

            it("should sort values", function () {
                const field = new Field([11, 2, 3333, 444]);
                assert.deepStrictEqual(field.values(), [2, 11, 444, 3333]);
                assert.ok(field.restricted);
            });

            it("should remove duplicate values", function () {
                const field = new Field([0, 1, 1, 2, 2, 2, 0]);
                assert.deepStrictEqual(field.values(), [0, 1, 2]);
                assert.ok(field.restricted);
            });

            it("should accepte unrestricted", function () {
                const field = new Field([1, 2, 3], false);
                assert.deepStrictEqual(field.values(), [1, 2, 3]);
                assert.ok(!field.restricted);
            });
        });

        describe("get min()", function () {
            it("should return min", function () {
                const field = new Field([2, 3, 5]);
                assert.deepStrictEqual(field.min, 2);
            });
        });

        describe("get max()", function () {
            it("should return max", function () {
                const field = new Field([1, 1, 2, 3]);
                assert.deepStrictEqual(field.max, 3);
            });
        });

        describe("values()", function () {
            it("should return values", function () {
                const field = new Field([57, 58, 59]);
                assert.deepStrictEqual(field.values(), [57, 58, 59]);
            });
        });

        describe("map()", function () {
            it("should apply function to values", function () {
                const field1 = new Field([10, 11, 12]);
                const field2 = field1.map((v) => v - 1);
                assert.deepStrictEqual(field1.values(), [10, 11, 12]);
                assert.ok(field1.restricted);
                assert.deepStrictEqual(field2.values(), [9, 10, 11]);
                assert.ok(field2.restricted);
            });

            it("should transmit restricted property", function () {
                const field1 = new Field([1, 2, 3], false);
                const field2 = field1.map((v) => v * 2);
                assert.deepStrictEqual(field1.values(), [1, 2, 3]);
                assert.ok(!field1.restricted);
                assert.deepStrictEqual(field2.values(), [2, 4, 6]);
                assert.ok(!field2.restricted);
            });
        });

        describe("test()", function () {
            it("should test if value is present", function () {
                const field = new Field([21, 22, 23]);
                assert.ok(!field.test(20));
                assert.ok(field.test(21));
                assert.ok(field.test(22));
                assert.ok(field.test(23));
                assert.ok(!field.test(24));
            });
        });

        describe("next()", function () {
            it("should calculate next value", function () {
                const field = new Field([11, 22, 33, 44]);
                assert.strictEqual(field.next(10), 11);
                assert.strictEqual(field.next(22), 33);
                assert.strictEqual(field.next(34), 44);
            });

            it("should return 'undefined'", function () {
                const field = new Field([3, 6, 9]);
                assert.strictEqual(field.next(9), undefined);
                assert.strictEqual(field.next(10), undefined);
            });
        });
    });
});
