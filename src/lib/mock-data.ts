import type { MysteryCase } from "@/core/enterprise/entities/mystery-case.entity";
import type { Evidence } from "@/core/enterprise/entities/evidence.entity"; 
import { v4 as uuidv4 } from 'uuid'; // For generating IDs

// Helper to generate unique IDs for evidence within mock data
const generateEvidenceWithIds = (evidenceArray: Omit<Evidence, 'id'>[]): Evidence[] => {
  return evidenceArray.map(e => ({ ...e, id: uuidv4() }));
};

export const initialMockCases: MysteryCase[] = [
  {
    id: "mock-case-1", // Keep mock IDs distinct from potential Firestore IDs
    title: "The Case of the Missing Masterpiece",
    description: "A famous painting has vanished from a locked room in the city museum. Can you find the culprit?",
    difficulty: "Easy",
    authorId: "author-jane-doe",
    evidence: generateEvidenceWithIds([
      { title: "Security Footage (Lobby)", type: "picture", content: "https://picsum.photos/seed/lobby-mock/600/400", description: "Shows a blurry figure near the entrance around midnight.", dataAiHint: "security camera" },
      { title: "Janitor's Statement", type: "document", content: "Text: 'I heard a strange noise around 1 AM from the West wing.'", description: "The janitor was on duty that night." },
      { title: "Muddy Footprint", type: "picture", content: "https://picsum.photos/seed/footprint-mock/600/400", description: "Found near the service exit. Size 10.", dataAiHint: "muddy footprint" },
      { title: "Anonymous Tip (Audio)", type: "audio", content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", description: "A muffled voice saying 'The curator knows more than they let on.'", fileName: "tip.mp3" },
    ]),
    suspects: ["The disgruntled artist", "The ambitious curator", "The sneaky collector"],
    victims: ["The City Museum (theft of property)"],
    solution: "The ambitious curator orchestrated the theft to claim insurance money and replace it with a forgery.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "mock-case-2",
    title: "The Silicon Valley Sabotage",
    description: "A promising tech startup's revolutionary code has been wiped just days before its launch. Industrial espionage or an inside job?",
    difficulty: "Medium",
    authorId: "author-john-smith",
    evidence: generateEvidenceWithIds([
      { title: "Encrypted Email Fragment", type: "document", content: "Text: 'Project X... transfer complete... payment confirmation... ghost_protocol.'", description: "Intercepted from an unknown source." },
      { title: "Server Room Access Log", type: "picture", content: "https://picsum.photos/seed/serverlog-mock/600/400", description: "Shows unusual late-night access by a lead developer.", dataAiHint: "server room" },
      { title: "Voicemail from Rival CEO", type: "audio", content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", description: "A heated exchange about market competition.", fileName: "rival_ceo.mp3" },
      { title: "Developer's Note", type: "note", content: "Scribbled note: 'Can't take this pressure. Need an out. They offered double.'", description: "Found in the lead developer's trash bin." },
    ]),
    suspects: ["Rival Company CEO", "Disgruntled Lead Developer", "Mysterious Hacker Group"],
    victims: ["TechLeap Inc. (sabotage)"],
    solution: "The Disgruntled Lead Developer, bribed by the Rival Company, wiped the code.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "mock-case-3",
    title: "The Unsolved Alibi",
    description: "A wealthy businessman is found dead in his study. Everyone has an alibi, but one of them must be lying. Who is it?",
    difficulty: "Hard",
    authorId: "author-jane-doe",
    evidence: generateEvidenceWithIds([
        { title: "Crime Scene Photo", type: "picture", content: "https://picsum.photos/seed/crimephoto-mock/600/400", description: "Study in disarray, victim on the floor.", dataAiHint: "crime scene study" },
        { title: "Butler's Testimony", type: "document", content: "Text: 'I served Mr. Blackwood his tea at 8 PM and retired. I saw nothing unusual.'", description: "Claims to be in his quarters."},
        { title: "Business Partner's Alibi", type: "note", content: "Claims to be at a charity gala across town. Has a photo stub as proof.", description: "Partner stood to gain from a recent deal."},
        { title: "Wife's Statement", type: "document", content: "Text: 'I was reading in the conservatory all evening. I heard a thud around 9 PM.'", description: "Appears distraught."}
    ]),
    suspects: ["The Loyal Butler", "The Scheming Business Partner", "The Grieving Wife"],
    victims: ["Mr. Alistair Blackwood (murder)"],
    solution: "The Business Partner's alibi is flawed; the charity gala ended earlier than claimed, allowing them time to commit the crime.",
    isPublished: false, // This one is not published yet
    createdAt: new Date().toISOString(),
  }
];
