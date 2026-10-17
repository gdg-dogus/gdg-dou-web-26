import { readJsonDir, readJsonFile } from "@/lib/content";
import { type Member, memberSchema, type Team, teamsFileSchema } from "./schema";

export type TeamWithMembers = Team & { members: Member[] };

/** Ekipler, teams.json'daki sırayla; her ekibin üyeleri önce kaptanlar, sonra `order`. */
export function getTeams(): TeamWithMembers[] {
  const { teams } = readJsonFile("teams.json", teamsFileSchema);
  const members = readJsonDir("members", memberSchema);

  const keys = new Set(teams.map((t) => t.key));
  for (const m of members) {
    if (!keys.has(m.team)) {
      throw new Error(`"${m.name}" bilinmeyen bir ekipte: "${m.team}". teams.json'a bakın.`);
    }
  }

  return teams.map((team) => ({
    ...team,
    members: members
      .filter((m) => m.team === team.key)
      .sort((a, b) => Number(b.lead) - Number(a.lead) || a.order - b.order),
  }));
}
