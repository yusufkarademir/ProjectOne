import { Event } from '@prisma/client';

export interface TemplateProps {
  event: Event & {
    schedule?: any;
    announcements?: any;
    themeConfig?: any;
    location?: string | null;
    description?: string | null;
    coverImage?: string | null;
    endDate?: Date | null;
  };
}
