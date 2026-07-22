import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../auth/guards/permissions.guard';
import { AdminService } from './admin.service';

class UpdatePageDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() bodyMd?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsBoolean() published?: boolean;
}

class UpdateServiceDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() aboutDescription?: string;
  @IsOptional() @IsString() fullDescription?: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsInt() capacity?: number;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

class PartnerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

class CreatePartnerDto {
  @IsString() name!: string;
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

class UpdateStatDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsNumber() value?: number;
  @IsOptional() @IsString() display?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() notes?: string;
}

class VideoDto {
  @IsOptional() @IsString() youtubeId?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

class CreateVideoDto {
  @IsString() youtubeId!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

class TeamDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() roleTitle?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

class CreateTeamDto {
  @IsString() name!: string;
  @IsString() roleTitle!: string;
  @IsOptional() @IsString() bio?: string;
}

class UpdateDocDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsInt() @Min(1990) year?: number;
  @IsOptional() @IsString() organ?: string;
  @IsOptional() @IsString() contractCode?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

class StatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}

class DonationStatusDto {
  @IsString()
  status!: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED';
}

class SettingDto {
  @IsString() key!: string;
  value!: unknown;
  @IsOptional() @IsBoolean() isPublic?: boolean;
}

class HandledDto {
  @IsBoolean() handled!: boolean;
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // Dashboard
  @Get('dashboard')
  @RequirePermissions('dashboard:read')
  dashboard() {
    return this.admin.dashboard();
  }

  // Settings
  @Get('settings')
  @RequirePermissions('settings:read')
  settings() {
    return this.admin.getSettings();
  }

  @Post('settings')
  @RequirePermissions('settings:write')
  saveSetting(@Body() dto: SettingDto) {
    return this.admin.upsertSetting(dto.key, dto.value, dto.isPublic);
  }

  // Pages
  @Get('pages')
  @RequirePermissions('content:read')
  pages() {
    return this.admin.listPages();
  }

  @Post('pages')
  @RequirePermissions('content:write')
  createPage(
    @Body()
    dto: {
      title: string;
      bodyMd: string;
      excerpt?: string;
      slug?: string;
      published?: boolean;
    },
  ) {
    return this.admin.createPage(dto);
  }

  @Patch('pages/:id')
  @RequirePermissions('content:write')
  updatePage(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.admin.updatePage(id, dto);
  }

  @Delete('pages/:id')
  @RequirePermissions('content:write')
  deletePage(@Param('id') id: string) {
    return this.admin.deletePage(id);
  }

  // Services
  @Get('services')
  @RequirePermissions('content:read')
  services() {
    return this.admin.listServices();
  }

  @Post('services')
  @RequirePermissions('content:write')
  createService(
    @Body()
    dto: {
      name: string;
      shortDescription: string;
      aboutDescription?: string;
      fullDescription?: string;
      tagline?: string;
      capacity?: number;
      isPublished?: boolean;
      slug?: string;
    },
  ) {
    return this.admin.createService(dto);
  }

  @Patch('services/:id')
  @RequirePermissions('content:write')
  updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.admin.updateService(id, dto);
  }

  @Delete('services/:id')
  @RequirePermissions('content:write')
  deleteService(@Param('id') id: string) {
    return this.admin.deleteService(id);
  }

  // Partners
  @Get('partners')
  @RequirePermissions('content:read')
  partners() {
    return this.admin.listPartners();
  }

  @Post('partners')
  @RequirePermissions('content:write')
  createPartner(@Body() dto: CreatePartnerDto) {
    return this.admin.createPartner(dto);
  }

  @Patch('partners/:id')
  @RequirePermissions('content:write')
  updatePartner(@Param('id') id: string, @Body() dto: PartnerDto) {
    return this.admin.updatePartner(id, dto);
  }

  @Delete('partners/:id')
  @RequirePermissions('content:write')
  deletePartner(@Param('id') id: string) {
    return this.admin.deletePartner(id);
  }

  // Stats
  @Get('stats')
  @RequirePermissions('content:read')
  stats() {
    return this.admin.listStats();
  }

  @Post('stats')
  @RequirePermissions('content:write')
  createStat(
    @Body()
    dto: {
      label: string;
      value?: number;
      display?: string;
      isPublished?: boolean;
    },
  ) {
    return this.admin.createStat(dto);
  }

  @Patch('stats/:id')
  @RequirePermissions('content:write')
  updateStat(@Param('id') id: string, @Body() dto: UpdateStatDto) {
    return this.admin.updateStat(id, dto);
  }

  @Delete('stats/:id')
  @RequirePermissions('content:write')
  deleteStat(@Param('id') id: string) {
    return this.admin.deleteStat(id);
  }

  // Videos
  @Get('videos')
  @RequirePermissions('content:read')
  videos() {
    return this.admin.listVideos();
  }

  @Post('videos')
  @RequirePermissions('content:write')
  createVideo(@Body() dto: CreateVideoDto) {
    return this.admin.createVideo(dto);
  }

