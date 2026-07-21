"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfileSettingsPage() {
  const { user } = useSupabaseUser();
  const [isSaving, setIsSaving] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: fullNameRef.current?.value ?? "" }).eq("id", user.id);
    setIsSaving(false);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>Used across the app and in assistant replies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Full name</Label>
            {/* Uncontrolled + keyed on user id: avoids syncing async user data into
                controlled state via an effect, and remounts with the right
                defaultValue once the user loads. */}
            <Input key={user?.id ?? "loading"} ref={fullNameRef} defaultValue={(user?.user_metadata?.full_name as string) ?? ""} />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
