"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        fetchBookmarks();

        const channel = supabase
          .channel("bookmarks-channel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
            },
            () => {
              fetchBookmarks();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }

      setLoading(false);
    };

    init();
  }, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title || !url || !user) return;

    if (!url.startsWith("http")) {
      alert("URL must start with http or https");
      return;
    }

    setAdding(true);

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          🔖 Smart Bookmark Manager
        </h1>

        {!user ? (
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Logged in as <strong>{user.email}</strong>
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>

            {/* Add Form */}
            <div className="flex gap-3 mb-6">
              <input
                placeholder="Bookmark title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAdd}
                disabled={adding}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add"}
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <p className="text-center text-gray-500">
                Loading bookmarks...
              </p>
            )}

            {/* Empty State */}
            {!loading && bookmarks.length === 0 && (
              <p className="text-center text-gray-400">
                No bookmarks yet. Add your first one 🚀
              </p>
            )}

            {/* Bookmark List */}
            <div className="space-y-4">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {b.title}
                  </a>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