  @Patch('videos/:id')
  @RequirePermissions('content:write')
  updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return this.admin.updateVideo(id, dto);
  }

  @Delete('videos/:id')
  @RequirePermissions('content:write')
  deleteVideo(@Param('id') id: string) {
    return this.admin.deleteVideo(id);
  }

  // Team
  @Get('team')
  @RequirePermissions('content:read')
  team() {
    return this.admin.listTeam();
  }

  @Post('team')
  @RequirePermissions('content:write')
  createTeam(@Body() dto: CreateTeamDto) {
    return this.admin.createTeamMember(dto);
  }

  @Patch('team/:id')
  @RequirePermissions('content:write')
  updateTeam(@Param('id') id: string, @Body() dto: TeamDto) {
    return this.admin.updateTeamMember(id, dto);
  }

  @Delete('team/:id')
  @RequirePermissions('content:write')
  deleteTeam(@Param('id') id: string) {
    return this.admin.deleteTeamMember(id);
  }

  // Transparency
  @Get('transparency/years')
  @RequirePermissions('transparency:read')
  transparencyYears() {
    return this.admin.listTransparencyYears();
  }

  @Get('transparency/documents')
  @RequirePermissions('transparency:read')
  transparencyDocs(
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
  ) {
    return this.admin.listTransparencyDocs({
      year: year ? Number(year) : undefined,
      type,
      q,
    });
  }

  @Patch('transparency/documents/:id')
  @RequirePermissions('transparency:write')
  updateDoc(@Param('id') id: string, @Body() dto: UpdateDocDto) {
    return this.admin.updateTransparencyDoc(id, dto);
  }

  @Delete('transparency/documents/:id')
  @RequirePermissions('transparency:write')
  deleteDoc(@Param('id') id: string) {
    return this.admin.deleteTransparencyDoc(id);
  }

  @Post('transparency/documents/upload')
  @RequirePermissions('transparency:write')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        year: { type: 'number' },
        type: { type: 'string' },
        organ: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadDoc(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { title: string; year: string; type?: string; organ?: string },
  ) {
    return this.admin.uploadTransparencyDoc({
      title: body.title,
      year: Number(body.year),
      type: body.type,
      organ: body.organ,
      file,
    });
  }

  // Inbox
  @Get('messages')
  @RequirePermissions('contact:read')
  messages() {
    return this.admin.listContacts();
  }

  @Patch('messages/:id')
  @RequirePermissions('contact:write')
  markMessage(
    @Param('id') id: string,
    @Body() dto: HandledDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.admin.markContactHandled(id, dto.handled, req.user.id);
  }

  @Get('volunteers')
  @RequirePermissions('volunteers:read')
  volunteers() {
    return this.admin.listVolunteers();
  }

  @Patch('volunteers/:id/status')
  @RequirePermissions('volunteers:write')
  volunteerStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.admin.updateVolunteerStatus(id, dto.status);
  }

  @Get('foster-families')
  @RequirePermissions('volunteers:read')
  foster() {
    return this.admin.listFoster();
  }

  @Patch('foster-families/:id/status')
  @RequirePermissions('volunteers:write')
  fosterStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.admin.updateFosterStatus(id, dto.status);
  }

  @Get('donations')
  @RequirePermissions('donations:read')
  donations() {
    return this.admin.listDonations();
  }

  @Patch('donations/:id/status')
  @RequirePermissions('donations:write')
  donationStatus(@Param('id') id: string, @Body() dto: DonationStatusDto) {
    return this.admin.updateDonationStatus(id, dto.status);
  }

  // Blog
  @Get('posts')
  @RequirePermissions('content:read')
  posts() {
    return this.admin.listPosts();
  }

  @Post('posts')
  @RequirePermissions('content:write')
  createPost(
    @Body()
    dto: {
      title: string;
      bodyMd: string;
      excerpt?: string;
      slug?: string;
      published?: boolean;
    },
  ) {
    return this.admin.createPost(dto);
  }

  @Patch('posts/:id')
  @RequirePermissions('content:write')
  updatePost(
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      bodyMd?: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      published?: boolean;
    },
  ) {
    return this.admin.updatePost(id, dto);
  }

  @Delete('posts/:id')
  @RequirePermissions('content:write')
  deletePost(@Param('id') id: string) {
    return this.admin.deletePost(id);
  }

  // Testimonials
  @Get('testimonials')
  @RequirePermissions('content:read')
  testimonials() {
    return this.admin.listTestimonials();
  }

  @Post('testimonials')
  @RequirePermissions('content:write')
  createTestimonial(
    @Body()
    dto: {
      authorName: string;
      content: string;
      authorRole?: string;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.admin.createTestimonial(dto);
  }

  @Patch('testimonials/:id')
  @RequirePermissions('content:write')
  updateTestimonial(
    @Param('id') id: string,
    @Body()
    dto: {
      authorName?: string;
      authorRole?: string;
      content?: string;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.admin.updateTestimonial(id, dto);
  }

  @Delete('testimonials/:id')
  @RequirePermissions('content:write')
  deleteTestimonial(@Param('id') id: string) {
    return this.admin.deleteTestimonial(id);
  }
}
