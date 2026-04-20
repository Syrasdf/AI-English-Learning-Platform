export interface Example {
  id: number;
  text: string;
  translation: string;
}

export interface Definition {
  id: number;
  pos: string;
  text: string;
  example: Example[];
  translation: string;
}

export interface Verb {
  id: number;
  text: string;
  type: string;
}

export interface Pronunciation {
  pos: string;
  url: string;
  lang: string;
  pron: string;
}

export interface Dict {
  pos: string[];
  word: string;
  verbs: Verb[];
  definition: Definition[];
  pronunciation: Pronunciation[];
}

export interface DictResponse {
  id: string;
  word: string;
  dict: Dict;
}