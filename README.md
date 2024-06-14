# xcode-collada

`xcode-collada` is a commandline tool to prepare COLLADA files (.dae) so that Xcode
can happily load them. The tool will report the issues it is resolving, for those
curious as to issues you may face.

# Usage

## Install

```bash
yarn install
```

## Run

```bash
ts-node src/index.ts sourceFile.dae outputFile.dae
```

## Build

```bash
yarn build
node dist/index.js
```

# Development Notes

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
