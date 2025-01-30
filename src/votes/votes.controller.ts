import { Controller, Get, Post, Body } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Post('bulk')
  bulkCreate(@Body() createVoteDto: CreateVoteDto[]) {
    return this.votesService.bulkCreate(createVoteDto);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.votesService.remove(+id);
  // }
}
