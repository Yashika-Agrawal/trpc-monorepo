import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { usersTable, formsTable, formFieldsTable, responsesTable, responseAnswersTable } from "./models/user"; // Actually it's exported in schema
import * as schema from "./schema";

const seed = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // 1. Create Demo User
  // Note: bcrypt is not installed in database package, we will just use a hardcoded hash for "hackathon2026"
  // generated via bcrypt.hashSync("hackathon2026", 10)
  const passwordHash = "$2a$10$tZ2.9R22v4pW.p0HjR3cVu2K8wZ4A1Y0R0f5.2.Y.V.qM1qJ1.7Iq";
  
  const [demoUser] = await db.insert(schema.usersTable).values({
    fullName: "Demo Creator",
    email: "demo@typebuilder.com",
    password: passwordHash,
    emailVerified: new Date(),
  }).returning();
  console.log("Created demo user:", demoUser.id);

  // 2. Create Forms
  const [animeForm] = await db.insert(schema.formsTable).values({
    title: "Anime Character Poll 2026",
    description: "Vote for your favorite characters of the season!",
    slug: "anime-poll-26",
    visibility: "public",
    theme: "anime",
    userId: demoUser.id,
  }).returning();

  const [techForm] = await db.insert(schema.formsTable).values({
    title: "Tech Startup Feedback",
    description: "Help us improve our new SaaS product.",
    slug: "tech-feedback",
    visibility: "public",
    theme: "tech",
    userId: demoUser.id,
  }).returning();

  const [privateForm] = await db.insert(schema.formsTable).values({
    title: "Internal Event Registration",
    description: "Company retreat 2026 registration form.",
    slug: "retreat-2026",
    visibility: "unlisted",
    theme: "default",
    userId: demoUser.id,
  }).returning();

  // 3. Create Fields for Anime Form
  const animeFields = await db.insert(schema.formFieldsTable).values([
    { formId: animeForm.id, type: "short_text", label: "What is your name?", order: 1, isRequired: true },
    { formId: animeForm.id, type: "single_select", label: "Favorite Genre?", options: JSON.stringify(["Shonen", "Shojo", "Seinen", "Isekai"]), order: 2, isRequired: true },
    { formId: animeForm.id, type: "rating", label: "Rate the current anime season", order: 3, isRequired: false, validationRules: JSON.stringify({ max: 5 }) },
  ]).returning();

  // 4. Create Fields for Tech Form
  const techFields = await db.insert(schema.formFieldsTable).values([
    { formId: techForm.id, type: "email", label: "Work Email", order: 1, isRequired: true },
    { formId: techForm.id, type: "long_text", label: "What features would you like to see?", order: 2, isRequired: false },
    { formId: techForm.id, type: "number", label: "How much would you pay for this per month?", order: 3, isRequired: true },
  ]).returning();

  // 5. Seed responses
  const [animeResp1, animeResp2] = await db.insert(schema.responsesTable).values([
    { formId: animeForm.id, respondentEmail: "fan1@example.com" },
    { formId: animeForm.id, respondentEmail: "fan2@example.com" },
  ]).returning();

  await db.insert(schema.responseAnswersTable).values([
    { responseId: animeResp1.id, fieldId: animeFields[0].id, value: "Naruto" },
    { responseId: animeResp1.id, fieldId: animeFields[1].id, value: "Shonen" },
    { responseId: animeResp1.id, fieldId: animeFields[2].id, value: "5" },
    { responseId: animeResp2.id, fieldId: animeFields[0].id, value: "Sakura" },
    { responseId: animeResp2.id, fieldId: animeFields[1].id, value: "Shojo" },
    { responseId: animeResp2.id, fieldId: animeFields[2].id, value: "4" },
  ]);

  const [techResp1] = await db.insert(schema.responsesTable).values([
    { formId: techForm.id, respondentEmail: "founder@startup.com" },
  ]).returning();

  await db.insert(schema.responseAnswersTable).values([
    { responseId: techResp1.id, fieldId: techFields[0].id, value: "founder@startup.com" },
    { responseId: techResp1.id, fieldId: techFields[1].id, value: "Better analytics and API docs" },
    { responseId: techResp1.id, fieldId: techFields[2].id, value: "49" },
  ]);

  console.log("Seed completed!");
  await client.end();
};

seed().catch(console.error);
