import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get('rank/:id')
  rank(@Param('id') id: number) {
    return this.votesService.rank(id);
  }

  @Get('currentAbstimmung')
  currentAbstimmung() {
    return this.votesService.currentAbstimmung();
  }

  @Get('abstimmungen')
  abstimmungen() {
    return this.votesService.abstimmungen();
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.votesService.remove(+id);
  // }
}
