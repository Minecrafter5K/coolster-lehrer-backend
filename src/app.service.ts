import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getMockLeaderboard() {
    return [
      { name: 'lehrer 1', score: 81.7 },
      { name: 'lehrer 2', score: 67.3 },
    ];
  }
}
