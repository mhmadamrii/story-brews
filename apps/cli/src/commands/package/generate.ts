import prompts from 'prompts'
import fs from 'fs'
import path from 'path'

import { Command } from '@oclif/core'
export default class PackageGenerate extends Command {
  static override description = 'Generate a new package inside the monorepo (packages/<name>)'

  async run(): Promise<void> {
    this.log('🧩 Story Brews Package Generator\n')

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of the new package?',
        validate: (value: string) => value.trim() !== '' || 'Package name is required',
      },
      {
        type: 'text',
        name: 'description',
        message: 'Short description:',
      },
    ])

    const pkgName = response.name.trim()
    const pkgDir = path.resolve(process.cwd(), '../../packages', pkgName)

    if (fs.existsSync(pkgDir)) {
      this.error(`❌ Package "${pkgName}" already exists at ${pkgDir}`)
      return
    }

    // Create directories
    fs.mkdirSync(path.join(pkgDir, 'src'), { recursive: true })

    // Create package.json
    const pkgJson = {
      name: `@story-brew/${pkgName}`,
      version: '0.1.0',
      description: response.description || '',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc -p tsconfig.json',
      },
    }

    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8')

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'CommonJS',
        declaration: true,
        outDir: 'dist',
        rootDir: 'src',
        strict: true,
        esModuleInterop: true,
      },
      include: ['src'],
    }

    fs.writeFileSync(path.join(pkgDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2), 'utf8')

    // Create basic source file
    const safeExport = pkgName.replace(/[^a-zA-Z0-9_]/g, '_')
    fs.writeFileSync(
      path.join(pkgDir, 'src', 'index.ts'),
      `export const ${safeExport} = () => {
  console.log('Hello from ${pkgName}!');
}\n`,
      'utf8'
    )

    this.log(`✅ Package "${pkgName}" created successfully!`)
    this.log(`📁 Location: packages/${pkgName}`)
  }
}
