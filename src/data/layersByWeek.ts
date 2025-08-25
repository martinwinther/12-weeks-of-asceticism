export interface Layer {
  title: string;
  description: string;
  action: string;
}

export const layersByWeek: Record<number, Layer> = {
  1: {
    title: "Phone-Free Mornings",
    description: "Reclaim your mental space by avoiding your phone for the first 90 minutes of the day.",
    action: "No smartphone use for the first 90 minutes of your day."
  },
  2: {
    title: "No Online Shopping or Window Shopping",
    description: "Disrupt consumer impulses by avoiding browsing online stores or window shopping.",
    action: "Do not browse online stores, reviews, or products — not even to look."
  },
  3: {
    title: "Cold Showers Only",
    description: "Build resilience by embracing physical discomfort with cold showers.",
    action: "Take only cold showers (or as cold as tolerable)."
  },
  4: {
    title: "Eat Simple, Eat Repetitively",
    description: "Cultivate gratitude and presence by eating the same simple meals daily.",
    action: "Eat the same basic meals every day this week."
  },
  5: {
    title: "Daily Silent Walk",
    description: "A short, device‑free walk with no inputs.",
    action: "Walk for at least 10 minutes without your phone, audio, or talking."
  },
  6: {
    title: "Sunset-to-Sunrise Digital Fast",
    description: "Reset your mind by disconnecting from screens overnight.",
    action: "No screens from sunset until the next morning."
  },
  7: {
    title: "Intermittent Fasting",
    description: "Strengthen self-control by limiting eating to an 8-hour window each day.",
    action: "Eat only within an 8-hour window each day (e.g., 12–8pm)."
  },
  8: {
    title: "No Entertainment",
    description: "Expose hidden emotions by avoiding entertainment media.",
    action: "No TV, YouTube, video games, music, podcasts, or fiction; read nonfiction or reflect."
  },
  9: {
    title: "Speak Less, Speak Slowly",
    description: "Enhance mindfulness and respect by practicing intentional speech.",
    action: "Speak less — avoid small talk, arguing, and interrupting; speak slowly and deliberately."
  },
  10: {
    title: "Daily Acts of Service",
    description: "Cultivate compassion through unrecognized acts of kindness each day.",
    action: "Perform one selfless act daily without seeking recognition."
  },
  11: {
    title: "Physical Self-Discipline",
    description: "Build consistency and willpower through daily physical exercise.",
    action: "Do your chosen physical practice (walk, pushups, yoga, etc.) every day."
  },
  12: {
    title: "Radical Honesty",
    description: "Deepen integrity by committing to complete honesty in all communications.",
    action: "No white lies, exaggerations, or omissions; be kind but clear."
  }
}; 