export enum PromptType {
  PHOTOREALISTIC = 'PHOTOREALISTIC',
  BLUEPRINT = 'BLUEPRINT',
  MODEL_3D = 'MODEL_3D'
}

export interface PresetPrompt {
  id: PromptType;
  title: string;
  text: string;
}

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: PromptType.PHOTOREALISTIC,
    title: "Photorealistic Photography",
    text: "A highly detailed antilog clock design showing numbers arranged in reverse logarithmic progression, with elegant mathematical markings and a clean circular layout. The clock face blends scientific precision with modern minimalist aesthetics. Soft lighting, subtle shadows, crisp lines, high-resolution, premium product photography style."
  },
  {
    id: PromptType.BLUEPRINT,
    title: "Technical Blueprint",
    text: "Create a clean vector schematic of an antilog clock. The dial should display values increasing exponentially instead of linearly, labeled using antilogarithmic spacing. Include tick marks, numeric labels, and a clear geometric guide grid. Style: technical blueprint, minimal, precise, monochrome."
  },
  {
    id: PromptType.MODEL_3D,
    title: "3D Render",
    text: "A realistic 3D antilog clock with a circular face where distances between numbers follow an antilogarithmic scale. Polished metal frame, frosted glass cover, soft ambient lighting. High-detail materials, accurate mathematical spacing, rendered in a photorealistic style."
  }
];
