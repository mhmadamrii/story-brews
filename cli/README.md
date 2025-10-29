# CLI

This package contains a CLI tool for scaffolding new packages within the `packages` directory.

## Usage

To create a new package, run the following command from the root of the repository:

```bash
pnpm run package
```

This will prompt you for the name of the package. Once you enter the name, it will create a new directory in the `packages` folder with the following structure:

```
packages/
└── <package-name>/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```
