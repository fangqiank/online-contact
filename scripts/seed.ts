import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/db";
import { contacts } from "../src/db/schema";

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Legal",
  "Customer Support",
];

const positions = [
  "Software Engineer",
  "Senior Engineer",
  "Tech Lead",
  "Engineering Manager",
  "Product Manager",
  "Senior PM",
  "Designer",
  "Senior Designer",
  "Marketing Manager",
  "Content Strategist",
  "Sales Representative",
  "Account Executive",
  "HR Specialist",
  "HR Manager",
  "Financial Analyst",
  "Accountant",
  "Operations Manager",
  "Legal Counsel",
  "Support Engineer",
  "Team Lead",
];

const firstNames = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa",
  "Timothy", "Deborah", "Ron", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
  "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
  "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
  "Dennis", "Maria",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const mid = Math.floor(Math.random() * 900) + 100;
  const end = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${mid}-${end}`;
}

function generateDate(): string {
  const year = 2018 + Math.floor(Math.random() * 8);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const salaryLevels = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "M1", "M2", "M3"];

async function seed() {
  // Clear existing data first
  console.log("Clearing existing contacts...");
  await db.delete(contacts);

  console.log("Seeding 100 contacts...");

  const records = Array.from({ length: 100 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    return {
      name,
      email,
      phone: generatePhone(),
      department: pick(departments),
      position: pick(positions),
      status: Math.random() > 0.15 ? "active" : "resigned",
      hireDate: generateDate(),
      employeeId: `EMP${String(i + 1).padStart(4, "0")}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName + lastName)}`,
      notes: null,
      emergencyContact: null,
      address: null,
      salaryLevel: pick(salaryLevels),
    };
  });

  // Insert in batches of 10 to avoid Neon's parameter limit
  const BATCH_SIZE = 10;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await db.insert(contacts).values(batch);
    console.log(`  Inserted ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`);
  }
  console.log("Done! 100 contacts inserted.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
