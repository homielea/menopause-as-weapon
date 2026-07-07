// Dark-first, validating, a little fierce. No pastels, no pink, no
// lavender anywhere. The signature surface: paper-white receipt cards with
// mono type sitting on warm charcoal — her evidence, printed.

import { TextStyle } from 'react-native';

export const colors = {
  bg: '#181512', // warm charcoal
  panel: '#221E1A',
  border: '#3A342D',
  text: '#EDE6DA', // bone
  soft: '#A79C8D',
  ember: '#B34523', // the fierce accent — burnt ember (fills; 5.2:1 under bone labels)
  emberText: '#DD7A55', // ember as TEXT on charcoal — 6.1:1; raw ember reads only 3.9:1
  emberDeep: '#7E3320',
  paper: '#F8F5EE', // receipt paper
  paperInk: '#26221C',
  paperSoft: '#6F675B',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 6, md: 12, lg: 18, pill: 999 } as const;

export const mono = 'Menlo, Consolas, monospace';

export const type: Record<'display' | 'title' | 'body' | 'caption' | 'receipt', TextStyle> = {
  display: { fontSize: 27, fontWeight: '800', lineHeight: 34, letterSpacing: -0.4 },
  title: { fontSize: 16, fontWeight: '700', lineHeight: 23 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 23 },
  caption: { fontSize: 12.5, fontWeight: '400', lineHeight: 18, letterSpacing: 0.3 },
  receipt: { fontSize: 13, lineHeight: 20, fontFamily: mono },
};
