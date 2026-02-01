import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Pause, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface VoiceNote {
  id: string;
  user_id: string;
  language_name: string;
  lesson_name: string | null;
  audio_url: string;
  transcription: string | null;
  translation: string | null;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  profiles?: {
    display_name: string | null;
  } | null;
}

export function PendingVoiceNotes() {
  const queryClient = useQueryClient();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch pending voice notes
  const { data: pendingNotes, isLoading } = useQuery({
    queryKey: ["voice-notes", "pending"],
    queryFn: async () => {
      const { data: voiceNotes, error } = await supabase
        .from("voice_notes")
        .select("*")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false });

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
      })) as VoiceNote[];
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update voice note status
      const { error: updateError } = await supabase
        .from("voice_notes")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", noteId);

      if (updateError) throw updateError;

      // Log admin action
      const { error: logError } = await supabase
        .from("admin_action_logs")
        .insert({
          admin_user_id: user.id,
          action_type: "approve_voice_note",
          target_id: noteId,
          target_type: "voice_note",
          details: { action: "approved" },
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-notes"] });
      toast({
        title: "✅ Voice Note Approved",
        description: "The voice note has been approved and added to lesson content.",
      });
      setApproveDialogOpen(false);
      setSelectedNote(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ noteId, reason }: { noteId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update voice note status
      const { error: updateError } = await supabase
        .from("voice_notes")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_reason: reason,
        })
        .eq("id", noteId);

      if (updateError) throw updateError;

      // Log admin action
      const { error: logError } = await supabase
        .from("admin_action_logs")
        .insert({
          admin_user_id: user.id,
          action_type: "reject_voice_note",
          target_id: noteId,
          target_type: "voice_note",
          details: { action: "rejected", reason },
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voice-notes"] });
      toast({
        title: "❌ Voice Note Rejected",
        description: "The voice note has been rejected and logged.",
        variant: "destructive",
      });
      setRejectDialogOpen(false);
      setSelectedNote(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlayAudio = (note: VoiceNote) => {
    if (playingId === note.id) {
      currentAudio?.pause();
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
    }

    // For demo purposes, use speech synthesis if audio_url is placeholder
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

  const handleApproveClick = (note: VoiceNote) => {
    setSelectedNote(note);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (note: VoiceNote) => {
    setSelectedNote(note);
    setRejectDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Voice Notes
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Voice Notes
            {pendingNotes && pendingNotes.length > 0 && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                {pendingNotes.length} pending
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingNotes || pendingNotes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending voice notes to review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Lesson/Section</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">
                      {note.profiles?.display_name || "Anonymous"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{note.language_name}</Badge>
                    </TableCell>
                    <TableCell>{note.lesson_name || "General"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(note.submitted_at), "MMM d, yyyy")}
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveClick(note)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectClick(note)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approve Voice Note
            </DialogTitle>
            <DialogDescription>
              This will add the voice note to the live lesson content. Are you sure?
            </DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <div className="py-4 space-y-2 text-sm">
              <p><strong>Language:</strong> {selectedNote.language_name}</p>
              <p><strong>Lesson:</strong> {selectedNote.lesson_name || "General"}</p>
              <p><strong>Contributor:</strong> {selectedNote.profiles?.display_name || "Anonymous"}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedNote && approveMutation.mutate(selectedNote.id)}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Voice Note
            </DialogTitle>
            <DialogDescription>
              This will remove the voice note from the pending list and log it for audit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedNote &&
                rejectMutation.mutate({ noteId: selectedNote.id, reason: rejectionReason })
              }
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
