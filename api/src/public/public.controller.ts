import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  CreateContactDto,
  CreateDonationIntentDto,
  CreateFosterDto,
  CreateVolunteerDto,
  PadrinhoLookupDto,
} from './dto/public.dto';
import { PublicService } from './public.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('site')
  getSite() {
    return this.publicService.getSite();
  }

  @Get('home')
  getHome() {
    return this.publicService.getHome();
  }

  @Get('pages/:slug')
  getPage(@Param('slug') slug: string) {
    return this.publicService.getPage(slug);
  }

  @Get('services')
  listServices() {
    return this.publicService.listServices();
  }

  @Get('services/:slug')
  getService(@Param('slug') slug: string) {
    return this.publicService.getService(slug);
  }

  @Get('partners')
  listPartners() {
    return this.publicService.listPartners();
  }

  @Get('stats')
  listStats() {
    return this.publicService.listStats();
  }

  @Get('videos')
  listVideos() {
    return this.publicService.listVideos();
  }

  @Get('team')
  listTeam() {
    return this.publicService.listTeam();
  }

  @Get('transparency/years')
  transparencyYears() {
    return this.publicService.transparencyYears();
  }

  @Get('transparency/documents')
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  transparencyDocuments(
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.publicService.transparencyDocuments({
      year: year ? Number(year) : undefined,
      type,
      q,
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 20,
    });
  }

  @Get('transparency/dashboard')
  transparencyDashboard() {
    return this.publicService.transparencyDashboard();
  }

  @Get('donations/config')
  donationsConfig() {
    return this.publicService.donationsConfig();
  }

  @Post('donations/intent')
  createDonationIntent(@Body() dto: CreateDonationIntentDto) {
    return this.publicService.createDonationIntent(dto);
  }

  @Get('donations/:id/status')
  donationStatus(@Param('id') id: string) {
    return this.publicService.donationStatus(id);
  }

  @Post('contact')
  createContact(@Body() dto: CreateContactDto, @Req() req: Request) {
    return this.publicService.createContact(dto, req.ip);
  }

  @Post('volunteers')
  createVolunteer(@Body() dto: CreateVolunteerDto) {
    return this.publicService.createVolunteer(dto);
  }

  @Post('foster-families')
  createFoster(@Body() dto: CreateFosterDto) {
    return this.publicService.createFosterFamily(dto);
  }

  @Get('testimonials')
  listTestimonials() {
    return this.publicService.listTestimonials();
  }

  @Get('posts')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'q', required: false })
  listPosts(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('q') q?: string,
  ) {
    return this.publicService.listPosts({
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 12,
      q,
    });
  }

  @Get('posts/:slug')
  getPost(@Param('slug') slug: string) {
    return this.publicService.getPost(slug);
  }

  @Post('padrinho/lookup')
  padrinhoLookup(@Body() dto: PadrinhoLookupDto) {
    return this.publicService.padrinhoLookup(dto.email);
  }
}
