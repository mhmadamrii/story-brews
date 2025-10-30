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

I want to create an application that can generates a full story based on blocked ideas or a piece of text that created daily or section by section. so the base idea is it will help people for those who are not expert in creating stories and hard to explain something. so there will be an input field that create the story section idea and then after user creating 5 or more ideas the is a button to create a story, help me to create commponent using react typescript and shadcnui, the generator comes from groq ai and we will setup later on
