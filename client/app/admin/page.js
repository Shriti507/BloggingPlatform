import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setError("");
    try {
      const [statsRes, postsRes, commentsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/comments"),
      ]);

      const [statsData, postsData, commentsData] = await Promise.all([
        statsRes.json(),
        postsRes.json(),
        commentsRes.json(),
      ]);

      if (statsRes.ok) setStats(statsData.stats || []);
      if (postsRes.ok) setPosts(postsData.posts || []);
      if (commentsRes.ok) setComments(commentsData.comments || []);
    } catch (e) {
      setError("Failed to fetch dashboard data");
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
      return;
    }
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, loading, router, fetchData]);

  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  if (loading || (!isAdmin && loadingData)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-neutral-900">Admin Console</h1>
          <p className="mt-2 text-neutral-600">Platform-wide management and moderation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.length > 0 ? (
          stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))
        ) : (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
          ))
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Manage Posts Section */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">All Posts</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              {posts.length} entries
            </span>
          </div>
          <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="truncate font-medium text-neutral-900">{post.title}</p>
                    <p className="text-xs text-neutral-500">by <span className="font-semibold text-neutral-700">{post.author}</span> · {post.updatedAt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/post/${post.id}`}
                      className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-neutral-500">No posts found.</p>
            )}
          </div>
        </section>

        {/* View Comments Section */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Comments</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Moderation
            </span>
          </div>
          <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="group rounded-xl border border-neutral-50 bg-neutral-50/50 p-4 transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-neutral-700">{comment.author}</p>
                      <p className="text-[10px] text-neutral-400">on <span className="text-neutral-600">{comment.postTitle}</span> · {comment.at}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="rounded-md bg-white p-1 text-red-500 opacity-0 shadow-sm transition-all hover:text-red-700 group-hover:opacity-100"
                      title="Delete Comment"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 italic">"{comment.body}"</p>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-neutral-500">No recent comments.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
