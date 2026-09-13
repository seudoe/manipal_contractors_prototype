import type { Contractor } from "@/types/contractor";

/**
 * 4 contractors: 2 main (awarded) contractors, each with one subcontractor
 * beneath them (parentContractorId). Arbitrary depth is supported by the
 * schema, but the demo data only goes one level deep.
 */
export const contractors: Contractor[] = [
  {
    id: "contractor-1",
    userId: "user-ct-1",
    name: "BuildCorp",
    description: "General contractor specializing in large-scale civil infrastructure.",
    parentContractorId: null,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    gstin: "27AABCB1234C1Z8",
    pan: "AABCB1234C",
    registeredAddress: "14 Construction House, Andheri East, Mumbai",
    incorporationDate: "2010-04-12",
    directors: ["Vikram Shah", "Anita Shah"],
    bankIfsc: "HDFC0001234",
  },
  {
    id: "contractor-2",
    userId: "user-ct-2",
    name: "ElectroWorks",
    description: "Electrical systems and signaling subcontractor.",
    parentContractorId: "contractor-1",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    gstin: "27AABCE5678D1Z2",
    pan: "AABCE5678D",
    registeredAddress: "22 Industrial Estate, Turbhe, Navi Mumbai",
    incorporationDate: "2015-06-01",
    directors: ["Suresh Kumar", "Ramesh Menon"],
    bankIfsc: "ICIC0002345",
  },
  {
    id: "contractor-3",
    userId: "user-ct-3",
    name: "SkyRise Builders",
    description: "General contractor specializing in institutional and healthcare construction.",
    parentContractorId: null,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    gstin: "27AABCS4321E1Z6",
    pan: "AABCS4321E",
    registeredAddress: "9 Skyline Towers, Bandra, Mumbai",
    incorporationDate: "2012-09-20",
    directors: ["Neha Kapoor"],
    bankIfsc: "SBIN0003456",
  },
  {
    id: "contractor-4",
    userId: "user-ct-4",
    name: "AquaBuild",
    description: "Plumbing and water systems subcontractor.",
    parentContractorId: "contractor-3",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    gstin: "27AABCA8765F1Z1",
    pan: "AABCA8765F",
    registeredAddress: "5 Water Works Road, Pune",
    incorporationDate: "2016-01-15",
    directors: ["Arjun Verma"],
    bankIfsc: "AXIS0004567",
  },

  // ---- ANUBANDH additions (TASK 8) — not linked via project-contractors.ts on
  // purpose: these are the undisclosed/shell entities the collusion graph surfaces,
  // not officially-declared project participants.
  {
    id: "contractor-5",
    userId: "user-ext-1",
    name: "Rapid Electricals",
    description: "Electrical labour supplier — not on the approved subcontractor list.",
    parentContractorId: null,
    createdAt: "2025-02-10T00:00:00.000Z",
    updatedAt: "2025-02-10T00:00:00.000Z",
    gstin: "27AABCR2468G1Z9",
    pan: "AABCR2468G",
    // shares its registered address with ElectroWorks (contractor-2)
    registeredAddress: "22 Industrial Estate, Turbhe, Navi Mumbai",
    // incorporated shortly before project-1's tender date (project-1 createdAt 2025-03-15)
    incorporationDate: "2025-02-10",
    // shares director "Ramesh Menon" with ElectroWorks (contractor-2)
    directors: ["Ramesh Menon"],
    bankIfsc: "ICIC0009988",
  },
  {
    id: "contractor-6",
    userId: "user-ext-2",
    name: "Shree Balaji Minerals",
    description: "Aggregate quarry — lost the project-1 tender to Quarry Q-114.",
    parentContractorId: null,
    createdAt: "2018-03-01T00:00:00.000Z",
    updatedAt: "2018-03-01T00:00:00.000Z",
    // matches the seller GSTIN observed in db/observations.ts (obs-1, obs-2)
    gstin: "27XYZQ9988K1Z2",
    pan: "XYZQ9988K",
    registeredAddress: "Plot 7, Quarry Road, Kalyan",
    incorporationDate: "2018-03-01",
    directors: ["Balaji Rao"],
    bankIfsc: "PUNB0005566",
  },
];
