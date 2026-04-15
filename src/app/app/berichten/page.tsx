'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Post } from '@/types';

function PostCard({ post, onLike, onComment }: { post: Post; onLike: () => void; onComment: () => void }) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Nu';
    if (hours < 24) return `${hours}u`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('nl-NL');
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '16px', 
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#fed7aa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          overflow: 'hidden',
        }}>
          {post.userPhoto ? (
            <img src={post.userPhoto} alt={post.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#c2410c', fontWeight: 600, fontSize: '18px' }}>{getInitials(post.userName)}</span>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{post.userName}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatDate(post.createdAt)}</div>
        </div>
      </div>

      <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>{post.content}</p>

      {post.image && (
        <img 
          src={post.image} 
          alt="Post image" 
          style={{ 
            width: '100%', 
            borderRadius: '12px', 
            marginBottom: '12px',
            maxHeight: '300px',
            objectFit: 'cover',
          }} 
        />
      )}

      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
        <button 
          onClick={onLike}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: post.liked ? '#1B8C82' : '#6b7280',
            fontSize: '14px',
          }}
        >
          <span>{post.liked ? '❤️' : '🤍'}</span>
          <span>{post.likesCount}</span>
        </button>
        <button 
          onClick={onComment}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          <span>💬</span>
          <span>{post.commentsCount}</span>
        </button>
      </div>
    </div>
  );
}

export default function BerichtenPage() {
  const { currentUser, posts, loadPosts, createPost, likePost, getPostComments, addComment } = useApp();
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts().then(() => setLoading(false));
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    await createPost(newPost.trim());
    setNewPost('');
  };

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleShowComments = async (postId: string) => {
    if (showComments === postId) {
      setShowComments(null);
    } else {
      const postComments = await getPostComments(postId);
      setComments(postComments);
      setShowComments(postId);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !commentPostId) return;
    await addComment(commentPostId, newComment.trim());
    setNewComment('');
    const postComments = await getPostComments(commentPostId);
    setComments(postComments);
  };

  if (!currentUser) return null;

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#c2410c' }}>
        📝 Berichten
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Deel je bericht met de community
      </p>

      {currentUser.type === 'zorgzoeker' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '16px', 
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Waar heb je hulp bij nodig? Vertel de community..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button 
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
            style={{
              marginTop: '12px',
              padding: '12px 24px',
              backgroundColor: newPost.trim() ? '#1B8C82' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: newPost.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            📢 Plaats bericht
          </button>
        </div>
      )}

      {currentUser.type !== 'zorgzoeker' && (
        <div style={{ 
          backgroundColor: '#fff7ed', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '20px',
          border: '2px solid #fed7aa',
        }}>
          <p style={{ color: '#c2410c', fontSize: '14px' }}>
            💡 Alleen zorgzoekers (PGB-houders, zorgvragers, ouders, mantelzorgers) kunnen berichten plaatsen.
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Berichten laden...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6b7280',
          backgroundColor: 'white',
          borderRadius: '16px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
          <p>Nog geen berichten. Wees de eerste!</p>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <div key={post.id}>
              <PostCard 
                post={post} 
                onLike={() => handleLike(post.id)}
                onComment={() => handleShowComments(post.id)}
              />
              
              {showComments === post.id && (
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '12px', 
                  padding: '16px', 
                  marginBottom: '16px',
                }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                    Reacties ({comments.length})
                  </h4>
                  
                  {comments.map(comment => (
                    <div key={comment.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{comment.userName}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {new Date(comment.createdAt).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', margin: 0 }}>{comment.content}</p>
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input
                      type="text"
                      value={commentPostId === post.id ? newComment : ''}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                        setCommentPostId(post.id);
                      }}
                      placeholder="Schrijf een reactie..."
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                      }}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: newComment.trim() ? '#1B8C82' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '13px',
                        cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}