import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

const SAMPLE_JOBS = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote / Jakarta",
    description: "Looking for a React expert to lead our dashboard development.",
    requirements: "5+ years of React experience, TypeScript, Tailwind CSS.",
    status: "OPEN"
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Jakarta",
    description: "Drive the roadmap for our hiring platform.",
    requirements: "3+ years of PM experience, technical background preferred.",
    status: "OPEN"
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    description: "Design beautiful and seamless experiences for recruiters and candidates.",
    requirements: "Figma expertise, portfolio of web applications.",
    status: "OPEN"
  }
];

const SAMPLE_CANDIDATES = [
  {
    name: "Andi Saputra",
    email: "andi@example.com",
    stage: "APPLIED",
    fitScore: 85,
    fitExplanation: "Strong technical skills matched with job requirements."
  },
  {
    name: "Budi Santoso",
    email: "budi@example.com",
    stage: "INTERVIEW",
    fitScore: 92,
    fitExplanation: "Excellent interview performance and systematic thinking."
  },
  {
    name: "Citra Lestari",
    email: "citra@example.com",
    stage: "SCREENED",
    fitScore: 78,
    fitExplanation: "Good background, needs further technical screening."
  },
  {
    name: "Dewi Putri",
    email: "dewi@example.com",
    stage: "HIRED",
    fitScore: 95,
    fitExplanation: "Perfect fit for the role and culture."
  },
  {
    name: "Eko Prasetyo",
    email: "eko@example.com",
    stage: "REJECTED",
    fitScore: 45,
    fitExplanation: "Skills did not meet the minimum requirements for this senior role."
  }
];

export async function seedDatabase() {
  console.log("Starting seeding process...");
  
  const jobIds: string[] = [];

  // 1. Seed Jobs
  for (const jobData of SAMPLE_JOBS) {
    const jobRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    jobIds.push(jobRef.id);
    console.log(`Created job: ${jobData.title}`);
  }

  // 2. Seed Candidates & Applications
  for (let i = 0; i < SAMPLE_CANDIDATES.length; i++) {
    const candidateData = SAMPLE_CANDIDATES[i];
    const jobId = jobIds[i % jobIds.length]; // Distribute candidates across jobs
    const jobTitle = SAMPLE_JOBS.find(j => j.title === SAMPLE_JOBS[i % jobIds.length].title)?.title || "Unknown Job";

    // Create Candidate doc
    const candidateRef = await addDoc(collection(db, "candidates"), {
      name: candidateData.name,
      email: candidateData.email,
      phone: "+62812345678" + i,
      linkedIn: `linkedin.com/in/${candidateData.name.toLowerCase().replace(" ", "")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create Application doc
    await addDoc(collection(db, "applications"), {
      jobId: jobId,
      candidateId: candidateRef.id,
      stage: candidateData.stage,
      fitScore: candidateData.fitScore,
      fitExplanation: candidateData.fitExplanation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`Created application for: ${candidateData.name}`);
  }

  console.log("Seeding completed successfully!");
}
