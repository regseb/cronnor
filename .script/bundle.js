import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";

(async function main() {
    const bundle = await rollup({
        input: "./src/cron.js",
    });
    await bundle.write({ file: "./dist/cron.js" });
    await bundle.write({
        file:      "./dist/cron.min.js",
        plugins:   [terser()],
        compact:   true,
        sourcemap: true,
        validate:  true,
    });
    await bundle.close();
}());
