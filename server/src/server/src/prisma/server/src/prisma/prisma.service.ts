// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS postgis;');
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// server/src/common/enums/role.enum.ts
export enum AppRole {
  GUEST = 'GUEST',
  TOURIST = 'TOURIST',
  GUIDE_VERIFIED = 'GUIDE_VERIFIED',
  RESPONDER = 'RESPONDER',
  ADMIN = 'ADMIN'
}
// server/src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AppRole } from '../enums/role.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
// server/src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppRole } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass()
    ]);
    if (!required || required.length === 0) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { role?: AppRole } | undefined;
    if (!user?.role) return false;
    return required.includes(user.role);
  }
}
// server/src/auth/dto/auth.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsOptional() @IsString() displayName?: string;
}
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}
// server/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy]
})
export class AuthModule {}
// server/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new UnauthorizedException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, displayName: dto.displayName ?? '', role: Role.TOURIST }
    });
    return this.issueTokens(user.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user.id, user.role);
  }

  private async issueTokens(userId: string, role: Role) {
    const accessTtl = process.env.JWT_ACCESS_TTL ?? '900s';
    const refreshTtl = process.env.JWT_REFRESH_TTL ?? '30d';
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role },
      { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: accessTtl }
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, role, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET!, expiresIn: refreshTtl }
    );
    return { accessToken, refreshToken };
  }

  async refresh(userId: string, role: Role) {
    return this.issueTokens(userId, role);
  }
}
// server/src/auth/auth.controller.ts
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt.strategy';
import { RefreshAuthGuard } from './refresh.strategy';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as any;
    return this.auth.refresh(user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('whoami')
  whoami(@Req() req: Request) {
    return req.user;
  }
}
// server/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET
    });
  }
  async validate(payload: any) {
    return payload;
  }
}
export class JwtAuthGuard extends AuthGuard('jwt') {}
// server/src/auth/refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET
    });
  }
  async validate(payload: any) {
    if (payload?.type !== 'refresh') return null;
    return payload;
  }
}
export class RefreshAuthGuard extends AuthGuard('refresh') {}
// server/src/settings/settings.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/settings')
export class SettingsController {
  private ui = {
    autoScrollMsPer1000Chars: Number(process.env.UI_AUTOSCROLL_LONG_CONTENT_MS_PER_1000_CHARS ?? 800)
  };

  @Get('ui')
  getUi() {
    return this.ui;
  }

  @Post('ui')
  setUi(@Body() body: { autoScrollMsPer1000Chars?: number }) {
    if (typeof body.autoScrollMsPer1000Chars === 'number') {
      this.ui.autoScrollMsPer1000Chars = body.autoScrollMsPer1000Chars;
    }
    return this.ui;
  }
}
// server/src/advisories/advisories.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('api/advisories')
export class AdvisoriesController {
  constructor(private prisma: PrismaService) {}
  @Get('weather')
  weather(@Query('regionId') regionId: string) {
    return this.prisma.advisory.findMany({ where: { regionId, type: 'WEATHER' } });
  }
  @Get('scams')
  scams(@Query('regionId') regionId: string) {
    return this.prisma.scamAlert.findMany({ where: { regionId }, orderBy: { createdAt: 'desc' } });
  }
}
// server/src/trust/trust.controller.ts
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('api/trust')
export class TrustController {
  constructor(private prisma: PrismaService) {}
  @Get('notes')
  listNotes(@Query('regionId') regionId: string) {
    return this.prisma.trustNote.findMany({ where: { regionId }, orderBy: { createdAt: 'desc' } });
  }
  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async addNote(@Body() body: { regionId: string; note: string }, req: any) {
    const user = req.user as any;
    return this.prisma.trustNote.create({ data: { userId: user.sub, regionId: body.regionId, note: body.note } });
  }
}
// server/src/prices/prices.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('api/prices')
export class PricesController {
  constructor(private prisma: PrismaService) {}
  @Get()
  list(@Query('regionId') regionId: string, @Query('service') service?: string) {
    return this.prisma.priceListEntry.findMany({
      where: { regionId, service: service as any },
      orderBy: { createdAt: 'desc' }
    });
  }
}
// server/src/guides/guides.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('api/guides')
export class GuidesController {
  constructor(private prisma: PrismaService) {}

