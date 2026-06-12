// Text intelligence: readability stats, slugify, excerpt, keyword extraction.
// Pure functions, English-oriented heuristics, no dependencies.

const WORD_RE = /[A-Za-z0-9'’]+/g;
const SENTENCE_RE = /[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g;

export function words(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

function sentenceCount(text: string): number {
  const m = text.trim().match(SENTENCE_RE);
  return Math.max(1, m ? m.length : 1);
}

/** Rough English syllable count for one word. */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export type TextStats = {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  syllables: number;
  readingTime: string;
  readingTimeSeconds: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gradeLabel: string;
};

export function stats(text: string): TextStats {
  const wl = words(text);
  const wordCount = wl.length;
  const sentences = sentenceCount(text);
  const syl = wl.reduce((sum, w) => sum + syllables(w), 0);

  const wps = wordCount / sentences;
  const spw = wordCount === 0 ? 0 : syl / wordCount;

  const ease = wordCount === 0 ? 0 : +(206.835 - 1.015 * wps - 84.6 * spw).toFixed(1);
  const grade = wordCount === 0 ? 0 : +(0.39 * wps + 11.8 * spw - 15.59).toFixed(1);

  const seconds = Math.round((wordCount / 200) * 60);
  const mins = Math.max(1, Math.round(wordCount / 200));

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: wordCount,
    sentences,
    syllables: syl,
    readingTime: `${mins} min read`,
    readingTimeSeconds: seconds,
    fleschReadingEase: ease,
    fleschKincaidGrade: grade,
    gradeLabel: gradeLabel(ease),
  };
}

function gradeLabel(ease: number): string {
  if (ease >= 90) return 'Very easy (5th grade)';
  if (ease >= 80) return 'Easy (6th grade)';
  if (ease >= 70) return 'Fairly easy (7th grade)';
  if (ease >= 60) return 'Standard (8th–9th grade)';
  if (ease >= 50) return 'Fairly difficult (10th–12th grade)';
  if (ease >= 30) return 'Difficult (college)';
  return 'Very difficult (graduate)';
}

/** URL-safe slug. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/** Sentence-boundary-aware excerpt of at most `maxChars`. */
export function excerpt(text: string, maxChars = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const slice = clean.slice(0, maxChars);
  const lastSentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (lastSentence > maxChars * 0.6) return slice.slice(0, lastSentence + 1).trim();
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + '…';
}

const STOPWORDS = new Set(
  ('a an and are as at be but by for from has have he her his i in is it its of on or that the their' +
    ' this to was were will with you your we they them our not no so if then than too very can just' +
    ' about into over after before more most some such only own same other these those who whom which')
    .split(' '),
);

export type Keyword = { word: string; count: number };

/** Frequency-based keywords with stopwords removed. */
export function keywords(text: string, top = 10): Keyword[] {
  const counts = new Map<string, number>();
  for (const raw of words(text)) {
    const w = raw.toLowerCase().replace(/['’]/g, '');
    if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, Math.min(50, Math.max(1, top)));
}
