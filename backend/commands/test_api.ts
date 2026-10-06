import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestApi extends BaseCommand {
  static commandName = 'test:api'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "TestApi"')
  }
}