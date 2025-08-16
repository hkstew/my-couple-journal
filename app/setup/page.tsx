'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { v4 as uuidv4 } from "uuid";

// Simple UUID generator fallback (avoid extra dep if not present)
function genId() {
  try { return uuidv4(); } catch { return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2); }
}

export default function SetupPage() {
  const { user, loading } = useUser();
  const [myCouple, setMyCouple] = useState<any | null>(null);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: cm } = await supabase
        .from("couple_members")
        .select("couples(*)")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      setMyCouple(cm?.couples ?? null);
    };
    load();
  }, [user]);

  const createCouple = async () => {
    if (!user) return;
    const coupleId = genId();
    const { error: e1 } = await supabase.from("couples").insert({ id: coupleId, name: "Our Couple" });
    if (e1) { alert(e1.message); return; }
    const { error: e2 } = await supabase.from("couple_members").insert({ couple_id: coupleId, user_id: user.id, role: "owner" });
    if (e2) { alert(e2.message); return; }
    setMyCouple({ id: coupleId, name: "Our Couple" });
  };

  const joinCouple = async () => {
    if (!user) return;
    if (!joinCode) return alert("Enter couple code");
    const { data: c } = await supabase.from("couples").select("id").eq("id", joinCode).maybeSingle();
    if (!c) return alert("Couple not found");
    const { error } = await supabase.from("couple_members").insert({ couple_id: c.id, user_id: user.id, role: "member" });
    if (error) { alert(error.message); return; }
    setMyCouple(c);
  };

  const signIn = async () => {
    const email = prompt("Enter your email for a magic link:");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) alert(error.message);
    else alert("Check your email for the magic link ♥");
  };

  const signOut = async () => await supabase.auth.signOut();

  if (loading) return <div>Loading…</div>;

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Setup</h1>
        {!user ? (
          <button className="button" onClick={signIn}>Sign in with email link</button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="ribbon">Signed in</div>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={signOut} className="button bg-candy-sky">Sign out</button>
          </div>
        )}
      </div>

      {user && (
        <div className="card grid gap-4">
          <h2 className="text-lg font-medium">Couple</h2>
          {myCouple ? (
            <div>
              <p className="text-gray-700">You are in couple: <b>{myCouple.name}</b></p>
              <p className="text-gray-700">Share this couple code with your partner:</p>
              <code className="inline-block mt-2 bg-gray-100 rounded-xl px-3 py-1">{myCouple.id}</code>
            </div>
          ) : (
            <div className="grid gap-3">
              <button className="button" onClick={createCouple}>Create our couple</button>
              <div className="grid gap-2">
                <label className="label">Or join with a couple code</label>
                <input className="input" placeholder="paste couple id…" value={joinCode} onChange={e=>setJoinCode(e.target.value)} />
                <button className="button bg-candy-sky" onClick={joinCouple}>Join couple</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
