import fs from 'node:fs/promises';
import path from 'node:path';
import util from  "node:util";
import { exec as nodeExec } from "node:child_process";
import { rollup } from 'rollup';

const exec = util.promisify(nodeExec),
    pkg = JSON.parse(await fs.readFile("./package.json", "utf8")),
    inputOptions = {
        input: "./src/ecollar.js"
    };

async function getOutputRollupOptions({
    esm = false,
    factory = false
} = {}) {
    const wrapperFileName = `wrapper${factory ? '-factory' : ''}${esm ? '-esm' : ''}.js`,
        wrapperSource = await read(wrapperFileName),
        // Catch `// @CODE` and subsequent comment lines event if they don't start
        // in the first column.
        wrapper = wrapperSource.split(
            /[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/
        );

    return {
        // The ESM format is not actually used as we strip it during the
        // build, inserting our own wrappers; it's just that it doesn't
        // generate any extra wrappers so there's nothing for us to remove.
        format: 'esm',
        intro: wrapper[0].replace(/\n*$/, ''),
        outro: wrapper[1].replace(/^\n*/, '')
    };
}

async function read(filename) {
    return fs.readFile(path.join('./src', filename), 'utf8');
}

async function getLastModifiedDate() {
    const { stdout } = await exec('git log -1 --format="%at"');
    return new Date(parseInt(stdout, 10) * 1000);
}

async function build({
    dir = 'dist',
    filename = "ecollar.js",
    esm = false,
    factory = false,
} = {}) {
    let bundle = null,
        buildFailed = false;
    try {
        bundle = await rollup(inputOptions);
        const outputOptions = await getOutputRollupOptions({ esm, factory });
        const {
            output: [{ code }]
        } = await bundle.generate(outputOptions);
        await fs.mkdir(dir, { recursive: true });
        await writeCompiled({ code, dir, filename, version: pkg.version });
    } catch (error) {
        buildFailed = true;
        console.error(error);
    }
    if (bundle) {
        await bundle.close();
    }
    process.exit(buildFailed ? 1 : 0);
}

async function writeCompiled({ code, dir, filename, version }) {
    const date = process.env.RELEASE_DATE
        ? new Date(process.env.RELEASE_DATE)
        : await getLastModifiedDate(),
        compiledContents = code
            .replace(/@VERSION/g, version)
            .replace(/@DATE/g, date.toISOString().replace(/:\d+\.\d+Z$/, 'Z'));

    await fs.writeFile(path.join(dir, filename), compiledContents);
    console.log(`${filename} v${version} created.`);
}

await build();
