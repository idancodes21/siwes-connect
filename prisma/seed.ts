import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const universities = [
  // Federal universities
  { name: "University of Nigeria, Nsukka", acronym: "UNN", state: "Enugu", city: "Nsukka" },
  { name: "University of Ibadan", acronym: "UI", state: "Oyo", city: "Ibadan" },
  { name: "University of Lagos", acronym: "UNILAG", state: "Lagos", city: "Lagos" },
  { name: "Ahmadu Bello University", acronym: "ABU", state: "Kaduna", city: "Zaria" },
  { name: "Obafemi Awolowo University", acronym: "OAU", state: "Osun", city: "Ile-Ife" },
  { name: "University of Benin", acronym: "UNIBEN", state: "Edo", city: "Benin City" },
  { name: "University of Port Harcourt", acronym: "UNIPORT", state: "Rivers", city: "Port Harcourt" },
  { name: "University of Calabar", acronym: "UNICAL", state: "Cross River", city: "Calabar" },
  { name: "University of Ilorin", acronym: "UNILORIN", state: "Kwara", city: "Ilorin" },
  { name: "Nnamdi Azikiwe University", acronym: "UNIZIK", state: "Anambra", city: "Awka" },
  { name: "Federal University of Technology, Owerri", acronym: "FUTO", state: "Imo", city: "Owerri" },
  { name: "Federal University of Technology, Minna", acronym: "FUTMINNA", state: "Niger", city: "Minna" },
  { name: "University of Jos", acronym: "UNIJOS", state: "Plateau", city: "Jos" },
  { name: "University of Maiduguri", acronym: "UNIMAID", state: "Borno", city: "Maiduguri" },
  { name: "University of Uyo", acronym: "UNIUYO", state: "Akwa Ibom", city: "Uyo" },

  // State universities
  { name: "Enugu State University of Science and Technology", acronym: "ESUT", state: "Enugu", city: "Enugu" },
  { name: "Lagos State University", acronym: "LASU", state: "Lagos", city: "Ojo" },
  { name: "Rivers State University", acronym: "RSU", state: "Rivers", city: "Port Harcourt" },
  { name: "Delta State University", acronym: "DELSU", state: "Delta", city: "Abraka" },
  { name: "Imo State University", acronym: "IMSU", state: "Imo", city: "Owerri" },
  { name: "Abia State University", acronym: "ABSU", state: "Abia", city: "Uturu" },
  { name: "Chukwuemeka Odumegwu Ojukwu University", acronym: "COOU", state: "Anambra", city: "Uli" },
  { name: "Ekiti State University", acronym: "EKSU", state: "Ekiti", city: "Ado-Ekiti" },
  { name: "Osun State University", acronym: "UNIOSUN", state: "Osun", city: "Osogbo" },
  { name: "Benue State University", acronym: "BSU", state: "Benue", city: "Makurdi" },

  // Private universities
  { name: "Covenant University", acronym: "CU", state: "Ogun", city: "Ota" },
  { name: "Babcock University", acronym: "BU", state: "Ogun", city: "Ilishan-Remo" },
  { name: "Afe Babalola University", acronym: "ABUAD", state: "Ekiti", city: "Ado-Ekiti" },
  { name: "American University of Nigeria", acronym: "AUN", state: "Adamawa", city: "Yola" },
  { name: "Bowen University", acronym: "BU", state: "Osun", city: "Iwo" },
];


