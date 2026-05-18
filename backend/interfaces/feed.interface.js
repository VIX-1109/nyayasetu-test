/**
 * Justice Feed module contract.
 *
 * Controllers should call a feed service with these shapes.
 * Repositories should map these shapes to Supabase/Postgres tables.
 */

export const POST_TYPES = ['Short Update', 'Article', 'Legal News', 'Help Request'];
export const POST_STATUSES = ['draft', 'published', 'hidden', 'removed'];
export const REPORT_STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'];

export const feedRepositoryContract = {
  listPublishedPosts: '() => Promise<Post[]>',
  createPost: '(CreatePostInput) => Promise<Post>',
  createComment: '(CreateCommentInput) => Promise<Comment>',
  toggleReaction: '(ToggleReactionInput) => Promise<boolean>',
  reportPost: '(ReportPostInput) => Promise<void>',
  listReportedPosts: '() => Promise<PostReport[]>',
  updatePostStatus: '(postId, status) => Promise<void>'
};

export const createPostInput = {
  authorId: 'uuid',
  type: 'Short Update | Article | Legal News | Help Request',
  category: 'string',
  content: 'string',
  isAnonymous: 'boolean',
  authorVerified: 'boolean'
};
