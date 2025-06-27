import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import resourceService, { Comment } from '@/services/resource';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface CommentBoxProps {
  resourceId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ resourceId, comments, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to add a comment');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await resourceService.addComment(resourceId, commentText);
      onCommentAdded(response.comment);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
      
      {/* Comment form */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="mb-3">
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-sm"
              rows={3}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 text-sm p-3 rounded-md mb-6">
          Please <a href="/auth/login" className="text-blue-600 hover:text-blue-800">log in</a> to add a comment.
        </div>
      )}
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-medium text-sm text-gray-600">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-3">No comments yet. Be the first to add one!</div>
      )}
    </div>
  );
};

export default CommentBox;
