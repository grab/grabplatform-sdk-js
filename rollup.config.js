import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'GrabID',
      file: pkg.main,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      typescript(),
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs()
    ]
  }
]
