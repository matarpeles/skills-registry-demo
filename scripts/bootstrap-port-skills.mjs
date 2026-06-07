#!/usr/bin/env node
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const skillsRoot = path.join(repoRoot, "skills");
const dryRun = process.argv.includes("--dry-run");

const GROUP_BLUEPRINT = "skill_group";
const SKILL_BLUEPRINT = "skill";

const groupBlueprint = {
  identifier: GROUP_BLUEPRINT,
  title: "Skill Group",
  icon: "Folder",
  ownership: {
    type: "Direct",
    title: "Owning Teams",
  },
  schema: {
    properties: {
      description: {
        title: "Description",
        type: "string",
        format: "markdown",
      },
      enforcement: {
        title: "Enforcement",
        type: "string",
        default: "optional",
        enum: ["optional", "required"],
        enumColors: {
          optional: "blue",
          required: "red",
        },
      },
      auto_sync: {
        title: "Auto Sync",
        type: "boolean",
        default: false,
      },
    },
    required: ["enforcement"],
  },
};

const fileArrayProperty = (title) => ({
  title,
  type: "array",
  items: {
    type: "object",
  },
});

const skillBlueprint = {
  identifier: SKILL_BLUEPRINT,
  title: "Skill",
  icon: "Code",
  ownership: {
    type: "Direct",
    title: "Owning Teams",
  },
  schema: {
    properties: {
      description: {
        title: "Description",
        type: "string",
        format: "markdown",
      },
      instructions: {
        title: "Instructions",
        type: "string",
        format: "markdown",
      },
      location: {
        title: "Location",
        type: "string",
        default: "global",
        enum: ["global", "project"],
        enumColors: {
          global: "green",
          project: "purple",
        },
      },
      references: fileArrayProperty("References"),
      assets: fileArrayProperty("Assets"),
      scripts: fileArrayProperty("Scripts"),
      additional_files: fileArrayProperty("Additional Files"),
    },
    required: ["instructions", "location"],
  },
  relations: {
    skill_to_skill_group: {
      title: "Skill Group",
      target: GROUP_BLUEPRINT,
      required: false,
      many: true,
    },
  },
};

function runPort(args, { allowFailure = false } = {}) {
  const result = spawnSync("port", [...args, "--no-color"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0 && !allowFailure) {
    const stderr = result.stderr?.trim() || result.stdout?.trim() || "unknown error";
    throw new Error(`port ${args.join(" ")} failed:\n${stderr}`);
  }

  return result;
}

function writeTempJson(tempDir, name, value) {
  const file = path.join(tempDir, `${name}.json`);
  writeFileSync(file, JSON.stringify(value, null, 2));
  return file;
}

function exists(kind, id) {
  const result = kind === "blueprint"
    ? runPort(["api", "blueprints", "get", id, "-f", "json"], { allowFailure: true })
    : runPort(["api", "entities", "get", kind, id, "-f", "json"], { allowFailure: true });
  return result.status === 0;
}

function upsertBlueprint(tempDir, blueprint) {
  const file = writeTempJson(tempDir, `blueprint-${blueprint.identifier}`, blueprint);
  if (dryRun) {
    const command = ["api", "blueprints", "create", "--data", file];
    console.log(`[dry-run] port ${command.join(" ")}`);
    return;
  }

  const command = exists("blueprint", blueprint.identifier)
    ? ["api", "blueprints", "update", blueprint.identifier, "--data", file]
    : ["api", "blueprints", "create", "--data", file];

  runPort(command);
  console.log(`[ok] blueprint ${blueprint.identifier}`);
}

function upsertEntity(tempDir, blueprintId, entity) {
  const file = writeTempJson(tempDir, `entity-${blueprintId}-${entity.identifier}`, entity);
  if (dryRun) {
    const command = ["api", "entities", "create", blueprintId, "--data", file];
    console.log(`[dry-run] port ${command.join(" ")}`);
    return;
  }

  const command = exists(blueprintId, entity.identifier)
    ? ["api", "entities", "update", blueprintId, entity.identifier, "--data", file]
    : ["api", "entities", "create", blueprintId, "--data", file];

  runPort(command);
}

function listDirs(dir) {
  return readdirSync(dir)
    .filter((entry) => statSync(path.join(dir, entry)).isDirectory())
    .sort();
}

function walkFiles(dir, base = dir) {
  const entries = readdirSync(dir).sort();
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walkFiles(full, base));
    } else if (stat.isFile()) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function humanize(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return {};
  }
  const end = markdown.indexOf("\n---", 4);
  if (end === -1) {
    return {};
  }
  const body = markdown.slice(4, end).split("\n");
  const result = {};
  for (let index = 0; index < body.length; index += 1) {
    const line = body[index];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const key = match[1];
    const rawValue = match[2].trim();
    if ([">", ">-", "|", "|-"].includes(rawValue)) {
      const block = [];
      while (index + 1 < body.length && (body[index + 1].startsWith(" ") || body[index + 1] === "")) {
        index += 1;
        block.push(body[index].trim());
      }
      result[key] = rawValue.startsWith("|") ? block.join("\n").trim() : block.join(" ").trim();
    } else {
      result[key] = rawValue.replace(/^["']|["']$/g, "").trim();
    }
  }
  return result;
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return markdown;
  }
  const end = markdown.indexOf("\n---", 4);
  if (end === -1) {
    return markdown;
  }
  const bodyStart = markdown.indexOf("\n", end + 4);
  return bodyStart === -1 ? "" : markdown.slice(bodyStart + 1);
}

