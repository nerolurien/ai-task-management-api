import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestAxios extends BaseCommand {
  static commandName = 'test:axios'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "TestAxios"')
  }
}