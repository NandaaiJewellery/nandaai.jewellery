import { Comment } from './comments.model';

export const commentsProviders = [
  {
    provide: 'COMMENT_REPOSITORY',
    useValue: Comment,
  },
];
