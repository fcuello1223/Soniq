export interface QuickAction {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  {
    title: "Tell a Bedtime Story",
    description: "Create magical stories with warm, soothing narration",
    gradient: "from-indigo-400 to-indigo-50",
    href: "/text-to-speech?text=Once upon a time, beyond the edge of the moonlit forest, there was a tiny cottage where a young girl named Lily lived with her curious little fox. Every night, the fox would stare at the stars and wonder what adventures waited beyond the clouds. Then, one evening, a silver star fell gently into their garden.",
  },
  {
    title: "Create a News Report",
    description: "Deliver breaking news with a polished broadcast voice",
    gradient: "from-red-400 to-red-50",
    href: "/text-to-speech?text=Good evening. Tonight, scientists have announced a remarkable discovery that could change the way we understand our planet. After years of research, a team of researchers has uncovered evidence of a previously unknown ecosystem deep beneath the ocean floor. Experts say the discovery could open an entirely new chapter in marine science.",
  },
  {
    title: "Voice a Documentary",
    description: "Bring educational stories to life with cinematic narration",
    gradient: "from-emerald-400 to-emerald-50",
    href: "/text-to-speech?text=For millions of years, the desert has endured beneath an unforgiving sun. But when night falls, an entirely different world awakens. Across the dunes, creatures emerge from hidden shelters, searching for food beneath a sky filled with countless stars. In this harsh environment, survival belongs to those who know how to adapt.",
  },
  {
    title: "Announce a Product",
    description: "Give your product launch a polished, confident voice",
    gradient: "from-amber-400 to-amber-50",
    href: "/text-to-speech?text=Meet Nova One — the smarter way to organize your day. With intelligent scheduling, seamless reminders, and a beautifully simple interface, Nova One keeps everything you need right at your fingertips. Spend less time planning and more time doing what matters. Nova One. Your day, simplified.",
  },
  {
    title: "Host a Radio Show",
    description: "Add personality and energy to your radio-style content",
    gradient: "from-fuchsia-400 to-fuchsia-50",
    href: "/text-to-speech?text=You're listening to The Morning Mix, bringing you the biggest stories, the freshest music, and a little something to brighten your day. I'm your host, and we've got an incredible show lined up for you. So turn up the volume, grab your coffee, and let's get this morning started!",
  },
  {
    title: "Narrate a Trailer",
    description: "Build anticipation with powerful cinematic voiceovers",
    gradient: "from-slate-500 to-slate-100",
    href: "/text-to-speech?text=This summer, one ordinary man will discover a secret buried for centuries. A secret powerful enough to change everything. When the world he knows begins to fall apart, he must choose between running from the past... or facing it. One journey. One impossible choice. And only one chance to save them all.",
  },
];
