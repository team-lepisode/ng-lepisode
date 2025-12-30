import { FontConfig } from '../interfaces/font.interface';

export const FontFamilies: FontConfig[] = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Malgun Gothic', value: 'Malgun Gothic, sans-serif' },
  {
    name: 'Noto Sans KR',
    value: 'Noto Sans KR, sans-serif',
    googleFontName: 'Noto Sans KR',
  },
  {
    name: 'Nanum Gothic',
    value: 'Nanum Gothic, sans-serif',
    googleFontName: 'Nanum Gothic',
  },
  {
    name: 'Nanum Myeongjo',
    value: 'Nanum Myeongjo, serif',
    googleFontName: 'Nanum Myeongjo',
  },
  {
    name: 'Black Han Sans',
    value: 'Black Han Sans, sans-serif',
    googleFontName: 'Black Han Sans',
  },
  {
    name: 'Do Hyeon',
    value: 'Do Hyeon, sans-serif',
    googleFontName: 'Do Hyeon',
  },
] as const;
