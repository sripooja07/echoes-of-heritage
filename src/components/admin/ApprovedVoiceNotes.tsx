import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Play, Pause, Search } from "lucide-react";
import { format } from "date-fns";

interface ApprovedVoiceNote {
  id: string;
  user_id: string;
  language_name: string;
  lesson_name: string | null;
  audio_url: string;
  transcription: string | null;
  reviewed_at: string | null;
  profiles?: {
    display_name: string | null;
  } | null;
}

export function ApprovedVoiceNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const { data: approvedNotes, isLoading } = useQuery({
    queryKey: ["voice-notes", "approved"],
    queryFn: async () => {
      const { data: voiceNotes, error } = await supabase
        .from("voice_notes")
        .select("*")
        .eq("status", "approved")
        .order("reviewed_at", { ascending: false });

      if (error) throw error;
      if (!voiceNotes) return [];

      // Fetch profiles for each voice note
      const userIds = [...new Set(voiceNotes.map((vn) => vn.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      return voiceNotes.map((vn) => ({
        ...vn,
        profiles: profileMap.get(vn.user_id) || null,
      })) as ApprovedVoiceNote[];
    },
  });

  const handlePlayAudio = (note: ApprovedVoiceNote) => {
    if (playingId === note.id) {
      currentAudio?.pause();
      window.speechSynthesis.cancel();
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }
    window.speechSynthesis.cancel();

    if (!note.audio_url || note.audio_url === "placeholder") {
      const utterance = new SpeechSynthesisUtterance(
        note.transcription || note.language_name
      );
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingId(note.id);
    } else {
      const audio = new Audio(note.audio_url);
      audio.onended = () => {
        setPlayingId(null);
        setCurrentAudio(null);
      };
      audio.play();
      setPlayingId(note.id);
      setCurrentAudio(audio);
    }
  };

  const filteredNotes = approvedNotes?.filter(
    (note) =>
      note.language_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.lesson_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Approved Voice Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Approved Voice Notes
            {approvedNotes && approvedNotes.length > 0 && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                {approvedNotes.length} approved
              </Badge>
            )}
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search approved notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!filteredNotes || filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {searchQuery
                ? "No matching approved voice notes found"
                : "No approved voice notes yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contributor</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>Date Approved</TableHead>
                <TableHead>Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">
                    {note.profiles?.display_name || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                      {note.language_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{note.lesson_name || "General"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {note.reviewed_at
                      ? format(new Date(note.reviewed_at), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayAudio(note)}
                      className="h-8 w-8"
                    >
                      {playingId === note.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
