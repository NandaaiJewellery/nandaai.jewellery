import { Share } from './shares.model';

export const sharesProviders = [
  {
    provide: 'SHARE_REPOSITORY',
    useValue: Share,
  },
];
