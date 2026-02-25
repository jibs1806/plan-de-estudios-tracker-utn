import type {
  Subject,
  ApprovedSubject,
  CareerPlan,
  NucleusConfig,
  SubjectState,
} from "@/data/curriculum";

export function getApprovedIds(approved: ApprovedSubject[]): Set<string> {
  return new Set(approved.map((s) => s.id));
}

export function getSubjectState(
  subject: Subject,
  approvedIds: Set<string>
): SubjectState {
  if (approvedIds.has(subject.id)) return "approved";
  if (subject.prerequisites.length === 0) return "available";
  return subject.prerequisites.every((id) => approvedIds.has(id))
    ? "available"
    : "blocked";
}

export function getSubjectGrade(
  id: string,
  approved: ApprovedSubject[]
): number | null {
  return approved.find((s) => s.id === id)?.grade ?? null;
}

export interface NucleusStats {
  nucleusId: string;
  label: string;
  accent: string;
  minRequired: number | null;
  total: number;
  totalAvailable: number;
  approved: number;
  available: number;
  credits: number;
  approvedCredits: number;
}

export interface Stats {
  totalSubjects: number;
  approved: number;
  available: number;
  blocked: number;
  approvedCredits: number;
  totalCredits: number;
  byNucleus: NucleusStats[];
  availableSubjects: Subject[];
  averageGrade: number;
}

export function calculateStats(
  plan: CareerPlan,
  approved: ApprovedSubject[]
): Stats {
  const approvedIds = getApprovedIds(approved);

  const counters = new Map<
    string,
    { total: number; approved: number; available: number; credits: number; approvedCredits: number }
  >();

  for (const n of plan.nuclei) {
    counters.set(n.id, { total: 0, approved: 0, available: 0, credits: 0, approvedCredits: 0 });
  }

  const availableSubjects: Subject[] = [];

  for (const subject of plan.subjects) {
    const state = getSubjectState(subject, approvedIds);
    let c = counters.get(subject.nucleusId);
    if (!c) {
      c = { total: 0, approved: 0, available: 0, credits: 0, approvedCredits: 0 };
      counters.set(subject.nucleusId, c);
    }

    c.total++;
    c.credits += subject.credits;

    if (state === "approved") {
      c.approved++;
      c.approvedCredits += subject.credits;
    } else if (state === "available") {
      c.available++;
      availableSubjects.push(subject);
    }
  }

  const byNucleus: NucleusStats[] = [];
  let totalSubjects = 0;
  let totalApproved = 0;
  let totalAvailable = 0;
  let totalBlocked = 0;
  let totalCredits = 0;
  let totalApprovedCredits = 0;

  for (const n of plan.nuclei) {
    const c = counters.get(n.id);
    if (!c) continue;

    if (n.minRequired !== null) {
      const reqTotal = n.minRequired;
      const avgCredits = c.total > 0 ? Math.round(c.credits / c.total) : 8;
      const reqCredits = reqTotal * avgCredits;
      const cappedApproved = Math.min(c.approved, reqTotal);
      const cappedAvailable = Math.min(c.available, reqTotal - cappedApproved);
      const cappedBlocked = reqTotal - cappedApproved - cappedAvailable;

      totalSubjects += reqTotal;
      totalApproved += cappedApproved;
      totalAvailable += cappedAvailable;
      totalBlocked += cappedBlocked;
      totalCredits += reqCredits;
      totalApprovedCredits += Math.min(c.approvedCredits, reqCredits);

      byNucleus.push({
        nucleusId: n.id,
        label: n.label,
        accent: n.accent,
        minRequired: n.minRequired,
        total: reqTotal,
        totalAvailable: c.total,
        approved: cappedApproved,
        available: cappedAvailable,
        credits: reqCredits,
        approvedCredits: Math.min(c.approvedCredits, reqCredits),
      });
    } else {
      const blocked = c.total - c.approved - c.available;

      totalSubjects += c.total;
      totalApproved += c.approved;
      totalAvailable += c.available;
      totalBlocked += blocked;
      totalCredits += c.credits;
      totalApprovedCredits += c.approvedCredits;

      byNucleus.push({
        nucleusId: n.id,
        label: n.label,
        accent: n.accent,
        minRequired: null,
        total: c.total,
        totalAvailable: c.total,
        approved: c.approved,
        available: c.available,
        credits: c.credits,
        approvedCredits: c.approvedCredits,
      });
    }
  }

  const grades = approved.filter((s) => s.grade !== null).map((s) => s.grade!);
  const averageGrade =
    grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;

  return {
    totalSubjects,
    approved: totalApproved,
    available: totalAvailable,
    blocked: totalBlocked,
    approvedCredits: totalApprovedCredits,
    totalCredits,
    byNucleus,
    availableSubjects,
    averageGrade,
  };
}