function skillEntity(groupId, skillId) {
  const skillDir = path.join(skillsRoot, groupId, skillId);
  const skillMd = readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
  const frontmatter = parseFrontmatter(skillMd);
  const instructions = stripFrontmatter(skillMd);
  const extraFiles = walkFiles(skillDir)
    .filter((file) => file !== "SKILL.md")
    .map((file) => ({
      path: file,
      content: readFileSync(path.join(skillDir, file), "utf8"),
    }));

  const scripts = extraFiles.filter((file) => file.path.startsWith("scripts/"));
  const additionalFiles = extraFiles.filter((file) => !file.path.startsWith("scripts/"));

  return {
    identifier: skillId,
    title: frontmatter.name || skillId,
    properties: {
      description: frontmatter.description || `${humanize(skillId)} skill imported from skills-registry-demo.`,
      instructions,
      location: "global",
      scripts,
      additional_files: additionalFiles,
    },
    relations: {
      skill_to_skill_group: [groupId],
    },
  };
}

function main() {
  if (!statSync(skillsRoot).isDirectory()) {
    throw new Error(`Missing skills root: ${skillsRoot}`);
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), "port-skills-bootstrap-"));
  let importedSkills = 0;
  try {
    upsertBlueprint(tempDir, groupBlueprint);
    upsertBlueprint(tempDir, skillBlueprint);

    const groupIds = listDirs(skillsRoot);
    for (const groupId of groupIds) {
      const skills = listDirs(path.join(skillsRoot, groupId));
      upsertEntity(tempDir, GROUP_BLUEPRINT, {
        identifier: groupId,
        title: humanize(groupId),
        properties: {
          description: `${humanize(groupId)} skills imported from skills-registry-demo.`,
          enforcement: "optional",
          auto_sync: false,
        },
      });

      for (const skillId of skills) {
        upsertEntity(tempDir, SKILL_BLUEPRINT, skillEntity(groupId, skillId));
        importedSkills += 1;
      }
      console.log(`[ok] group ${groupId}: ${skills.length} skill(s)`);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  console.log(`[done] imported ${importedSkills} skill(s) into ${groupIdsDescription()}`);
}

function groupIdsDescription() {
  return dryRun ? "dry-run output" : "Port";
}

main();