  @Get('list')
  async list() {
    return this.prisma.guideProfile.findMany({ include: { user: true } });
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async apply(@Body() body: { bio?: string; languages?: string[]; serviceRegionIds?: string[] }, req: any) {
    const userId = (req.user as any).sub as string;
    return this.prisma.guideProfile.upsert({
      where: { userId },
      update: { bio: body.bio, languages: body.languages ?? [], serviceRegionIds: body.serviceRegionIds ?? [] },
      create: { userId, bio: body.bio, languages: body.languages ?? [], serviceRegionIds: body.serviceRegionIds ?? [] }
    });
  }

  // Admin verify (stub, will add RBAC in next pass)
  @Post('verify')
  async verify(@Body() body: { userId: string; verified: boolean }) {
    return this.prisma.guideProfile.update({ where: { userId: body.userId }, data: { verified: body.verified } });
  }
}
// server/src/partners/partners.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/partners')
export class PartnersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('type') type?: string) {
    return this.prisma.partner.findMany({
      where: { type: type as any },
      include: { regions: { include: { region: true } } }
    });
  }

  @Post()
  create(@Body() body: { type: string; name: string; contact?: any; webhook?: string; regionIds?: string[] }) {
    return this.prisma.partner.create({
      data: {
        type: body.type as any,
        name: body.name,
        contact: body.contact,
        webhook: body.webhook,
        regions: { create: (body.regionIds ?? []).map((regionId) => ({ regionId })) }
      }
    });
  }
}
// server/src/hospitals/hospitals.controller.ts
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/hospitals')
export class HospitalsController {
  @Post('alerts')
  async alert(@Body() body: { regionId: string; incidentId: string; details?: any }) {
    // TODO: push to BullMQ to notify hospital partners
    return { ok: true, routedTo: 'preferred-hospital', body };
  }
}
// server/src/incidents/incidents.controller.ts
import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { IncidentType } from '@prisma/client';

@Controller('api')
export class IncidentsController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sos')
  async sos(@Body() body: { type: 'SOS' | 'SILENT_ALARM' | 'WATCH_ME'; description?: string }, @Req() req: any) {
    const userId = (req.user as any).sub as string;
    const incident = await this.prisma.incidentReport.create({
      data: { userId, type: body.type as IncidentType, description: body.description }
    });
    await this.prisma.sosRequest.create({
      data: { userId, incidentId: incident.id, type: body.type as IncidentType }
    });
    // TODO: enqueue alert notifications to responders/contacts
    return { incidentId: incident.id, status: 'dispatched' };
  }
}
// server/src/evidence/evidence.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/evidence')
export class EvidenceController {
  constructor(private prisma: PrismaService) {}
  @Post('collect')
  async collect(@Body() body: { incidentId: string; wifiScan?: any; sensors?: any; audioS3Key?: string; s3Key?: string }) {
    const ev = await this.prisma.evidencePackage.upsert({
      where: { incidentId: body.incidentId },
      update: { wifiScan: body.wifiScan, sensors: body.sensors, audioS3Key: body.audioS3Key, s3Key: body.s3Key },
      create: { incidentId: body.incidentId, wifiScan: body.wifiScan, sensors: body.sensors, audioS3Key: body.audioS3Key, s3Key: body.s3Key }
    });
    // TODO: enqueue blockchain anchoring
    return ev;
  }
}
// server/src/insurance/insurance.controller.ts
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/insurance')
export class InsuranceController {
  @Post('claim')
  async claim(@Body() body: { incidentId: string; provider?: string }) {
    // TODO: package incident + evidence and submit via BullMQ
    return { ok: true, submitted: true, provider: body.provider ?? 'default' };
  }
}
// server/src/offline/offline.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('api/offline')
export class OfflineController {
  @Get('packs')
  list(@Query('userId') _userId: string) {
    return [];
  }
  @Post('request')
  request(@Body() body: { regionId: string }) {
    // TODO: enqueue pack generation
    return { ok: true, status: 'queued' };
  }
}
