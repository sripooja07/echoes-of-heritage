-- Create enum for voice note status
CREATE TYPE public.voice_note_status AS ENUM ('pending', 'approved', 'rejected');

-- Create voice_notes table for user contributions
CREATE TABLE public.voice_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    language_name TEXT NOT NULL,
    lesson_name TEXT,
    audio_url TEXT NOT NULL,
    transcription TEXT,
    translation TEXT,
    status voice_note_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_activity_logs table for tracking user access
CREATE TABLE public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    section_name TEXT NOT NULL,
    section_type TEXT NOT NULL, -- 'lesson', 'practice', 'quiz', 'profile', 'record', 'voice-generator'
    language_id UUID REFERENCES public.languages(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_action_logs for audit trail
CREATE TABLE public.admin_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL,
    action_type TEXT NOT NULL, -- 'approve_voice_note', 'reject_voice_note'
    target_id UUID NOT NULL, -- voice_note_id
    target_type TEXT NOT NULL, -- 'voice_note'
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;

-- Voice notes policies
-- Users can view their own voice notes
CREATE POLICY "Users can view their own voice notes"
ON public.voice_notes FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own voice notes
CREATE POLICY "Users can insert their own voice notes"
ON public.voice_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all voice notes
CREATE POLICY "Admins can view all voice notes"
ON public.voice_notes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update voice notes (for approval/rejection)
CREATE POLICY "Admins can update voice notes"
ON public.voice_notes FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- User activity logs policies
-- Users can insert their own activity logs
CREATE POLICY "Users can insert their own activity logs"
ON public.user_activity_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_logs FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin action logs policies
-- Only admins can insert action logs
CREATE POLICY "Admins can insert action logs"
ON public.admin_action_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all action logs
CREATE POLICY "Admins can view all action logs"
ON public.admin_action_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better query performance
CREATE INDEX idx_voice_notes_status ON public.voice_notes(status);
CREATE INDEX idx_voice_notes_user_id ON public.voice_notes(user_id);
CREATE INDEX idx_voice_notes_submitted_at ON public.voice_notes(submitted_at DESC);
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_accessed_at ON public.user_activity_logs(accessed_at DESC);
CREATE INDEX idx_user_activity_logs_section_type ON public.user_activity_logs(section_type);
CREATE INDEX idx_admin_action_logs_admin_user_id ON public.admin_action_logs(admin_user_id);

-- Create trigger for updated_at on voice_notes
CREATE TRIGGER update_voice_notes_updated_at
BEFORE UPDATE ON public.voice_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();