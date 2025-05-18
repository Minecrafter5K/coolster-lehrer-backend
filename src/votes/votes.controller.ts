import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Request, Response } from 'express';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // @Post()
  // create(@Body() createVoteDto: CreateVoteDto) {
  //   return this.votesService.create(createVoteDto);
  // }

  @Post('bulk')
  async bulkCreate(
    @Body() createVoteDto: CreateVoteDto[],
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // parse cookie
    const raw = req.cookies['voted'] as string | undefined;
    let votedCookie: number[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as number[];
        if (Array.isArray(parsed)) {
          votedCookie = parsed.map((n) => Number(n)).filter((n) => !isNaN(n));
        }
      } catch {
        // ignore invalid cookie
      }
    }

    // mutate
    const result = await this.votesService.bulkCreate(
      createVoteDto,
      votedCookie,
    );

    // set cookie
    res.cookie('voted', JSON.stringify(result.newVoted), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
    });

    return { affectedRows: result.affectedRows };
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

  @Get('abstimmungen/detail')
  abstimmungenDetail() {
    return this.votesService.getAbstimmungenDetail();
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.votesService.remove(+id);
  // }
}
