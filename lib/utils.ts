import type {
  Subject,
  ApprovedSubject,
  CareerPlan,
  NucleusConfig,
  SubjectState,
} from "@/data/curriculum";

export function getApprovedIds(approved: ApprovedSubject[]): Set<string> {
  return new Set(approved.filter(s => s.status !== "regularized").map((s) => s.id));
}

export function getStatusMap(approved: ApprovedSubject[]): Map<string, "approved" | "regularized"> {
  const map = new Map<string, "approved" | "regularized">();
  for (const s of approved) map.set(s.id, s.status || "approved");
  return map;
}

export function getSubjectState(
  subject: Subject,
  approvedIds: Set<string>,
  statusMap?: Map<string, "approved" | "regularized">
): SubjectState {
  if (statusMap) {
    const status = statusMap.get(subject.id);
    if (status === "approved") return "approved";
    if (status === "regularized") return "regularized";
  } else {
    if (approvedIds.has(subject.id)) return "approved";
  }
  
  const hasReg = subject.prerequisites.regularized.length > 0;
  const hasApp = subject.prerequisites.approved.length > 0;
  
  if (!hasReg && !hasApp) return "available";

  const appMet = subject.prerequisites.approved.every(id => approvedIds.has(id));
  const regMet = subject.prerequisites.regularized.every(id => {
    if (approvedIds.has(id)) return true;
    if (statusMap && statusMap.get(id) === "regularized") return true;
    return false;
  });

  return (appMet && regMet) ? "available" : "blocked";
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
  regularized: number;
  available: number;
  credits: number;
  approvedCredits: number;
}

export interface Stats {
  totalSubjects: number;
  approved: number;
  regularized: number;
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
  const statusMap = getStatusMap(approved);

  const counters = new Map<
    string,
    { total: number; approved: number; regularized: number; available: number; credits: number; approvedCredits: number }
  >();

  for (const n of plan.nuclei) {
    counters.set(n.id, { total: 0, approved: 0, regularized: 0, available: 0, credits: 0, approvedCredits: 0 });
  }

  const availableSubjects: Subject[] = [];

  for (const subject of plan.subjects) {
    const state = getSubjectState(subject, approvedIds, statusMap);
    let c = counters.get(subject.nucleusId);
    if (!c) {
      c = { total: 0, approved: 0, regularized: 0, available: 0, credits: 0, approvedCredits: 0 };
      counters.set(subject.nucleusId, c);
    }

    c.total++;
    c.credits += subject.credits;

    if (state === "approved") {
      c.approved++;
      c.approvedCredits += subject.credits;
    } else if (state === "regularized") {
      c.regularized++;
    } else if (state === "available") {
      c.available++;
      availableSubjects.push(subject);
    }
  }

  const byNucleus: NucleusStats[] = [];
  let totalSubjects = 0;
  let totalApproved = 0;
  let totalRegularized = 0;
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
      const cappedRegularized = Math.min(c.regularized, reqTotal - cappedApproved);
      const cappedAvailable = Math.min(c.available, reqTotal - cappedApproved - cappedRegularized);
      const cappedBlocked = reqTotal - cappedApproved - cappedRegularized - cappedAvailable;

      totalSubjects += reqTotal;
      totalApproved += cappedApproved;
      totalRegularized += cappedRegularized;
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
        regularized: cappedRegularized,
        available: cappedAvailable,
        credits: reqCredits,
        approvedCredits: Math.min(c.approvedCredits, reqCredits),
      });
    } else {
      const blocked = c.total - c.approved - c.regularized - c.available;

      totalSubjects += c.total;
      totalApproved += c.approved;
      totalRegularized += c.regularized;
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
        regularized: c.regularized,
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
    regularized: totalRegularized,
    available: totalAvailable,
    blocked: totalBlocked,
    approvedCredits: totalApprovedCredits,
    totalCredits,
    byNucleus,
    availableSubjects,
    averageGrade,
  };
}
