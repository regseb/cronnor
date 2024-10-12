/**
 * @license MIT
 * @author Sébastien Règne
 */

// @ts-ignore https://github.com/prettier/plugin-xml/issues/671
import pluginXML from "@prettier/plugin-xml";

/**
 * @import { Config } from "prettier"
 */

/**
 * @type {Config}
 */
export default {
    plugins: [pluginXML],

    // Options spécifiques du plugin XML.
    xmlQuoteAttributes: "double",
};
