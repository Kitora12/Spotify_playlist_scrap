import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TracksService {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      const newTrack = new this.trackModel(createTrackDto);
      return newTrack.save();
    } catch (error) {
      throw new BadRequestException('Invalid track data', error.message);
    }
  }

  async createMany(createTrackDtos: CreateTrackDto[]): Promise<Track[]> {
    try {
      const createdTracks = await this.trackModel.insertMany(createTrackDtos);
      return createdTracks as unknown as Track[];
    } catch (error) {
      throw new BadRequestException('Failed to insert tracks', error.message);
    }
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel.find().exec();
  }
}
