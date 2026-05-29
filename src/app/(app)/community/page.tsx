"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CommunityPost } from "@/components/CommunityPost";
import { PrimaryButton } from "@/components/ui/Button";
import { apiGet, apiPost, apiFetch, apiDelete } from "@/lib/api";

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
  nickname: string;
  avatarEmoji: string;
  likeCount: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    const data = await apiGet<{ posts: Post[] }>("/api/community?page=1&limit=20");
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const userData = await apiGet<{ user: { id: string; nickname: string } }>("/api/auth/me");
        if (!userData.user) {
          router.push("/login");
          return;
        }
        setCurrentUserId(userData.user.id);
        await loadPosts();
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, loadPosts]);

  const handlePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      await apiPost("/api/community", { content: newPost, isAnonymous });
      setNewPost("");
      await loadPosts();
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    await apiDelete(`/api/community/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likeCount: p.likeCount + 1 }
          : p
      )
    );
    try {
      const data = (await apiFetch(`/api/community/${postId}/like`, { method: "POST" }).then((r) => r.json())) as { likeCount: number };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likeCount: data.likeCount } : p
        )
      );
    } catch {
      await loadPosts();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "400px" }}>
        <div style={{ color: "var(--color-slate)", fontSize: "14px" }}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <section style={{ marginBottom: "64px" }}>
        <p className="section-label">社区</p>
        <h1 className="heading-display" style={{ marginBottom: "12px" }}>
          战友社区
        </h1>
        <p className="text-body" style={{ maxWidth: "480px" }}>
          分享你的感悟，和同行者互相鼓励。
        </p>
      </section>

      {/* Post composer */}
      <section style={{ marginBottom: "48px" }}>
        <div className="card" style={{ padding: "24px" }}>
          <p className="section-label">发表动态</p>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="分享你的感悟..."
            className="input-bare"
            style={{ height: "80px", marginBottom: "16px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--color-gravel)" }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--color-obsidian)", cursor: "pointer" }}
              />
              匿名发布
            </label>
            <PrimaryButton
              onClick={handlePost}
              disabled={posting || !newPost.trim()}
            >
              {posting ? "发送中..." : "发布"}
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Posts list */}
      <section>
        <p className="section-label">最新动态</p>
        {posts.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center" }}>
            <p className="text-body">还没有帖子，成为第一个分享的人吧！</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                avatar={post.avatarEmoji || "shield"}
                name={post.nickname}
                days={0}
                content={post.content}
                time={timeAgo(post.createdAt)}
                likeCount={post.likeCount}
                onLike={() => handleLike(post.id)}
                isAnonymous={post.isAnonymous}
                isOwn={post.userId === currentUserId}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
