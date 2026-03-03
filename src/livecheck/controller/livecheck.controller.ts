import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'livecheck',
})
@ApiTags('Livecheck')
export class LiveCheckController {
  @Get()
  @ApiOperation({ summary: 'Livecheck endpoint' })
  async livecheck() {
    return 'up!';
  }
}
