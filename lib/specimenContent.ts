export const PREVIEW_SAMPLES = [
  {
    id: "dignity",
    label: "Latin",
    text: "Whereas recognition of the inherent dignity",
  },
  {
    id: "udhr1",
    label: "Paragraph",
    text: "No one shall be subjected to arbitrary arrest, detention or exile.",
  },
  {
    id: "udhr2",
    label: "Paragraph",
    text: "Everyone is entitled in full equality to a fair and public hearing by an independent and impartial tribunal.",
  },
  {
    id: "pangram",
    label: "Pangram",
    text: "The quick brown fox jumps over the lazy dog",
  },
  {
    id: "glyphs",
    label: "Charset",
    text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789",
  },
] as const;

export const PARAGRAPH_SPECIMENS = [
  {
    size: 48,
    label: "Regular at 48px",
    text: "Whereas a common understanding of these rights and freedoms is",
  },
  {
    size: 36,
    label: "Regular at 36px",
    text: "No one shall be held in slavery or servitude; slavery and the slave trade shall be prohibited in all their forms.",
  },
  {
    size: 32,
    label: "Regular at 32px",
    text: "Everyone has the right to an effective remedy by the competent national tribunals for acts violating the fundamental rights granted him by the constitution or by law.",
  },
  {
    size: 21,
    label: "Regular at 21px",
    text: "No one shall be subjected to arbitrary arrest, detention or exile. Everyone is entitled in full equality to a fair and public hearing by an independent and impartial tribunal, in the determination of his rights and obligations and of any criminal charge against him.",
  },
  {
    size: 16,
    label: "Regular at 16px",
    text: "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance. Everyone has the right to freedom of opinion and expression.",
  },
] as const;

export const TYPE_SCALE = [
  { name: "Heading 1", size: 48, leading: 1.1, sample: "AaLl" },
  { name: "Heading 2", size: 36, leading: 1.15, sample: "AaLl" },
  { name: "Heading 3", size: 28, leading: 1.2, sample: "AaLl" },
  { name: "Body", size: 16, leading: 1.5, sample: "Whereas recognition of the inherent dignity" },
] as const;

export const WEIGHT_LADDER = [
  { name: "Thin", css: 100, weight: 48 },
  { name: "Light", css: 300, weight: 64 },
  { name: "Regular", css: 400, weight: 84 },
  { name: "Medium", css: 500, weight: 100 },
  { name: "SemiBold", css: 600, weight: 120 },
  { name: "Bold", css: 700, weight: 145 },
  { name: "Black", css: 900, weight: 175 },
] as const;

export const VARIABLE_AXES: {
  key: "weight" | "contrast" | "roundness" | "width" | "slant" | "spacing";
  label: string;
  min: number;
  max: number;
  step: number;
  fmt?: (n: number) => string;
}[] = [
  { key: "weight", label: "Weight", min: 40, max: 180, step: 1 },
  { key: "contrast", label: "Contrast", min: 0, max: 0.9, step: 0.01, fmt: (n) => n.toFixed(2) },
  { key: "roundness", label: "Roundness", min: 0, max: 1, step: 0.01, fmt: (n) => n.toFixed(2) },
  { key: "width", label: "Width", min: 0.74, max: 1.3, step: 0.01, fmt: (n) => n.toFixed(2) },
  { key: "slant", label: "Slant", min: -15, max: 18, step: 1 },
  { key: "spacing", label: "Spacing", min: 30, max: 140, step: 1 },
];
