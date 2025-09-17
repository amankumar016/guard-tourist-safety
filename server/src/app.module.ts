import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SettingsController } from './settings/settings.controller';
import { TrustController } from './trust/trust.controller';
import { PricesController } from './prices/prices.controller';
import { AdvisoriesController } from './advisories/advisories.controller';
import { GuidesController } from './guides/guides.controller';
import { PartnersController } from './partners/partners.controller';
import { HospitalsController } from './hospitals/hospitals.controller';
import { IncidentsController } from './incidents/incidents.controller';
import { EvidenceController } from './evidence/evidence.controller';
import { InsuranceController } from './insurance/insurance.controller';
import { OfflineController } from './offline/offline.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule
  ],
  controllers: [
    SettingsController,
    TrustController,
    PricesController,
    AdvisoriesController,
    GuidesController,
    PartnersController,
    HospitalsController,
    IncidentsController,
    EvidenceController,
    InsuranceController,
    OfflineController
  ]
})
export class AppModule {}
