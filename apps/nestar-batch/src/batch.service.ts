import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {

  getHello(): string {
    return 'Welcome to Nestar BATCH Server!';
  }

  public async batchRolBack(): Promise<void> {
    console.log('batchRolBack');
  }

  public async batchProperties(): Promise<void> {
    console.log('batchProperties');
  }

  public async batchAgents(): Promise<void> {
    console.log('batchAgents');
  }


}