const unnDepartments = [
  // Agriculture
  "Agricultural Economics",
  "Agricultural Extension",
  "Animal Science",
  "Soil Science",
  "Nutrition and Dietetics",
  "Home Science and Management",
  "Food Science and Technology",
  "Crop Science",

  // Arts
  "History and International Studies",
  "Mass Communication",
  "Archaeology and Tourism",
  "English and Literary Studies",
  "Fine and Applied Arts",
  "Linguistics, Igbo and Other Nigerian Languages",
  "Music",
  "Theatre and Film Studies",
  "Foreign Language and Literature",

  // Biological Sciences
  "Biochemistry",
  "Microbiology",
  "Plant Science and Biotechnology",
  "Genetics and Biotechnology",
  "Zoology and Environmental Biology",

  // Business Administration
  "Accountancy",
  "Marketing",
  "Banking and Finance",
  "Management",

  // Education
  "Adult Education",
  "Arts Education",
  "Computer Education",
  "Educational Foundations",
  "Library Science",
  "Human Kinetics and Health Education",
  "Science Education",
  "Social Science Education",
  "Agricultural Education",
  "Business Education",
  "Industrial Technical Education",
  "Home Economics and Hospitality Management Education",

  // Engineering
  "Agricultural and Bioresources Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronic Engineering",
  "Mechanical Engineering",
  "Metallurgical and Materials Engineering",
  "Mechatronic Engineering",
  "Biomedical Engineering",

  // Environmental Studies
  "Estate Management",
  "Architecture",
  "Urban and Regional Planning",
  "Geoinformatics and Surveying",

  // Law
  "International and Comparative Law",
  "Commercial and Corporate Law",
  "Customary and Indigenous Law",
  "Jurisprudence and Legal Theory",
  "Property Law",
  "Public Law",

  // Pharmaceutical Sciences
  "Pharmaceutical and Medicinal Chemistry",
  "Pharmacology and Toxicology",
  "Pharmaceutics",
  "Pharmaceutical Technology and Industrial Pharmacy",
  "Pharmacognosy and Environmental Medicines",
  "Clinical Pharmacy and Pharmacy Management",
  "Pharmaceutical Microbiology and Biotechnology",

  // Physical Sciences
  "Pure and Industrial Chemistry",
  "Computer Science",
  "Geology",
  "Mathematics",
  "Physics and Astronomy",
  "Science Laboratory Technology",
  "Statistics",

  // Social Sciences
  "Public Administration and Local Government",
  "Economics",
  "Political Science",
  "Social Work",
  "Religion and Cultural Studies",
  "Psychology",
  "Philosophy",
  "Geography",
  "Sociology and Anthropology",

  // Veterinary Medicine
  "Veterinary Pathology and Microbiology",
  "Veterinary Obstetrics and Reproductive Diseases",
  "Veterinary Physiology and Pharmacology",
  "Veterinary Anatomy",
  "Veterinary Medicine",
  "Veterinary Animal Health and Production",
  "Veterinary Parasitology and Entomology",
  "Veterinary Public Health and Preventive Medicine",
  "Veterinary Surgery",

  // Dentistry
  "Child Dental Health",
  "Oral and Maxillofacial Surgery",
  "Preventive Dentistry",
  "Restorative Dentistry",

  // Health Sciences and Technology
  "Medical Rehabilitation",
  "Nursing Sciences",
  "Medical Laboratory Science",

  // Medical Sciences
  "Anaesthesia",
  "Anatomy",
  "Chemical Pathology",
  "Community Medicine",
  "Dermatology",
  "Haematology and Immunology",
  "Medical Biochemistry",
  "Medical Microbiology",
  "Morbid Anatomy",
  "Obstetrics and Gynaecology",
  "Ophthalmology",
  "Otorhinolaryngology",
  "Paediatrics",
  "Paediatric Surgery",
  "Pharmacology and Therapeutics",
  "Physiological Medicine",
  "Radiation Medicine",
  "Surgery",
];

async function main() {
  console.log("Starting SIWES Connect database seed...");

  // Seed universities
  const unn = await prisma.institution.upsert({
    where: {
      name_country: {
        name: "University of Nigeria, Nsukka",
        country: "Nigeria",
      },
    },
    update: {
      acronym: "UNN",
      state: "Enugu",
      city: "Nsukka",
    },
    create: {
      name: "University of Nigeria, Nsukka",
      acronym: "UNN",
      country: "Nigeria",
      state: "Enugu",
      city: "Nsukka",
    },
  });

  for (const university of universities.filter(
    (item) => item.acronym !== "UNN",
  )) {
    await prisma.institution.upsert({
      where: {
        name_country: {
          name: university.name,
          country: "Nigeria",
        },
      },
      update: {
        acronym: university.acronym,
        state: university.state,
        city: university.city,
      },
      create: {
        ...university,
        country: "Nigeria",
      },
    });
  }

  console.log(`Seeded ${universities.length} universities.`);

  // Seed UNN departments
  for (const departmentName of unnDepartments) {
    await prisma.department.upsert({
      where: {
        institutionId_name: {
          institutionId: unn.id,
          name: departmentName,
        },
      },
      update: {},
      create: {
        name: departmentName,
        institutionId: unn.id,
      },
    });
  }

  console.log(`Seeded ${unnDepartments.length} UNN departments.`);
  console.log("SIWES Connect database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });