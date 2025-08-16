'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  title: z.string().max(120).optional(),
  caption: z.string().max(2000).optional(),
  date: z.string().min(1),   // เก็บเป็น string จาก <input type="date">
  files: z.any().optional(), // ให้ optional ก็ได้ จะอัปโหลดหรือไม่ก็ได้
});

type FormValues = z.infer<typeof FormSchema>;  // ✅ เพิ่มบรรทัดนี้

export default function NewMomentPage() {
  const { user } = useUser();
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // ✅ บอก generic ให้ useForm ว่าใช้ FormValues
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        title: "",
        caption: "",
        date: new Date().toISOString().slice(0, 10),
        // ไม่ต้องใส่ default ของ files ก็ได้
      },
    });


  useEffect(() => {
    if (!user) return;
    supabase.from("couple_members").select("couple_id").eq("user_id", user.id).limit(1).maybeSingle().then(({ data }) => {
      setCoupleId(data?.couple_id ?? null);
    });
  }, [user]);

  const onSubmit = async (data: any) => {
    if (!user) return alert("Sign in first");
    if (!coupleId) return alert("Create or join a couple in Setup");
    const { title, caption, date } = data;
    const { data: m, error: e1 } = await supabase
      .from("moments")
      .insert({ couple_id: coupleId, title, caption, happened_at: date, created_by: user.id })
      .select("id")
      .single();
    if (e1) return alert(e1.message);

    const files: FileList = data.files?.[0]?.length ? data.files[0] : data.files;
    if (files && files.length) {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "photos";
      for (let i = 0; i < files.length; i++) {
        const f = files[i] as File;
        const compressed = await imageCompression(f, { maxWidthOrHeight: 2000, maxSizeMB: 2 });
        const path = `${coupleId}/${m.id}/${Date.now()}-${i}-${f.name.replace(/\s+/g,'_')}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, compressed, { upsert: false });
        if (!upErr) {
          await supabase.from("moment_photos").insert({ moment_id: m.id, storage_path: path });
        }
      }
    }
    alert("Saved! ♥");
    reset();
  };

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Add a Moment 🐻</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-3">
        <div>
          <label className="label">Date</label>
          <input type="date" className="input" {...register("date")} />
        </div>
        <div>
          <label className="label">Title (optional)</label>
          <input className="input" placeholder="e.g., Café date ☕" {...register("title")} />
        </div>
        <div>
          <label className="label">Caption (optional)</label>
          <textarea className="input" rows={4} placeholder="Write something sweet…" {...register("caption")} />
        </div>
        <div>
          <label className="label">Photos</label>
          <input type="file" multiple accept="image/*" {...register("files")} />
        </div>
        <button className="button" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save moment"}</button>
      </form>
      <p className="text-xs text-gray-500">Photos are stored privately. We generate signed URLs when viewing.</p>
    </div>
  );
}
