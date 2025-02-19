import csso from 'postcss-csso';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import {LogLevel, RollupOptions} from 'rollup';
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.NODE_ENV === 'production';
const folder = isProduction ? 'prod' : 'dev';

const cssEntry = (input: string, output: string) => ({
    input,
    logLevel: 'warn' as LogLevel,
    plugins: [
        postcss({
            extract: true,
            sourceMap: !isProduction,
            plugins: [
                postcssImport({
                    plugins: [
                        postcssNested(),
                        csso({comments: false, restructure: false}),
                    ],
                }),
            ],
        }),
    ],
    output: [
        {
            file: output,
            sourcemap: !isProduction,
            strict: true,
        },
    ],
});

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    cssEntry('./src/nova/main.css', `../../../dist/${folder}/themes/nova.css`),
    cssEntry('./src/luna/main.css', `../../../dist/${folder}/themes/luna.css`),
    cssEntry('./src/dev/main.css', `../../../dist/${folder}/themes/dev.css`),
    cssEntry('./src/blank/main.css', `../../../dist/${folder}/themes/blank.css`),
]);

export default packageConfig;
