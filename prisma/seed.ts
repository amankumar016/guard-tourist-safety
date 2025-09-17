import { PrismaClient, Role, ServiceType, AdvisoryType, ScamLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Regions
  const region = await prisma.region.upsert({
    where: { id: 'seed-region' },
    update: {},
    create: {
      id: 'seed-region',
      name: 'Demo Valley',
      country: 'US',
      timezone: 'America/Los_Angeles',
    },
  });

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: '$2a$10$y2gq3u7f6MMyOGy4sQJw8OG3xQYt2oy0X7g5F7cpo8jvQX1zXHnC6', // bcrypt: Admin@123
      role: Role.ADMIN,
      displayName: 'Admin',
    },
  });

  const tourist = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: {},
    create: {
      email: 'tourist@example.com',
      passwordHash: '$2a$10$y2gq3u7f6MMyOGy4sQJw8OG3xQYt2oy0X7g5F7cpo8jvQX1zXHnC6', // Admin@123
      role: Role.TOURIST,
      displayName: 'Sample Tourist',
      homeRegionId: region.id,
    },
  });

  const guideUser = await prisma.user.upsert({
    where: { email: 'guide@example.com' },
    update: {},
    create: {
      email: 'guide@example.com',
      passwordHash: '$2a$10$y2gq3u7f6MMyOGy4sQJw8OG3xQYt2oy0X7g5F7cpo8jvQX1zXHnC6',
      role: Role.GUIDE_VERIFIED,
      displayName: 'Local Guide',
    },
  });

  await prisma.guideProfile.upsert({
    where: { userId: guideUser.id },
    update: {},
    create: {
      userId: guideUser.id,
      verified: true,
      bio: 'Experienced mountain and city guide.',
      languages: ['en', 'es'],
      serviceRegionIds: [region.id],
      trustScore: 4.6,
    },
  });

  // Advisories
  await prisma.advisory.create({
    data: {
      regionId: region.id,
      type: AdvisoryType.WEATHER,
      data: { tempC: 22, condition: 'clear' },
      effectiveFrom: new Date(),
    },
  });

  // Scam alert
  await prisma.scamAlert.create({
    data: {
      regionId: region.id,
      level: ScamLevel.MEDIUM,
      description: 'Beware of fake ticket sellers near central station.',
    },
  });

  // Price list
  await prisma.priceListEntry.createMany({
    data: [
      {
        regionId: region.id,
        service: ServiceType.TAXI,
        item: 'Airport to downtown (fixed fare)',
        priceMin: 35.0,
        priceMax: 45.0,
        currency: 'USD',
        verifiedBy: 'admin',
      },
      {
        regionId: region.id,
        service: ServiceType.GUIDE,
        item: 'Half-day city tour',
        priceMin: 60.0,
        priceMax: 100.0,
        currency: 'USD',
        verifiedBy: 'guide',
      },
    ],
  });

  // Partner: hospital
  const hospital = await prisma.partner.create({
    data: {
      type: 'HOSPITAL',
      name: 'Demo Valley General Hospital',
      contact: { phone: '+1-555-0001', email: 'er@demo-hospital.org' },
      webhook: '',
    },
  });
  await prisma.partnerRegion.create({
    data: { partnerId: hospital.id, regionId: region.id },
  });

  // Trust note
  await prisma.trustNote.create({
    data: {
      userId: tourist.id,
      regionId: region.id,
      note: 'Safe shortcut through the park during daytime.',
    },
  });
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
