'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { MomentCard, type Moment } from "@/components/MomentCard";

type Photo = { id: string; storage_path: string };

export default function TimelinePage() {
  const { user, loading } = useUser();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: cm } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      const coupleId = cm?.couple_id;
      if (!coupleId) return;

      const { data: rows } = await supabase
        .from("moments")
        .select("id,title,caption,happened_at,created_at,moment_photos(storage_path)")
        .eq("couple_id", coupleId)
        .order("happened_at", { ascending: false })
        .limit(50);
      const normalized: Moment[] = (rows ?? []).map((r: any) => ({
        id: r.id, title: r.title, caption: r.caption, happened_at: r.happened_at, created_at: r.created_at,
        photos: r.moment_photos ?? []
      }));
      setMoments(normalized);

      // create signed URLs for first photo of each moment
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "photos";
      const promises = normalized.map(async (m) => {
        const first = m.photos?.[0]?.storage_path;
        if (!first) return;
        const { data } = await supabase.storage.from(bucket).createSignedUrl(first, 60 * 60); // 1h
        if (data?.signedUrl) return [m.id, data.signedUrl] as const;
      });
      const list = (await Promise.all(promises)).filter(Boolean) as [string, string][];
      const dict: Record<string, string> = {};
      for (const [id, url] of list) dict[id] = url;
      setPhotoUrls(dict);
    };
    load();
  }, [user]);

  if (loading) return <div>Loading…</div>;
  if (!user) return <div className="card"><p>Please go to <b>Setup</b> and sign in first ♥</p></div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Timeline</h1>
      <div className="grid gap-4">
        {moments.length === 0 && <div className="card">No moments yet. <a href="/moments/new" className="underline">Add one</a> 🍓</div>}
        {moments.map((m) => (
          <MomentCard key={m.id} m={m} photoUrl={photoUrls[m.id]} />
        ))}
      </div>
    </div>
  );
}
