import { Like } from './likes.model';

export const likesProviders = [
  {
    provide: 'LIKE_REPOSITORY',
    useValue: Like,
  },
];
