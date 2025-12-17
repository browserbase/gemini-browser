export type SupportedModelId =
  | "google/gemini-2.5-computer-use-preview-10-2025"
  | "google/gemini-3-flash-preview";

export type SupportedModel = {
  id: SupportedModelId;
  label: string;
  description: string;
  cua: boolean;
};

export const SUPPORTED_MODELS: SupportedModel[] = [
  {
    id: "google/gemini-2.5-computer-use-preview-10-2025",
    label: "Gemini 2.5 Computer Use",
    description: "Computer Use Agent (CUA)",
    cua: true,
  },
  {
    id: "google/gemini-3-flash-preview",
    label: "Gemini 3 Flash",
    description: "Non‑CUA (Stagehand tools)",
    cua: false,
  },
];

export const DEFAULT_MODEL_ID: SupportedModelId =
  "google/gemini-2.5-computer-use-preview-10-2025";

export function isSupportedModelId(v: string): v is SupportedModelId {
  return SUPPORTED_MODELS.some((m) => m.id === v);
}

export function getSupportedModelById(id: SupportedModelId): SupportedModel {
  return SUPPORTED_MODELS.find((m) => m.id === id) ?? SUPPORTED_MODELS[0];
}
