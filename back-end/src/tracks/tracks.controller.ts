import { Body, Controller, Post, Get, Render } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async createMany(@Body() createTrackDtos: CreateTrackDto[]) {
    return this.tracksService.createMany(createTrackDtos);
  }  

  @Get()
  @Render('tracks')
  async findAll() {
    const tracks = await this.tracksService.findAll();
    return {tracks};
  }
}
