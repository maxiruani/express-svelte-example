'use strict';

import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import multiInput from 'rollup-plugin-multi-input';
import expressSvelte from 'rollup-plugin-express-svelte';

const env = process.env.NODE_ENV;
const dev = env === 'development';
const legacy = process.env.LEGACY_BUILD != null;

export default {
    input: ['views/**/*.svelte'],
    output: {
        sourcemap: true,
        format: 'iife',
        dir: 'public/dist',
        chunkFileNames: dev ? '[name].js' : '[name]-[hash].js',
        assetFileNames: dev ? '[name][extname]' : '[name]-[hash][extname]'
    },
    plugins: [
        multiInput({ relative: 'views/' }),
        expressSvelte({ hydratable: 'complete' }),

        replace({
            'process.browser': true,
            'process.env.NODE_ENV': JSON.stringify(env)
        }),

        svelte({
            dev,
            hydratable: true,
            emitCss: false,
            css: css => {
                css.write(css.filename, true);
            }
        }),

        nodeResolve({
            browser: true,
            dedupe: [
                'svelte',
                'svelte/animate',
                'svelte/easing',
                'svelte/internal',
                'svelte/motion',
                'svelte/store',
                'svelte/transition'
            ]
        }),

        commonjs(),

        legacy === true && babel({
            extensions: ['.js', '.mjs', '.html', '.svelte'],
            runtimeHelpers: 'runtime',
            exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: '> 0.25%, not dead',
                        useBuiltIns: 'usage',
                        corejs: 3
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                [
                    '@babel/plugin-transform-runtime',
                    {
                        useESModules: true
                    }
                ]
            ]
        }),

        dev === false && terser()
    ],

    preserveEntrySignatures: false
};