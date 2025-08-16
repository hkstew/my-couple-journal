'use client';

import Image from "next/image";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/components/utils";
import { Heart } from "lucide-react";

export type Moment = {
  id: string;
  title: string | null;
  caption: string | null;
  happened_at: string;
  created_at: string;
  photos: { storage_path: string }[];
};

export function MomentCard({ m, photoUrl }: { m: Moment, photoUrl?: string }) {
  return (
    <div className="card grid gap-3">
      <div className="flex items-center justify-between">
        <div className="ribbon">{format(new Date(m.happened_at), "d MMM yyyy", { locale: th })}</div>
        <button className="inline-flex items-center gap-1 text-pink-700"><Heart size={16}/> react</button>
      </div>
      {photoUrl && (
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt={m.title ?? ''} className="w-full h-full object-cover"/>
        </div>
      )}
      {m.title && <h3 className="text-lg font-semibold">{m.title}</h3>}
      {m.caption && <p className="text-gray-700 whitespace-pre-wrap">{m.caption}</p>}
    </div>
  );
}
