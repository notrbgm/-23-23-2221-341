export interface Comment {
  id: number;
  content: string;
  userId: number;
  mediaId: number;
  mediaType: string;
  rating: number | null;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
  };
  _count: {
    likes: number;
    replies: number;
  };
  isLiked?: boolean;
  flagged?: boolean;
  flagReason?: string | null;
  flaggedAt?: string | null;
}

export interface CommentResponse {
  comments: Comment[];
  total: number;
}
