import type { Project } from "../_data/projects";

export type Side = "left" | "right";

export type Span = Side | "left-wide" | "right-wide" | "full";

export type Tile =
  | { kind: "single"; span: Span; project: Project }
  | { kind: "pair"; side: Side; projects: [Project, Project] };

const PAIR_TOLERANCE = 0.01;
const LANDSCAPE_RATIO = 1.05;

export function coverRatio(project: Project) {
  const [cover] = project.photos;
  return cover.width / cover.height;
}

function isLandscape(project: Project) {
  return coverRatio(project) > LANDSCAPE_RATIO;
}

function findPartner(project: Project, remaining: Project[]) {
  return remaining.findIndex(
    (candidate) =>
      !isLandscape(candidate) && Math.abs(coverRatio(candidate) - coverRatio(project)) <= PAIR_TOLERANCE,
  );
}

export function layoutProjects(projects: Project[]): Tile[] {
  const remaining = [...projects];
  const tiles: Tile[] = [];
  let side: Side = "left";
  let usedFullBleed = false;

  const flip = () => {
    side = side === "left" ? "right" : "left";
  };

  while (remaining.length > 0) {
    const project = remaining.shift()!;

    if (isLandscape(project)) {
      if (!usedFullBleed) {
        tiles.push({ kind: "single", span: "full", project });
        usedFullBleed = true;
        continue;
      }
      tiles.push({ kind: "single", span: side === "left" ? "left-wide" : "right-wide", project });
      flip();
      continue;
    }

    const partnerIndex = findPartner(project, remaining);
    if (partnerIndex >= 0) {
      const [partner] = remaining.splice(partnerIndex, 1);
      tiles.push({ kind: "pair", side, projects: [project, partner] });
    } else {
      tiles.push({ kind: "single", span: side, project });
    }
    flip();
  }

  return tiles;
}
