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
  },
  {
    id: "contractor-2",
    userId: "user-ct-2",
    name: "ElectroWorks",
    description: "Electrical systems and signaling subcontractor.",
    parentContractorId: "contractor-1",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "contractor-3",
    userId: "user-ct-3",
    name: "SkyRise Builders",
    description: "General contractor specializing in institutional and healthcare construction.",
    parentContractorId: null,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "contractor-4",
    userId: "user-ct-4",
    name: "AquaBuild",
    description: "Plumbing and water systems subcontractor.",
    parentContractorId: "contractor-3",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
];
