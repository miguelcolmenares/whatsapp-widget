import { execFileSync } from "node:child_process";
import type { RepositoryHistory } from "../application";

/** Runs `git` with these arguments in a folder and returns its output, or undefined when git fails. */
export type GitRunner = (cwd: string, args: string[]) => string | undefined;

/**
 * The environment for a child process without the variables a git hook sets. Inside a hook,
 * GIT_DIR would point `git` at the hook's repository instead of the folder asked about.
 */
function cleanEnvironment(): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")),
  );
}

/** The `GitRunner` backed by the `git` on the machine. */
export const runGit: GitRunner = (cwd, args) => {
  try {
    return execFileSync("git", args, {
      cwd,
      env: cleanEnvironment(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 15_000,
    }).trim();
  } catch {
    return undefined;
  }
};

/**
 * Read the history of the folder the sources are in, with `git` at build time.
 *
 * The date of a file is `git log -1 --format=%aI -- <file>`: the author date of the last commit
 * that changed that file, not the last commit of the repository. A file git does not know has none.
 */
export function readGitHistory(root: string, run: GitRunner = runGit): RepositoryHistory {
  const available = run(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
  if (!available) {
    return { available: false, shallow: false, prefix: "", lastChange: () => undefined };
  }
  return {
    available,
    shallow: run(root, ["rev-parse", "--is-shallow-repository"]) === "true",
    prefix: run(root, ["rev-parse", "--show-prefix"]) ?? "",
    lastChange: (path) => run(root, ["log", "-1", "--format=%aI", "--", path]) || undefined,
  };
}
