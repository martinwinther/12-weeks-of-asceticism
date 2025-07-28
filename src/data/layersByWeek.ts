export interface Layer {
  title: string;
  description: string;
  action: string;
}

export const layersByWeek: Record<number, Layer> = {
  1: {
    title: "Foundations",
    description: "Establish core practices for mindful living through early rising, clean eating, and daily meditation.",
    action: "Wake up before sunrise, avoid sugar and processed foods, and meditate for 10 minutes in silence.",
  },
  2: {
    title: "Simplicity", 
    description: "Reduce external distractions and clutter by decluttering your space and eliminating digital noise.",
    action: "Declutter one area of your living space and take a 15-minute mindful walk without devices.",
  },
  3: {
    title: "Discipline",
    description: "Build mental strength through physical restraint and extended meditation practice.",
    action: "Take only cold showers and meditate for 20 minutes, avoiding all entertainment media.",
  },
  4: {
    title: "Mindfulness",
    description: "Cultivate present-moment awareness through mindful eating, gratitude, and single-tasking.",
    action: "Eat one meal in complete silence, practice gratitude before sleep, and focus on one task at a time.",
  },
  5: {
    title: "Patience",
    description: "Learn to wait and observe without immediate action, developing inner stillness.",
    action: "Wait 5 minutes before responding to any message and practice 10 minutes of standing meditation.",
  },
  6: {
    title: "Solitude",
    description: "Find comfort in being alone with yourself, embracing silence and inner reflection.",
    action: "Spend 1 hour in complete solitude and walk without music or podcasts.",
  },
  7: {
    title: "Restraint",
    description: "Practice saying no to unnecessary desires, limiting purchases and social obligations.",
    action: "Make no purchases except necessities and limit speech to essential communication only.",
  },
  8: {
    title: "Physical Discipline",
    description: "Use the body as a tool for mental training through exercise and dietary restraint.",
    action: "Complete a daily bodyweight exercise routine and eat only one meal if health permits.",
  },
  9: {
    title: "Awareness",
    description: "Observe thoughts and emotions without attachment, developing meta-cognitive skills.",
    action: "Journal every thought pattern you notice and spend 30 minutes observing nature without devices.",
  },
  10: {
    title: "Acceptance",
    description: "Embrace what is without resistance, practicing loving-kindness and gratitude for challenges.",
    action: "Accept one difficult situation without trying to change it and practice loving-kindness meditation.",
  },
  11: {
    title: "Service",
    description: "Focus on giving rather than receiving through anonymous acts of service and deep listening.",
    action: "Perform one anonymous act of service and listen to others without offering advice.",
  },
  12: {
    title: "Integration",
    description: "Synthesize your journey and plan for the future, reflecting on growth and sustainable practices.",
    action: "Write a letter to your future self and plan how to sustain your ascetic practices beyond these 12 weeks.",
  },
}; 