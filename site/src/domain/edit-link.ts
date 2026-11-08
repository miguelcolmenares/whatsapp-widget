/** The repository hosts whose edit address the kit knows how to build. */
export const EDIT_HOSTS = ["github", "gitlab", "bitbucket"] as const;

/** A repository host whose edit address the kit knows. */
export type EditHost = (typeof EDIT_HOSTS)[number];

/** What an address needs: where the repository is, the branch to edit on and the file in the repository. */
export interface EditAddressInput {
  /** Web address of the repository, for example `https://github.com/user/repo`. */
  repository: string;
  host: EditHost;
  branch: string;
  /** Path of the file from the root of the git repository, with forward slashes. */
  path: string;
}

/** The host to use, or the reason there is none. The reason is a sentence for the person who wrote the config. */
export type EditHostResolution = { ok: true; host: EditHost } | { ok: false; reason: string };

const KNOWN_HOSTNAMES: Record<string, EditHost> = {
  "github.com": "github",
  "www.github.com": "github",
  "gitlab.com": "gitlab",
  "www.gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket",
  "www.bitbucket.org": "bitbucket",
};

/** The host of a repository address, by its domain, or undefined when the domain is not one of the three. */
export function detectEditHost(repository: string | undefined): EditHost | undefined {
  if (!repository) return undefined;
  try {
    return KNOWN_HOSTNAMES[new URL(repository).hostname.toLowerCase()];
  } catch {
    return undefined;
  }
}

/**
 * Decide which host the edit link is for. `editLink.host` wins, because a repository on a domain of
 * its own (a self-hosted GitLab) cannot be told from its address. Without it the host comes from the
 * address of `site.repository`. When neither answers, the result says why, so the link is turned off
 * with a message and never built as an address that goes nowhere.
 */
export function resolveEditHost(
  repository: string | undefined,
  host: EditHost | undefined,
): EditHostResolution {
  if (!repository) {
    return {
      ok: false,
      reason: "editLink is on, but site.repository is not set, so there is no address to edit on.",
    };
  }
  const found = host ?? detectEditHost(repository);
  if (!found) {
    return {
      ok: false,
      reason: `editLink is on, but the host of ${repository} is not known. Set editLink.host to ${EDIT_HOSTS.map((name) => `"${name}"`).join(", ")}, or turn editLink off.`,
    };
  }
  return { ok: true, host: found };
}

/** Encode each segment of a path and keep the slashes, so a name with a space or a `#` stays one segment. */
function encodePath(path: string): string {
  return path
    .split("/")
    .filter((segment) => segment !== "")
    .map(encodeURIComponent)
    .join("/");
}

/**
 * The address where a reader edits a file: `{repository}/edit/{branch}/{path}` on GitHub,
 * `{repository}/-/edit/{branch}/{path}` on GitLab and `{repository}/src/{branch}/{path}?mode=edit`
 * on Bitbucket. A trailing slash or `.git` on the repository is dropped.
 */
export function editAddress(input: EditAddressInput): string {
  const repository = input.repository.replace(/\/+$/, "").replace(/\.git$/i, "");
  const branch = encodePath(input.branch);
  const path = encodePath(input.path);
  switch (input.host) {
    case "github":
      return `${repository}/edit/${branch}/${path}`;
    case "gitlab":
      return `${repository}/-/edit/${branch}/${path}`;
    case "bitbucket":
      return `${repository}/src/${branch}/${path}?mode=edit`;
  }
}
