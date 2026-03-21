export interface MemoryCard {
  id: string;
  value: string; // Can be a letter, image ID, or sound ID
  type: "letter" | "image" | "sound";
  pairId: string; // Cards with the same pairId match
  flipped: boolean;
  matched: boolean;
  error?: boolean;
  success?: boolean;
  extraInfo?: string; 
  letterKey?: string; 
  playSoundOnClick?: boolean;
}
