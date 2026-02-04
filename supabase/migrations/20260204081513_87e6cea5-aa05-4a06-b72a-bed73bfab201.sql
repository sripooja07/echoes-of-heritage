-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-recordings', 'voice-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own recordings
CREATE POLICY "Users can upload voice recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to voice recordings
CREATE POLICY "Voice recordings are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'voice-recordings');

-- Allow users to delete their own recordings
CREATE POLICY "Users can delete their own recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);