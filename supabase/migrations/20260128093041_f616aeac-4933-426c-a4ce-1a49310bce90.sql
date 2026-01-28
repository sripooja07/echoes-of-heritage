-- Create languages table
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  example_sentences JSONB DEFAULT '[]'::jsonb,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Languages are publicly readable
CREATE POLICY "Languages are publicly readable"
ON public.languages FOR SELECT
USING (true);

-- Lessons are publicly readable
CREATE POLICY "Lessons are publicly readable"
ON public.lessons FOR SELECT
USING (true);

-- Only admins can manage languages
CREATE POLICY "Admins can manage languages"
ON public.languages FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage lessons
CREATE POLICY "Admins can manage lessons"
ON public.lessons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at on lessons
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample languages
INSERT INTO public.languages (name, native_name, code, description) VALUES
('English', 'English', 'en', 'The global lingua franca, spoken worldwide'),
('Hindi', 'हिन्दी', 'hi', 'One of the most spoken languages in India'),
('Telugu', 'తెలుగు', 'te', 'A Dravidian language spoken in South India');

-- Insert sample lessons for English
INSERT INTO public.lessons (language_id, title, content, example_sentences, difficulty, order_index) VALUES
((SELECT id FROM public.languages WHERE code = 'en'), 'Basic Greetings', 'Learn essential greetings to start conversations. Greetings are the foundation of any language and help you connect with people.', '["Hello, how are you?", "Good morning!", "Nice to meet you.", "How is your day going?"]'::jsonb, 'beginner', 1),
((SELECT id FROM public.languages WHERE code = 'en'), 'Numbers 1-10', 'Master counting from one to ten. Numbers are essential for everyday activities like shopping and telling time.', '["I have two apples.", "There are five students.", "The meeting is at three.", "She is number one!"]'::jsonb, 'beginner', 2),
((SELECT id FROM public.languages WHERE code = 'en'), 'Common Phrases', 'Everyday phrases for daily conversations. These will help you navigate common social situations.', '["Thank you very much!", "Excuse me, where is the station?", "Could you please help me?", "I do not understand."]'::jsonb, 'beginner', 3);

-- Insert sample lessons for Hindi
INSERT INTO public.lessons (language_id, title, content, example_sentences, difficulty, order_index) VALUES
((SELECT id FROM public.languages WHERE code = 'hi'), 'Basic Greetings', 'Learn essential Hindi greetings. Hindi uses "Namaste" as a universal greeting that works in most situations.', '["नमस्ते (Namaste) - Hello", "शुभ प्रभात (Shubh Prabhat) - Good morning", "आप कैसे हैं? (Aap kaise hain?) - How are you?", "धन्यवाद (Dhanyavaad) - Thank you"]'::jsonb, 'beginner', 1),
((SELECT id FROM public.languages WHERE code = 'hi'), 'Numbers 1-10', 'Learn to count in Hindi. Numbers are pronounced differently and have unique characters.', '["एक (Ek) - One", "दो (Do) - Two", "तीन (Teen) - Three", "चार (Char) - Four"]'::jsonb, 'beginner', 2),
((SELECT id FROM public.languages WHERE code = 'hi'), 'Family Words', 'Learn words for family members in Hindi. Family is central to Indian culture.', '["माँ (Maa) - Mother", "पिता (Pita) - Father", "भाई (Bhai) - Brother", "बहन (Behen) - Sister"]'::jsonb, 'beginner', 3);

-- Insert sample lessons for Telugu
INSERT INTO public.lessons (language_id, title, content, example_sentences, difficulty, order_index) VALUES
((SELECT id FROM public.languages WHERE code = 'te'), 'Basic Greetings', 'Learn essential Telugu greetings. Telugu is known for its melodic sound and is often called the "Italian of the East".', '["నమస్కారం (Namaskaram) - Hello", "శుభోదయం (Shubhodayam) - Good morning", "మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?) - How are you?", "ధన్యవాదాలు (Dhanyavaadaalu) - Thank you"]'::jsonb, 'beginner', 1),
((SELECT id FROM public.languages WHERE code = 'te'), 'Numbers 1-10', 'Learn to count in Telugu. Telugu script is beautifully rounded and unique.', '["ఒకటి (Okati) - One", "రెండు (Rendu) - Two", "మూడు (Moodu) - Three", "నాలుగు (Naalugu) - Four"]'::jsonb, 'beginner', 2),
((SELECT id FROM public.languages WHERE code = 'te'), 'Common Words', 'Essential Telugu vocabulary for beginners. These words will help you in everyday situations.', '["నీళ్ళు (Neellu) - Water", "అన్నం (Annam) - Rice/Food", "ఇల్లు (Illu) - House", "పని (Pani) - Work"]'::jsonb, 'beginner', 3);