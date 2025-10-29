import readline from 'readline'
import fs from 'fs'
import path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Enter the name of the package: ', (packageName) => {
  const packagePath = path.join(__dirname, '..', '..', 'packages', packageName)

  if (fs.existsSync(packagePath)) {
    console.error(`Package "${packageName}" already exists.`)
    rl.close()
    return
  }

  fs.mkdirSync(packagePath, { recursive: true })

  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJsonContent = {
    name: `@story-brew/${packageName}`,
    version: '0.0.0',
    private: true,
    scripts: {
      build: 'tsup src/index.ts --format cjs --dts',
      dev: 'tsup src/index.ts --format cjs --dts --watch',
    },
    devDependencies: {
      '@types/node': '^20.12.12',
      tsup: '^8.0.2',
      typescript: '^5.4.5',
    },
    dependencies: {},
    main: './dist/index.js',
    types: './dist/index.d.ts',
    files: ['dist/**'],
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2))

  const tsconfigJsonPath = path.join(packagePath, 'tsconfig.json')
  const tsconfigJsonContent = {
    extends: '../../tsconfig.base.json',
    include: ['src'],
  }

  fs.writeFileSync(tsconfigJsonPath, JSON.stringify(tsconfigJsonContent, null, 2))

  const srcPath = path.join(packagePath, 'src')
  fs.mkdirSync(srcPath, { recursive: true })

  const indexPath = path.join(srcPath, 'index.ts')
  fs.writeFileSync(indexPath, '')

  console.log(`Package "${packageName}" created successfully.`)
  rl.close()
})
