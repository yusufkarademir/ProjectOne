import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import ModernTemplate from '@/app/components/templates/ModernTemplate';
import WeddingTemplate from '@/app/components/templates/WeddingTemplate';
import CorporateTemplate from '@/app/components/templates/CorporateTemplate';
import PartyTemplate from '@/app/components/templates/PartyTemplate';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    notFound();
  }

  const themeConfig = (event.themeConfig as any) || {};
  const theme = themeConfig.theme || 'modern';

  // Render the appropriate template based on the theme selection
  switch (theme) {
    case 'wedding':
      return <WeddingTemplate event={event} />;
    case 'corporate':
      return <CorporateTemplate event={event} />;
    case 'party':
      return <PartyTemplate event={event} />;
    case 'modern':
    default:
      return <ModernTemplate event={event} />;
  }
}
