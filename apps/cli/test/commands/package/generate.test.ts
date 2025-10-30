import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('package:generate', () => {
  it('runs package:generate cmd', async () => {
    const {stdout} = await runCommand('package:generate')
    expect(stdout).to.contain('hello world')
  })

  it('runs package:generate --name oclif', async () => {
    const {stdout} = await runCommand('package:generate --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
