import { rollup } from "rollup";

const bundle = await rollup({ input: "src/cron.js" });
await bundle.write({ file: "index.js" });
await bundle.close();
