import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService) { }
  private logger: Logger = new Logger('BatchController');

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('BATCH SERVER READY');
  }

  @Cron('00 * * * * *', { name: BATCH_ROLLBACK })
  public async batchRolBack() {
    try {
      this.logger['context'] = BATCH_ROLLBACK;
      this.logger.debug('EXECUTED');
      await this.batchService.batchRolBack();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES })
  public async batchProperties() {
    try {
      this.logger['context'] = BATCH_TOP_PROPERTIES;
      this.logger.debug('EXECUTED');
      await this.batchService.batchProperties();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('40 * * * * *', { name: BATCH_TOP_AGENTS })
  public async batchAgents() {
    try {
      this.logger['context'] = BATCH_TOP_AGENTS;
      this.logger.debug('EXECUTED');
      await this.batchService.batchAgents();
    } catch (err) {
      this.logger.error(err);
    }
  }

  // @Interval(1000)
  // handleInterval() {
  //this.logger.debug('INTERVAL TEST');
  //}

  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }

}
