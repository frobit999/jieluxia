"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { CommunityPost } from "@/components/CommunityPost";
import { PrimaryButton } from "@/components/ui/Button";
import { apiGet, apiPost, apiFetch } from "@/lib/api";

interface Post {
  id: string;
  content: string;
  createdAt: string;
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
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    const data = await apiGet<{ posts: Post[] }>("/api/community?page=1&limit=20");
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const userData = await apiGet<{ user: any }>("/api/auth/me");
        if (!userData.user) {
          router.push("/login");
          return;
        }
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
      await apiPost("/api/community", { content: newPost });
      setNewPost("");
      await loadPosts();
    } finally {
      setPosting(false);
    }
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
      <div className="flex items-center justify-center h-64">
        <div className="text-[rgba(180,210,255,0.5)]">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[22px] font-bold text-[#e0f0ff] mb-6">
        战友社区 👥
      </h1>

      <GlassCard className="p-4 mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="分享你的感悟..."
          className="w-full bg-transparent border-none outline-none text-sm text-[#c0deff] resize-none h-20 placeholder:text-[rgba(180,210,255,0.3)]"
        />
        <div className="flex justify-end mt-2">
          <PrimaryButton
            onClick={handlePost}
            disabled={posting || !newPost.trim()}
            className="!px-6 !py-2 !text-sm"
          >
            {posting ? "发送中..." : "发布"}
          </PrimaryButton>
        </div>
      </GlassCard>

      {posts.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <div className="text-sm text-[rgba(180,210,255,0.5)]">
            还没有帖子，成为第一个分享的人吧！
          </div>
        </GlassCard>
      ) : (
        posts.map((post) => (
          <CommunityPost
            key={post.id}
            avatar={post.avatarEmoji || "🛡️"}
            name={post.nickname}
            days={0}
            content={post.content}
            time={timeAgo(post.createdAt)}
            likeCount={post.likeCount}
            onLike={() => handleLike(post.id)}
          />
        ))
      )}
    </>
  );
}
