import type { MysteryCase } from "@/types";

export const initialMockCases: MysteryCase[] = [
  {
    id: "1",
    title: "The Case of the Missing Masterpiece",
    description: "A famous painting has vanished from a locked room in the city museum. Can you find the culprit?",
    difficulty: "Easy",
    authorId: "author-jane-doe",
    evidence: [
      { id: "101", title: "Security Footage (Lobby)", type: "picture", content: "https://picsum.photos/seed/lobby/600/400", description: "Shows a blurry figure near the entrance around midnight.", dataAiHint: "security camera" },
      { id: "102", title: "Janitor's Statement", type: "document", content: "Text: 'I heard a strange noise around 1 AM from the West wing.'", description: "The janitor was on duty that night." },
      { id: "103", title: "Muddy Footprint", type: "picture", content: "https://picsum.photos/seed/footprint/600/400", description: "Found near the service exit. Size 10.", dataAiHint: "muddy footprint" },
      { id: "104", title: "Anonymous Tip (Audio)", type: "audio", content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", description: "A muffled voice saying 'The curator knows more than they let on.'", fileName: "tip.mp3" },
    ],
    suspects: ["The disgruntled artist", "The ambitious curator", "The sneaky collector"],
    victims: ["The City Museum (theft of property)"],
    solution: "The ambitious curator orchestrated the theft to claim insurance money and replace it with a forgery.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "The Silicon Valley Sabotage",
    description: "A promising tech startup's revolutionary code has been wiped just days before its launch. Industrial espionage or an inside job?",
    difficulty: "Medium",
    authorId: "author-john-smith",
    evidence: [
      { id: "201", title: "Encrypted Email Fragment", type: "document", content: "Text: 'Project X... transfer complete... payment confirmation... ghost_protocol.'", description: "Intercepted from an unknown source." },
      { id: "202", title: "Server Room Access Log", type: "picture", content: "https://picsum.photos/seed/serverlog/600/400", description: "Shows unusual late-night access by a lead developer.", dataAiHint: "server room" },
      { id: "203", title: "Voicemail from Rival CEO", type: "audio", content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", description: "A heated exchange about market competition.", fileName: "rival_ceo.mp3" },
      { id: "204", title: "Developer's Note", type: "note", content: "Scribbled note: 'Can't take this pressure. Need an out. They offered double.'", description: "Found in the lead developer's trash bin." },
    ],
    suspects: ["Rival Company CEO", "Disgruntled Lead Developer", "Mysterious Hacker Group"],
    victims: ["TechLeap Inc. (sabotage)"],
    solution: "The Disgruntled Lead Developer, bribed by the Rival Company, wiped the code.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "The Unsolved Alibi",
    description: "A wealthy businessman is found dead in his study. Everyone has an alibi, but one of them must be lying. Who is it?",
    difficulty: "Hard",
    authorId: "author-jane-doe",
    evidence: [
        { id: "301", title: "Crime Scene Photo", type: "picture", content: "https://picsum.photos/seed/crimephoto/600/400", description: "Study in disarray, victim on the floor.", dataAiHint: "crime scene" },
        { id: "302", title: "Butler's Testimony", type: "document", content: "Text: 'I served Mr. Blackwood his tea at 8 PM and retired. I saw nothing unusual.'", description: "Claims to be in his quarters."},
        { id: "303", title: "Business Partner's Alibi", type: "note", content: "Claims to be at a charity gala across town. Has a photo stub as proof.", description: "Partner stood to gain from a recent deal."},
        { id: "304", title: "Wife's Statement", type: "document", content: "Text: 'I was reading in the conservatory all evening. I heard a thud around 9 PM.'", description: "Appears distraught."}
    ],
    suspects: ["The Loyal Butler", "The Scheming Business Partner", "The Grieving Wife"],
    victims: ["Mr. Alistair Blackwood (murder)"],
    solution: "The Business Partner's alibi is flawed; the charity gala ended earlier than claimed, allowing them time to commit the crime.",
    isPublished: false, // This one is not published yet
    createdAt: new Date().toISOString(),
  }
];
