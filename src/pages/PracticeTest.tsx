import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, 
  XCircle, Trophy, RotateCcw, Home, Clock,
  Award, Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TestQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const testData: Record<string, {
  name: string;
  questions: TestQuestion[];
}> = {
  maori: {
    name: "Māori",
    questions: [
      { id: 1, category: "Pronunciation", question: "How is 'A' pronounced in Māori?", options: ["like 'cat'", "like 'car'", "like 'cape'", "like 'call'"], correct: 1, explanation: "In Māori, 'A' is pronounced as 'ah' like in 'car'." },
      { id: 2, category: "Greetings", question: "What does 'Kia ora' mean?", options: ["Goodbye", "Hello / Thank you", "Welcome", "Sorry"], correct: 1, explanation: "Kia ora is a versatile greeting meaning 'Hello' or 'Thank you'." },
      { id: 3, category: "Greetings", question: "Which greeting is for two people?", options: ["Tēnā koe", "Tēnā kōrua", "Tēnā koutou", "Kia ora"], correct: 1, explanation: "Tēnā kōrua is specifically used when greeting two people." },
      { id: 4, category: "Pronunciation", question: "What sound does 'Wh' make in Māori?", options: ["w sound", "h sound", "f sound", "sh sound"], correct: 2, explanation: "The 'Wh' combination in Māori makes a soft 'f' sound." },
      { id: 5, category: "Vocabulary", question: "What does 'Ka kite' mean?", options: ["Hello", "Welcome", "See you later", "Thank you"], correct: 2, explanation: "Ka kite is a casual farewell meaning 'See you later'." },
      { id: 6, category: "Vocabulary", question: "Which means 'Welcome'?", options: ["Haere rā", "Haere mai", "E noho rā", "Ka kite"], correct: 1, explanation: "Haere mai means 'Welcome' or 'Come here'." },
      { id: 7, category: "Pronunciation", question: "How is 'E' pronounced in Māori?", options: ["like 'bee'", "like 'bed'", "like 'bay'", "silent"], correct: 1, explanation: "The vowel 'E' is pronounced as 'eh' like in 'bed'." },
      { id: 8, category: "Culture", question: "What is 'Whānau'?", options: ["Food", "Family", "House", "Friend"], correct: 1, explanation: "Whānau means family and is a central concept in Māori culture." },
      { id: 9, category: "Greetings", question: "What do you say when leaving someone who is staying?", options: ["Haere rā", "E noho rā", "Ka kite", "Tēnā koe"], correct: 0, explanation: "Haere rā is said to someone who is leaving, while E noho rā is for someone staying." },
      { id: 10, category: "Numbers", question: "How do you count 'one, two, three' in Māori?", options: ["Tahi, rua, toru", "Eka, rua, tahi", "Toru, rua, tahi", "Rua, tahi, toru"], correct: 0, explanation: "The numbers 1-3 in Māori are: Tahi (1), Rua (2), Toru (3)." },
      { id: 11, category: "Grammar", question: "What is a 'Whakataukī'?", options: ["A song", "A dance", "A proverb", "A greeting"], correct: 2, explanation: "Whakataukī are traditional Māori proverbs expressing wisdom." },
      { id: 12, category: "Culture", question: "What is a 'Marae'?", options: ["A food dish", "A meeting ground", "A weapon", "A mountain"], correct: 1, explanation: "A marae is a communal meeting ground central to Māori communities." },
      { id: 13, category: "Vocabulary", question: "What does 'Kai' mean?", options: ["Water", "Sleep", "Food", "Walk"], correct: 2, explanation: "Kai means food in Māori." },
      { id: 14, category: "Grammar", question: "What type of structure does Māori use?", options: ["Subject-Verb-Object", "Verb-Subject-Object", "Object-Subject-Verb", "Free word order"], correct: 1, explanation: "Māori typically uses Verb-Subject-Object sentence structure." },
      { id: 15, category: "Culture", question: "What is a 'Waiata'?", options: ["A story", "A song", "A dance", "A prayer"], correct: 1, explanation: "Waiata are traditional Māori songs used for various purposes." },
    ],
  },
  cherokee: {
    name: "Cherokee",
    questions: [
      { id: 1, category: "History", question: "Who created the Cherokee syllabary?", options: ["Cherokee Nation", "Sequoyah", "European missionaries", "Unknown"], correct: 1, explanation: "Sequoyah created the Cherokee syllabary in the 1820s." },
      { id: 2, category: "Writing", question: "How many vowel sounds are in Cherokee?", options: ["5", "6", "7", "4"], correct: 1, explanation: "Cherokee has 6 vowel sounds: a, e, i, o, u, and v (nasalized)." },
      { id: 3, category: "Writing", question: "What is Ꭰ?", options: ["e sound", "a sound", "i sound", "o sound"], correct: 1, explanation: "Ꭰ represents the 'a' sound (as in 'father')." },
      { id: 4, category: "Greetings", question: "How do you say 'Hello' in Cherokee?", options: ["ᎣᏍᏓ", "ᎣᏏᏲ", "ᏩᏙᏗᎢ", "ᏙᎾᏓᎪᎲ"], correct: 1, explanation: "ᎣᏏᏲ (o-si-yo) means 'Hello' in Cherokee." },
      { id: 5, category: "Vocabulary", question: "What does 'ᏩᏙᏗᎢ' (wa-do) mean?", options: ["Hello", "Goodbye", "Thank you", "How are you?"], correct: 2, explanation: "ᏩᏙᏗᎢ pronounced 'wa-do' means 'Thank you'." },
      { id: 6, category: "Writing", question: "What makes Cherokee writing unique?", options: ["It uses the Latin alphabet", "It's a syllabary (each symbol = syllable)", "It's written right to left", "It has no vowels"], correct: 1, explanation: "Cherokee uses a syllabary where each character represents a syllable, not just a letter." },
      { id: 7, category: "Numbers", question: "What is 'saquu' in Cherokee?", options: ["One", "Five", "Ten", "Zero"], correct: 1, explanation: "Saquu means 'one' in Cherokee." },
      { id: 8, category: "Grammar", question: "Cherokee verbs can express:", options: ["Only action", "Action, tense, and subject", "Only tense", "Only subject"], correct: 1, explanation: "Cherokee verbs are highly complex and can express action, tense, subject, and more." },
      { id: 9, category: "Culture", question: "What is the Cherokee Nation's capital?", options: ["Nashville", "Tahlequah", "Oklahoma City", "Tulsa"], correct: 1, explanation: "Tahlequah, Oklahoma is the capital of the Cherokee Nation." },
      { id: 10, category: "Vocabulary", question: "How do you say 'I am well' in Cherokee?", options: ["ᎣᏏᏲ", "ᎣᏍᏓ", "ᏩᏙᏗᎢ", "ᏙᎾᏓᎪᎲ"], correct: 1, explanation: "ᎣᏍᏓ (o-s-da) means 'I am well' or 'good'." },
      { id: 11, category: "Writing", question: "How many symbols are in the Cherokee syllabary?", options: ["26", "85", "52", "100"], correct: 1, explanation: "The Cherokee syllabary contains 85 characters." },
      { id: 12, category: "Culture", question: "What are the seven clans of Cherokee?", options: ["Family groups", "Political parties", "Geographic regions", "Religious sects"], correct: 0, explanation: "The seven clans are matrilineal family groups fundamental to Cherokee society." },
      { id: 13, category: "History", question: "When was the Cherokee syllabary created?", options: ["1700s", "1820s", "1900s", "1600s"], correct: 1, explanation: "Sequoyah completed the syllabary around 1821." },
      { id: 14, category: "Vocabulary", question: "What does 'ᏙᎾᏓᎪᎲᎢ' mean?", options: ["Thank you", "Goodbye", "How are you?", "I love you"], correct: 2, explanation: "ᏙᎾᏓᎪᎲᎢ (do-na-da-go-hv-i) means 'How are you?'" },
      { id: 15, category: "Culture", question: "What direction has special significance in Cherokee culture?", options: ["North", "South", "East", "West"], correct: 2, explanation: "East, where the sun rises, holds special significance in Cherokee ceremonies." },
    ],
  },
  navajo: {
    name: "Navajo",
    questions: [
      { id: 1, category: "Greetings", question: "How do you greet someone in Navajo?", options: ["Yá'át'ééh", "Ahéhee'", "Hágoónee'", "Shí éí"], correct: 0, explanation: "Yá'át'ééh is the traditional Navajo greeting." },
      { id: 2, category: "Vocabulary", question: "What does 'Ahéhee'' mean?", options: ["Hello", "Thank you", "Goodbye", "Yes"], correct: 1, explanation: "Ahéhee' means 'Thank you' in Navajo." },
      { id: 3, category: "Culture", question: "What are the four sacred mountains?", options: ["Political boundaries", "Ceremonial sites", "Boundaries of Navajo homeland", "Trading posts"], correct: 2, explanation: "The four sacred mountains define the boundaries of Dinétah, the Navajo homeland." },
      { id: 4, category: "Grammar", question: "Navajo is known for its complex:", options: ["Alphabet", "Verb system", "Noun cases", "Punctuation"], correct: 1, explanation: "Navajo has one of the most complex verb systems of any language." },
      { id: 5, category: "History", question: "Navajo Code Talkers served in which war?", options: ["World War I", "World War II", "Vietnam War", "Korean War"], correct: 1, explanation: "Navajo Code Talkers famously served in World War II." },
      { id: 6, category: "Vocabulary", question: "What is 'shi' in Navajo?", options: ["You", "I/me", "They", "We"], correct: 1, explanation: "'Shi' means 'I' or 'me' in Navajo." },
      { id: 7, category: "Pronunciation", question: "What makes Navajo pronunciation challenging?", options: ["It has no vowels", "It uses tones", "It's written backwards", "All words are long"], correct: 1, explanation: "Navajo is a tonal language with high and low tones that change word meanings." },
      { id: 8, category: "Culture", question: "What is a 'hogan'?", options: ["A type of food", "Traditional dwelling", "A ceremony", "A clan name"], correct: 1, explanation: "A hogan is a traditional Navajo dwelling, still used for ceremonies." },
      { id: 9, category: "Numbers", question: "How do you say 'one' in Navajo?", options: ["Tááłá'í", "Naaki", "Táá'", "Dį́į́'"], correct: 0, explanation: "Tááłá'í means 'one' in Navajo." },
      { id: 10, category: "Grammar", question: "In Navajo verbs, the subject is:", options: ["Separate word", "Prefix on the verb", "Suffix on the verb", "Not expressed"], correct: 1, explanation: "In Navajo, subject markers are prefixes attached to the verb." },
      { id: 11, category: "Vocabulary", question: "What does 'Dinétah' mean?", options: ["The people", "The homeland", "The language", "The sky"], correct: 1, explanation: "Dinétah refers to the traditional Navajo homeland." },
      { id: 12, category: "Culture", question: "Who is primarily responsible for weaving in Navajo culture?", options: ["Men only", "Women only", "Both equally", "Children"], correct: 1, explanation: "Traditionally, Navajo weaving is done by women." },
      { id: 13, category: "Vocabulary", question: "What does 'Hágoónee'' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 2, explanation: "Hágoónee' is a way to say 'Goodbye' in Navajo." },
      { id: 14, category: "Grammar", question: "Navajo word order is typically:", options: ["Subject-Object-Verb", "Subject-Verb-Object", "Verb-Subject-Object", "Object-Verb-Subject"], correct: 0, explanation: "Navajo uses Subject-Object-Verb word order." },
      { id: 15, category: "Culture", question: "What direction is associated with white in Navajo culture?", options: ["North", "South", "East", "West"], correct: 2, explanation: "East is associated with the color white in Navajo directional symbolism." },
    ],
  },
  welsh: {
    name: "Welsh",
    questions: [
      { id: 1, category: "Greetings", question: "How do you say 'Hello' informally in Welsh?", options: ["Bore da", "Shwmae", "Nos da", "Diolch"], correct: 1, explanation: "Shwmae is an informal greeting in Welsh." },
      { id: 2, category: "Vocabulary", question: "What does 'Diolch' mean?", options: ["Hello", "Goodbye", "Thank you", "Please"], correct: 2, explanation: "Diolch means 'Thank you' in Welsh." },
      { id: 3, category: "Grammar", question: "What is a 'mutation' in Welsh?", options: ["A spelling mistake", "A change in initial consonant", "A verb tense", "A type of noun"], correct: 1, explanation: "Mutations are systematic changes to initial consonants in certain grammatical contexts." },
      { id: 4, category: "Pronunciation", question: "How is 'LL' pronounced in Welsh?", options: ["Like 'L'", "Like 'Y'", "A voiceless lateral fricative", "Silent"], correct: 2, explanation: "LL is a unique Welsh sound made by placing the tongue against the roof of the mouth and blowing." },
      { id: 5, category: "Vocabulary", question: "What does 'Bore da' mean?", options: ["Good night", "Good morning", "Good afternoon", "Good evening"], correct: 1, explanation: "Bore da means 'Good morning' in Welsh." },
      { id: 6, category: "Grammar", question: "How many types of mutations are there in Welsh?", options: ["One", "Two", "Three", "Four"], correct: 2, explanation: "Welsh has three types of mutations: soft, nasal, and aspirate." },
      { id: 7, category: "Culture", question: "What is an 'Eisteddfod'?", options: ["A type of food", "A festival of literature and music", "A type of house", "A mountain"], correct: 1, explanation: "An Eisteddfod is a Welsh festival celebrating literature, music, and poetry." },
      { id: 8, category: "Vocabulary", question: "What does 'Cymru' mean?", options: ["England", "Wales", "Scotland", "Ireland"], correct: 1, explanation: "Cymru is the Welsh name for Wales." },
      { id: 9, category: "Pronunciation", question: "How is 'DD' pronounced in Welsh?", options: ["Like 'D'", "Like 'TH' in 'the'", "Like 'T'", "Silent"], correct: 1, explanation: "DD is pronounced like the 'th' in 'the' (voiced dental fricative)." },
      { id: 10, category: "Numbers", question: "How do you say 'one' in Welsh?", options: ["Dau", "Un", "Tri", "Pedwar"], correct: 1, explanation: "Un means 'one' in Welsh." },
      { id: 11, category: "Vocabulary", question: "What does 'Nos da' mean?", options: ["Good morning", "Good night", "Good afternoon", "Goodbye"], correct: 1, explanation: "Nos da means 'Good night' in Welsh." },
      { id: 12, category: "Grammar", question: "Welsh adjectives typically come:", options: ["Before the noun", "After the noun", "Either position", "They don't exist"], correct: 1, explanation: "In Welsh, adjectives usually come after the noun they describe." },
      { id: 13, category: "Culture", question: "What is 'Cynghanedd'?", options: ["A food", "A poetic meter system", "A dance", "A holiday"], correct: 1, explanation: "Cynghanedd is a complex system of poetic meters unique to Welsh poetry." },
      { id: 14, category: "Vocabulary", question: "What is 'Cymraeg'?", options: ["The Welsh flag", "The Welsh language", "A Welsh person", "A Welsh town"], correct: 1, explanation: "Cymraeg is the Welsh word for the Welsh language itself." },
      { id: 15, category: "History", question: "Approximately how many people speak Welsh?", options: ["50,000", "250,000", "750,000", "2 million"], correct: 2, explanation: "Approximately 750,000 people speak Welsh, about 20% of the Welsh population." },
    ],
  },
  hawaiian: {
    name: "Hawaiian",
    questions: [
      { id: 1, category: "Greetings", question: "What does 'Aloha' mean?", options: ["Only hello", "Only love", "Hello, love, and goodbye", "Only goodbye"], correct: 2, explanation: "Aloha is a versatile word meaning hello, goodbye, and love." },
      { id: 2, category: "Pronunciation", question: "What is an 'okina in Hawaiian?", options: ["A vowel", "A consonant (glottal stop)", "A punctuation mark", "An accent mark"], correct: 1, explanation: "The 'okina is a glottal stop, considered a consonant in Hawaiian." },
      { id: 3, category: "Vocabulary", question: "What does 'Mahalo' mean?", options: ["Hello", "Goodbye", "Thank you", "Please"], correct: 2, explanation: "Mahalo means 'Thank you' in Hawaiian." },
      { id: 4, category: "Vocabulary", question: "What is 'ʻOhana'?", options: ["Home", "Family", "Love", "Food"], correct: 1, explanation: "'Ohana means family, a core concept in Hawaiian culture." },
      { id: 5, category: "Pronunciation", question: "How many consonants are in the Hawaiian alphabet?", options: ["5", "8", "12", "21"], correct: 1, explanation: "Hawaiian has only 8 consonants (h, k, l, m, n, p, w, and the 'okina)." },
      { id: 6, category: "Vocabulary", question: "What does 'Makai' mean?", options: ["Mountain", "Toward the sea", "Home", "Sky"], correct: 1, explanation: "Makai means 'toward the sea' and is used for directions." },
      { id: 7, category: "Vocabulary", question: "What is 'Mauka'?", options: ["Toward the sea", "Toward the mountain", "East", "West"], correct: 1, explanation: "Mauka means 'toward the mountain' - the opposite of makai." },
      { id: 8, category: "Culture", question: "What is a 'Luau'?", options: ["A type of fish", "A traditional feast", "A song", "A dance"], correct: 1, explanation: "A luau is a traditional Hawaiian feast or party." },
      { id: 9, category: "Vocabulary", question: "What does 'Ono' mean?", options: ["Number one", "Delicious", "Beautiful", "Happy"], correct: 1, explanation: "'Ono means delicious in Hawaiian." },
      { id: 10, category: "Culture", question: "What is 'Hula'?", options: ["A type of food", "A traditional dance", "A greeting", "A prayer"], correct: 1, explanation: "Hula is the traditional dance of Hawaii, telling stories through movement." },
      { id: 11, category: "Vocabulary", question: "What does 'Keiki' mean?", options: ["Elder", "Child", "Friend", "Parent"], correct: 1, explanation: "Keiki means child or children in Hawaiian." },
      { id: 12, category: "Numbers", question: "How do you say 'one' in Hawaiian?", options: ["'Ekahi", "'Elua", "'Ekolu", "'Ehā"], correct: 0, explanation: "'Ekahi means 'one' in Hawaiian." },
      { id: 13, category: "Vocabulary", question: "What does 'Pau' mean?", options: ["Start", "Finished/done", "Hungry", "Tired"], correct: 1, explanation: "Pau means finished or done in Hawaiian." },
      { id: 14, category: "Culture", question: "What is a 'Mele'?", options: ["A flower", "A song or chant", "A canoe", "A lei"], correct: 1, explanation: "Mele is a Hawaiian song or chant, often accompanying hula." },
      { id: 15, category: "History", question: "When was Hawaiian language nearly extinct?", options: ["1800s", "1950s-1980s", "Never", "2000s"], correct: 1, explanation: "Hawaiian nearly went extinct in the mid-20th century before revitalization efforts." },
    ],
  },
  basque: {
    name: "Basque",
    questions: [
      { id: 1, category: "Greetings", question: "How do you say 'Hello' in Basque?", options: ["Adio", "Kaixo", "Eskerrik", "Bai"], correct: 1, explanation: "Kaixo is the standard greeting in Basque." },
      { id: 2, category: "Vocabulary", question: "What does 'Eskerrik asko' mean?", options: ["Hello", "Goodbye", "Thank you very much", "Please"], correct: 2, explanation: "Eskerrik asko means 'Thank you very much' in Basque." },
      { id: 3, category: "Grammar", question: "What is unique about Basque as a language?", options: ["It has no vowels", "It has no known relatives (language isolate)", "It's the oldest language", "It uses pictographs"], correct: 1, explanation: "Basque is a language isolate with no known relatives." },
      { id: 4, category: "Grammar", question: "What is the 'ergative case' in Basque?", options: ["Subject of transitive verb", "Object of any verb", "Subject of intransitive verb", "Possessive case"], correct: 0, explanation: "In ergative languages like Basque, the ergative case marks the subject of transitive verbs." },
      { id: 5, category: "Vocabulary", question: "What does 'Agur' mean?", options: ["Hello", "Goodbye", "Thank you", "Please"], correct: 1, explanation: "Agur means 'Goodbye' in Basque." },
      { id: 6, category: "Geography", question: "Where is Basque Country located?", options: ["France only", "Spain only", "Border of France and Spain", "Portugal"], correct: 2, explanation: "The Basque Country straddles the border between Spain and France." },
      { id: 7, category: "Vocabulary", question: "What is 'Euskara'?", options: ["A food", "The Basque language", "A city", "A festival"], correct: 1, explanation: "Euskara is the Basque name for the Basque language." },
      { id: 8, category: "Numbers", question: "What is 'bat' in Basque?", options: ["Two", "One", "Three", "Zero"], correct: 1, explanation: "Bat means 'one' in Basque." },
      { id: 9, category: "Grammar", question: "Basque verbs agree with:", options: ["Only subject", "Subject and object", "Only object", "Neither"], correct: 1, explanation: "Basque verbs agree with both subject and object (polypersonal agreement)." },
      { id: 10, category: "Vocabulary", question: "What does 'Bai' mean?", options: ["No", "Yes", "Maybe", "Please"], correct: 1, explanation: "Bai means 'Yes' in Basque." },
      { id: 11, category: "Culture", question: "What is 'Bertsolaritza'?", options: ["A dance", "Improvised verse singing", "A sport", "A food"], correct: 1, explanation: "Bertsolaritza is the Basque tradition of improvised verse singing." },
      { id: 12, category: "Vocabulary", question: "What does 'Ez' mean?", options: ["Yes", "No", "Maybe", "Please"], correct: 1, explanation: "Ez means 'No' in Basque." },
      { id: 13, category: "History", question: "How many Basque speakers are there approximately?", options: ["50,000", "250,000", "750,000", "2 million"], correct: 2, explanation: "There are approximately 750,000 Basque speakers." },
      { id: 14, category: "Grammar", question: "Basque is described as:", options: ["Subject-Verb-Object", "Verb-Subject-Object", "Subject-Object-Verb", "Free word order"], correct: 2, explanation: "Basque follows a Subject-Object-Verb word order." },
      { id: 15, category: "Culture", question: "What is 'Jai alai'?", options: ["A dance", "A traditional sport", "A song", "A food"], correct: 1, explanation: "Jai alai is a traditional Basque ball sport, one of the fastest ball games in the world." },
    ],
  },
  // Asian Languages
  ainu: {
    name: "Ainu",
    questions: [
      { id: 1, category: "Greetings", question: "How do you say 'Hello' in Ainu?", options: ["Irankarapte", "Suy unukar an ro", "Iyayraykere", "Pirka"], correct: 0, explanation: "Irankarapte means 'Hello' in Ainu." },
      { id: 2, category: "Culture", question: "What are 'Kamuy' in Ainu belief?", options: ["Ancestors", "Spirits/Gods", "Chiefs", "Animals"], correct: 1, explanation: "Kamuy are divine spirits or gods in Ainu spirituality." },
      { id: 3, category: "Vocabulary", question: "What does 'Iyayraykere' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 1, explanation: "Iyayraykere means 'Thank you' in Ainu." },
      { id: 4, category: "Culture", question: "What is 'Yukar'?", options: ["A dance", "Epic poetry/songs", "A food", "A house"], correct: 1, explanation: "Yukar are traditional Ainu epic poems and heroic sagas." },
      { id: 5, category: "Vocabulary", question: "What does 'Pirka' mean?", options: ["Bad", "Good/Beautiful", "Big", "Small"], correct: 1, explanation: "Pirka means 'good' or 'beautiful' in Ainu." },
      { id: 6, category: "Geography", question: "Where is Ainu traditionally spoken?", options: ["Korea", "Hokkaido, Japan", "Taiwan", "Mongolia"], correct: 1, explanation: "Ainu is traditionally spoken in Hokkaido and surrounding islands." },
      { id: 7, category: "Culture", question: "What is 'Iomante'?", options: ["A greeting", "Bear spirit ceremony", "A song", "A mountain"], correct: 1, explanation: "Iomante is the sacred bear spirit sending ceremony." },
      { id: 8, category: "Grammar", question: "Ainu word order is typically:", options: ["SVO", "SOV", "VSO", "Free"], correct: 1, explanation: "Ainu follows Subject-Object-Verb word order." },
      { id: 9, category: "Vocabulary", question: "What is 'cise' in Ainu?", options: ["Fire", "House", "Water", "Sky"], correct: 1, explanation: "Cise means 'house' in Ainu." },
      { id: 10, category: "History", question: "Approximately how many Ainu speakers remain?", options: ["10,000", "1,000", "Under 10", "100"], correct: 2, explanation: "Tragically, there are fewer than 10 fluent native speakers of Ainu." },
      { id: 11, category: "Vocabulary", question: "What does 'ape' mean in Ainu?", options: ["Water", "Fire", "Earth", "Wind"], correct: 1, explanation: "Ape means 'fire' in Ainu." },
      { id: 12, category: "Culture", question: "What is 'Upopo'?", options: ["A greeting", "Traditional group songs", "A ceremony", "Food"], correct: 1, explanation: "Upopo are traditional Ainu group songs." },
      { id: 13, category: "Vocabulary", question: "What is 'wakka' in Ainu?", options: ["Fire", "House", "Water", "Mountain"], correct: 2, explanation: "Wakka means 'water' in Ainu." },
      { id: 14, category: "Grammar", question: "Ainu is considered:", options: ["A language isolate", "A Japonic language", "An Altaic language", "A Sino-Tibetan language"], correct: 0, explanation: "Ainu is a language isolate with no proven relatives." },
      { id: 15, category: "Culture", question: "What is the Ainu word for 'human/person'?", options: ["Kamuy", "Ainu", "Cise", "Kotan"], correct: 1, explanation: "The word 'Ainu' itself means 'human' or 'person'." },
    ],
  },
  tibetan: {
    name: "Tibetan",
    questions: [
      { id: 1, category: "Greetings", question: "How do you greet someone in Tibetan?", options: ["Tashi delek", "Namaste", "Ni hao", "Annyeong"], correct: 0, explanation: "Tashi delek is the traditional Tibetan greeting meaning 'good fortune'." },
      { id: 2, category: "Writing", question: "What is the Tibetan script called?", options: ["Devanagari", "Uchen", "Hangul", "Kanji"], correct: 1, explanation: "The formal Tibetan script is called Uchen (headed script)." },
      { id: 3, category: "Vocabulary", question: "What does 'Thuk je che' mean?", options: ["Hello", "Thank you", "Goodbye", "Sorry"], correct: 1, explanation: "Thuk je che means 'Thank you' in Tibetan." },
      { id: 4, category: "Culture", question: "What is a 'Lama'?", options: ["A animal", "A spiritual teacher", "A food", "A mountain"], correct: 1, explanation: "A Lama is a Tibetan Buddhist spiritual teacher or master." },
      { id: 5, category: "Geography", question: "Tibet is often called:", options: ["The Valley of Kings", "The Roof of the World", "The Land of the Rising Sun", "The Middle Kingdom"], correct: 1, explanation: "Tibet is called 'The Roof of the World' due to its high altitude." },
      { id: 6, category: "Vocabulary", question: "What does 'Bod' mean?", options: ["Mountain", "Tibet", "Buddha", "Temple"], correct: 1, explanation: "Bod is the Tibetan name for Tibet." },
      { id: 7, category: "Grammar", question: "Tibetan word order is:", options: ["SVO", "SOV", "VSO", "OVS"], correct: 1, explanation: "Tibetan follows Subject-Object-Verb word order." },
      { id: 8, category: "Culture", question: "What is 'Om mani padme hum'?", options: ["A greeting", "A famous mantra", "A goodbye", "A name"], correct: 1, explanation: "It's the most famous Buddhist mantra, associated with compassion." },
      { id: 9, category: "Writing", question: "How many consonants are in the Tibetan alphabet?", options: ["26", "30", "40", "50"], correct: 1, explanation: "The Tibetan alphabet has 30 consonants." },
      { id: 10, category: "Vocabulary", question: "What is 'ri' in Tibetan?", options: ["River", "Mountain", "Sky", "Earth"], correct: 1, explanation: "Ri means 'mountain' in Tibetan." },
      { id: 11, category: "Culture", question: "What is a 'Thangka'?", options: ["A hat", "A Buddhist painting", "A prayer wheel", "A temple"], correct: 1, explanation: "A Thangka is a traditional Tibetan Buddhist painting on cloth." },
      { id: 12, category: "Vocabulary", question: "What does 'Kale phe' mean?", options: ["Thank you", "Hello", "Goodbye", "Please"], correct: 2, explanation: "Kale phe means 'Goodbye' (go slowly) in Tibetan." },
      { id: 13, category: "Numbers", question: "How do you say 'one' in Tibetan?", options: ["Chig", "Nyi", "Sum", "Shi"], correct: 0, explanation: "Chig means 'one' in Tibetan." },
      { id: 14, category: "Culture", question: "What is 'Losar'?", options: ["A food", "Tibetan New Year", "A dance", "A temple"], correct: 1, explanation: "Losar is the Tibetan New Year celebration." },
      { id: 15, category: "Vocabulary", question: "What is 'cho' in Tibetan?", options: ["Water", "Dharma/Religion", "Food", "House"], correct: 1, explanation: "Cho (or Chos) means 'Dharma' or 'religion' in Tibetan." },
    ],
  },
  odia: {
    name: "Odia",
    questions: [
      { id: 1, category: "Greetings", question: "How do you greet someone in Odia?", options: ["Namaskar", "Vanakkam", "Sat Sri Akal", "Khamma Ghani"], correct: 0, explanation: "Namaskar is the common greeting in Odia." },
      { id: 2, category: "Writing", question: "The Odia script is known for its:", options: ["Angular letters", "Curved/Round letters", "Pictographs", "No written form"], correct: 1, explanation: "Odia script is famous for its distinctive curved, rounded letters." },
      { id: 3, category: "Vocabulary", question: "What does 'Dhanyabad' mean?", options: ["Hello", "Thank you", "Goodbye", "Sorry"], correct: 1, explanation: "Dhanyabad means 'Thank you' in Odia." },
      { id: 4, category: "Geography", question: "Odia is the official language of which state?", options: ["Kerala", "Odisha", "Bihar", "Gujarat"], correct: 1, explanation: "Odia is the official language of Odisha state in eastern India." },
      { id: 5, category: "Culture", question: "What is 'Rath Yatra'?", options: ["A dance", "Chariot festival", "A food", "A song"], correct: 1, explanation: "Rath Yatra is the famous chariot festival of Lord Jagannath in Puri, Odisha." },
      { id: 6, category: "History", question: "When was Odia recognized as a classical language?", options: ["2004", "2010", "2014", "2018"], correct: 2, explanation: "Odia was recognized as a classical language of India in 2014." },
      { id: 7, category: "Vocabulary", question: "What does 'Bhala' mean?", options: ["Bad", "Good", "Big", "Small"], correct: 1, explanation: "Bhala means 'good' in Odia." },
      { id: 8, category: "Culture", question: "Who was Sarala Das?", options: ["A king", "A poet who wrote Odia Mahabharata", "A dancer", "A musician"], correct: 1, explanation: "Sarala Das was the poet who wrote the first major Odia literary work, the Odia Mahabharata." },
      { id: 9, category: "Numbers", question: "How do you say 'one' in Odia?", options: ["Eka", "Dui", "Tini", "Chari"], correct: 0, explanation: "Eka means 'one' in Odia." },
      { id: 10, category: "Vocabulary", question: "What is 'Pani' in Odia?", options: ["Fire", "Water", "Air", "Earth"], correct: 1, explanation: "Pani means 'water' in Odia." },
      { id: 11, category: "Grammar", question: "Odia word order is typically:", options: ["SVO", "SOV", "VSO", "VOS"], correct: 1, explanation: "Odia follows Subject-Object-Verb word order." },
      { id: 12, category: "Culture", question: "What is 'Odissi'?", options: ["A food", "Classical dance form", "A festival", "A script"], correct: 1, explanation: "Odissi is one of India's eight classical dance forms originating from Odisha." },
      { id: 13, category: "Vocabulary", question: "How do you say 'Goodbye' in Odia?", options: ["Namaskar", "Ashi", "Dhanyabad", "Bhala"], correct: 1, explanation: "Ashi (meaning 'I'm going') is used for goodbye in Odia." },
      { id: 14, category: "History", question: "How many speakers does Odia have?", options: ["5 million", "15 million", "35 million", "50 million"], correct: 2, explanation: "Odia has approximately 35 million native speakers." },
      { id: 15, category: "Culture", question: "What is 'Puri' famous for?", options: ["Mountains", "Jagannath Temple", "Forests", "Rivers"], correct: 1, explanation: "Puri is famous for the Jagannath Temple, one of the four sacred dhams." },
    ],
  },
  buryat: {
    name: "Buryat",
    questions: [
      { id: 1, category: "Greetings", question: "How do you say 'Hello' in Buryat?", options: ["Sain baina uu", "Zdravstvuyte", "Ni hao", "Annyeong"], correct: 0, explanation: "Sain baina uu is the common Buryat greeting." },
      { id: 2, category: "Geography", question: "Where is Buryat traditionally spoken?", options: ["China", "Siberia, Russia", "Kazakhstan", "Korea"], correct: 1, explanation: "Buryat is spoken in the Buryatia republic of Siberia, Russia." },
      { id: 3, category: "Vocabulary", question: "What does 'Bayarlalaa' mean?", options: ["Hello", "Thank you", "Goodbye", "Sorry"], correct: 1, explanation: "Bayarlalaa means 'Thank you' in Buryat." },
      { id: 4, category: "Language Family", question: "Buryat belongs to which language family?", options: ["Slavic", "Mongolic", "Turkic", "Indo-European"], correct: 1, explanation: "Buryat is a Mongolic language, closely related to Mongolian." },
      { id: 5, category: "Culture", question: "What is a 'yurt' called in Buryat?", options: ["Ger", "Cise", "Hogan", "Igloo"], correct: 0, explanation: "The traditional dwelling is called a Ger in Mongolic languages." },
      { id: 6, category: "Writing", question: "Which script is used for Buryat today?", options: ["Latin", "Cyrillic", "Mongolian vertical", "Arabic"], correct: 1, explanation: "Modern Buryat uses the Cyrillic alphabet." },
      { id: 7, category: "Grammar", question: "Buryat is an example of what type of language?", options: ["Isolating", "Agglutinative", "Fusional", "Polysynthetic"], correct: 1, explanation: "Buryat is agglutinative, adding suffixes to form words." },
      { id: 8, category: "Culture", question: "What is the 'Geser Epic'?", options: ["A dance", "A heroic saga", "A food", "A mountain"], correct: 1, explanation: "The Geser Epic is a major heroic saga in Buryat oral literature." },
      { id: 9, category: "Vocabulary", question: "What is 'morin' in Buryat?", options: ["Cow", "Horse", "Sheep", "Dog"], correct: 1, explanation: "Morin means 'horse' in Buryat." },
      { id: 10, category: "Numbers", question: "How do you say 'one' in Buryat?", options: ["Neg", "Hoyor", "Gurban", "Dorbon"], correct: 0, explanation: "Neg means 'one' in Buryat." },
      { id: 11, category: "Culture", question: "What spiritual tradition is common among Buryats?", options: ["Confucianism", "Shamanism and Buddhism", "Hinduism", "Christianity"], correct: 1, explanation: "Buryats practice both shamanism and Tibetan Buddhism." },
      { id: 12, category: "Grammar", question: "Buryat word order is:", options: ["SVO", "SOV", "VSO", "VOS"], correct: 1, explanation: "Buryat follows Subject-Object-Verb word order." },
      { id: 13, category: "Vocabulary", question: "What does 'naran' mean?", options: ["Moon", "Star", "Sun", "Sky"], correct: 2, explanation: "Naran means 'sun' in Buryat." },
      { id: 14, category: "History", question: "How many Buryat speakers are there?", options: ["10,000", "100,000", "265,000", "1 million"], correct: 2, explanation: "There are approximately 265,000 Buryat speakers." },
      { id: 15, category: "Culture", question: "What is 'Sagaalgan'?", options: ["A food", "White Month / New Year", "A dance", "A song"], correct: 1, explanation: "Sagaalgan is the Buryat New Year celebration (White Month)." },
    ],
  },
  khmer: {
    name: "Khmer",
    questions: [
      { id: 1, category: "Greetings", question: "How do you greet someone in Khmer?", options: ["Chom reap suor", "Sawatdee", "Xin chao", "Mingalaba"], correct: 0, explanation: "Chom reap suor is the formal Khmer greeting." },
      { id: 2, category: "Geography", question: "Khmer is the official language of:", options: ["Thailand", "Cambodia", "Laos", "Vietnam"], correct: 1, explanation: "Khmer is the official language of Cambodia." },
      { id: 3, category: "Vocabulary", question: "What does 'Arkun' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 1, explanation: "Arkun means 'Thank you' in Khmer." },
      { id: 4, category: "Writing", question: "The Khmer script descended from:", options: ["Chinese", "Indian Brahmi", "Arabic", "Greek"], correct: 1, explanation: "Khmer script evolved from the Brahmi script of ancient India." },
      { id: 5, category: "Culture", question: "What is Angkor Wat?", options: ["A dance", "Ancient temple complex", "A food", "A river"], correct: 1, explanation: "Angkor Wat is the famous ancient temple complex in Cambodia." },
      { id: 6, category: "Grammar", question: "Khmer word order is:", options: ["SOV", "SVO", "VSO", "OVS"], correct: 1, explanation: "Khmer follows Subject-Verb-Object word order." },
      { id: 7, category: "Writing", question: "How many consonant symbols are in Khmer?", options: ["26", "33", "44", "51"], correct: 1, explanation: "Khmer has 33 consonant symbols." },
      { id: 8, category: "Vocabulary", question: "What does 'Suor sdei' mean?", options: ["Thank you", "Hello (informal)", "Goodbye", "Sorry"], correct: 1, explanation: "Suor sdei is an informal way to say 'Hello' in Khmer." },
      { id: 9, category: "Culture", question: "What is 'Apsara'?", options: ["A food", "Celestial dancer", "A temple", "A king"], correct: 1, explanation: "Apsara are celestial dancers depicted in Khmer art and dance." },
      { id: 10, category: "Numbers", question: "How do you say 'one' in Khmer?", options: ["Muoy", "Pi", "Bei", "Buon"], correct: 0, explanation: "Muoy means 'one' in Khmer." },
      { id: 11, category: "Grammar", question: "Khmer is notable for not having:", options: ["Vowels", "Consonants", "Verb conjugations", "Nouns"], correct: 2, explanation: "Khmer verbs don't conjugate for tense, person, or number." },
      { id: 12, category: "Culture", question: "What is 'Reamker'?", options: ["A greeting", "Khmer Ramayana", "A food", "A dance"], correct: 1, explanation: "Reamker is the Cambodian version of the Ramayana epic." },
      { id: 13, category: "Vocabulary", question: "What does 'Lia suhn hao-y' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 2, explanation: "Lia suhn hao-y means 'Goodbye' in Khmer." },
      { id: 14, category: "History", question: "How many people speak Khmer?", options: ["1 million", "8 million", "16 million", "30 million"], correct: 2, explanation: "Approximately 16 million people speak Khmer." },
      { id: 15, category: "Culture", question: "What is 'Bon Om Touk'?", options: ["A temple", "Water Festival", "A food", "A greeting"], correct: 1, explanation: "Bon Om Touk is Cambodia's famous Water Festival." },
    ],
  },
  dzongkha: {
    name: "Dzongkha",
    questions: [
      { id: 1, category: "Greetings", question: "How do you say 'Hello' in Dzongkha?", options: ["Kuzu zangpo la", "Tashi delek", "Namaste", "Sawatdee"], correct: 0, explanation: "Kuzu zangpo la is the standard greeting in Dzongkha." },
      { id: 2, category: "Geography", question: "Dzongkha is the national language of:", options: ["Nepal", "Bhutan", "Tibet", "Sikkim"], correct: 1, explanation: "Dzongkha is the national language of Bhutan." },
      { id: 3, category: "Vocabulary", question: "What does 'Kadrin chhe la' mean?", options: ["Hello", "Thank you", "Goodbye", "Sorry"], correct: 1, explanation: "Kadrin chhe la means 'Thank you' in Dzongkha." },
      { id: 4, category: "Writing", question: "Dzongkha script is based on:", options: ["Devanagari", "Tibetan script", "Chinese", "Korean"], correct: 1, explanation: "Dzongkha uses a script derived from Classical Tibetan." },
      { id: 5, category: "Culture", question: "What is a 'Dzong'?", options: ["A dance", "A fortress/monastery", "A food", "A song"], correct: 1, explanation: "A Dzong is a distinctive fortress-monastery in Bhutan." },
      { id: 6, category: "Vocabulary", question: "What does 'Druk' mean?", options: ["Mountain", "Thunder Dragon", "River", "Temple"], correct: 1, explanation: "Druk means 'Thunder Dragon', Bhutan's national symbol." },
      { id: 7, category: "Culture", question: "What is 'Gross National Happiness'?", options: ["A dance", "Bhutan's development philosophy", "A festival", "A food"], correct: 1, explanation: "GNH is Bhutan's unique holistic development philosophy." },
      { id: 8, category: "Numbers", question: "How do you say 'one' in Dzongkha?", options: ["Ci", "Nyi", "Sum", "Zhi"], correct: 0, explanation: "Ci means 'one' in Dzongkha." },
      { id: 9, category: "Grammar", question: "Dzongkha word order is:", options: ["SVO", "SOV", "VSO", "VOS"], correct: 1, explanation: "Dzongkha follows Subject-Object-Verb word order." },
      { id: 10, category: "Culture", question: "What is 'Gho' in Bhutanese culture?", options: ["A dance", "Traditional male dress", "A food", "A festival"], correct: 1, explanation: "Gho is the traditional dress worn by Bhutanese men." },
      { id: 11, category: "Vocabulary", question: "What is the meaning of 'Log jay ge'?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 2, explanation: "Log jay ge means 'Goodbye' in Dzongkha." },
      { id: 12, category: "Culture", question: "What is 'Tshechu'?", options: ["A dance festival", "A food", "A mountain", "A river"], correct: 0, explanation: "Tshechu is a religious festival featuring masked dances." },
      { id: 13, category: "Language", question: "Dzongkha belongs to which language family?", options: ["Indo-European", "Sino-Tibetan", "Mongolic", "Austroasiatic"], correct: 1, explanation: "Dzongkha belongs to the Sino-Tibetan language family." },
      { id: 14, category: "Culture", question: "What is 'Kira'?", options: ["A dance", "Traditional female dress", "A temple", "A song"], correct: 1, explanation: "Kira is the traditional dress worn by Bhutanese women." },
      { id: 15, category: "History", question: "How many people speak Dzongkha?", options: ["100,000", "300,000", "640,000", "1 million"], correct: 2, explanation: "Approximately 640,000 people speak Dzongkha." },
    ],
  },
};

const PracticeTest = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean; selected: number }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes

  const test = languageId ? testData[languageId] : null;

  const handleStartTest = () => {
    setTestStarted(true);
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !test) return;
    
    setSelectedAnswer(index);
    const correct = index === test.questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setAnswers([...answers, {
      questionId: test.questions[currentQuestion].id,
      correct,
      selected: index,
    }]);
  };

  const handleNextQuestion = () => {
    if (!test) return;
    
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", label: "Excellent!", color: "text-green-500" };
    if (percentage >= 80) return { grade: "A", label: "Great job!", color: "text-green-400" };
    if (percentage >= 70) return { grade: "B", label: "Good work!", color: "text-blue-500" };
    if (percentage >= 60) return { grade: "C", label: "Keep practicing!", color: "text-yellow-500" };
    return { grade: "D", label: "More study needed", color: "text-red-500" };
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-24">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-bold mb-4">Test Not Found</h1>
            <p className="text-muted-foreground mb-8">This practice test is not yet available.</p>
            <Button asChild>
              <Link to="/learn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Languages
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Start Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-purple-500" />
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {test.name} Practice Test
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Test your knowledge with {test.questions.length} comprehensive questions 
                covering all levels of {test.name} learning.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary">{test.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary">70%</div>
                  <div className="text-sm text-muted-foreground">To Pass</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="hero" size="xl" onClick={handleStartTest} className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  Start Test
                </Button>
                <Button variant="ghost" asChild>
                  <Link to={`/learn/${languageId}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const percentage = Math.round((score / test.questions.length) * 100);
    const gradeInfo = getGrade(percentage);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-8 text-center mb-8">
                <div className={`w-24 h-24 rounded-full ${passed ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center mx-auto mb-6`}>
                  {passed ? (
                    <Award className="w-12 h-12 text-green-500" />
                  ) : (
                    <RotateCcw className="w-12 h-12 text-red-500" />
                  )}
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                </h1>
                
                <p className="text-muted-foreground mb-6">
                  {passed 
                    ? `You've demonstrated strong ${test.name} language skills!`
                    : `You need 70% to pass. Review the lessons and try again.`
                  }
                </p>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <div>
                    <div className={`text-6xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                    <div className="text-sm text-muted-foreground">{gradeInfo.label}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-4xl font-bold">{score}/{test.questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions Correct</div>
                    <div className="text-2xl font-semibold text-primary mt-1">{percentage}%</div>
                  </div>
                </div>

                <Progress value={percentage} className="h-4 mb-8" />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setSelectedAnswer(null);
                      setIsCorrect(null);
                      setScore(0);
                      setAnswers([]);
                      setShowResults(false);
                      setTestStarted(false);
                      setTimeRemaining(45 * 60);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Test
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to={`/learn/${languageId}`}>
                      <Home className="w-4 h-4 mr-2" />
                      Back to Course
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Question Review */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-4">Question Review</h2>
                <div className="space-y-3">
                  {test.questions.map((q, idx) => {
                    const answer = answers[idx];
                    return (
                      <div 
                        key={q.id}
                        className={`p-4 rounded-xl ${
                          answer?.correct 
                            ? 'bg-green-500/10 border border-green-500/30' 
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            answer?.correct ? 'bg-green-500' : 'bg-red-500'
                          } text-white`}>
                            {answer?.correct ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">{q.category}</Badge>
                            <p className="font-medium mb-1">{q.question}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="text-green-500">Correct: {q.options[q.correct]}</span>
                              {!answer?.correct && (
                                <span className="text-red-500 ml-3">
                                  Your answer: {q.options[answer?.selected || 0]}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 italic">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Question Screen
  const question = test.questions[currentQuestion];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/learn/${languageId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Test
              </Link>
            </Button>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>{test.name} Practice Test</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className={timeRemaining < 300 ? 'text-red-500 font-bold' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / test.questions.length) * 100} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge>{question.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {test.questions.length}
                </span>
              </div>
              
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
                {question.question}
              </h2>

              <div className="space-y-3 mb-8">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedAnswer === null
                        ? "bg-secondary/50 hover:bg-secondary"
                        : selectedAnswer === index
                        ? isCorrect
                          ? "bg-green-500/20 border-2 border-green-500"
                          : "bg-destructive/20 border-2 border-destructive"
                        : index === question.correct && selectedAnswer !== null
                        ? "bg-green-500/20 border-2 border-green-500"
                        : "bg-secondary/30 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium flex-1">{option}</span>
                      {selectedAnswer !== null && index === question.correct && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {selectedAnswer === index && !isCorrect && (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedAnswer !== null && (
                <div className="mb-6 p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Explanation: </span>
                    {question.explanation}
                  </p>
                </div>
              )}

              {selectedAnswer !== null && (
                <Button variant="hero" onClick={handleNextQuestion} className="w-full">
                  {currentQuestion === test.questions.length - 1 ? "View Results" : "Next Question"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeTest;