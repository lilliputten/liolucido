import { envClient } from '@/env/envClient';
import { SiteConfig } from '@/shared/types/site/SiteConfig';
import appInfoModule from '@/app-info.json';

const siteUrl = envClient.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: 'TrainWizzz!',
  description: 'NextJS application for memorizing answers to questions',
  versionInfo: appInfoModule.versionInfo,
  url: siteUrl,
  ogImage: `/static/opengraph-image-new.jpg`,
  links: {
    website: siteUrl, // 'https://team-tree-app.vercel.app/',
    github: 'https://github.com/lilliputten/team-tree-app',
  },
  mailSupport: 'support@example.com',
};
