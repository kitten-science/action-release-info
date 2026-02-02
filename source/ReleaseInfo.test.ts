import { rm, stat } from "node:fs/promises";
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Moctokit } from "@kie/mock-github";
import { unknownToError } from "@oliversalzburg/js-utils/errors/error-serializer.js";
import { expect } from "chai";
import { it } from "mocha";
import { ReleaseInfo } from "./ReleaseInfo.js";

const mockHappyPath = (moctokit: Moctokit) => {
  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "dev",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/dev/kitten-scientists-2.0.0-beta.9-dev-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.9-dev-2179ddb.user.js",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/dev",
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "nightly",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/kitten-scientists-2.0.0-beta.9-20231025-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.9-20231025-2179ddb.user.js",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.9/kitten-scientists-2.0.0-beta.7.user.js",
            name: "kitten-scientists-2.0.0-beta.7.user.js",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        name: "v2.0.0-beta.9",
      },
      status: 200,
    });
};

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "kitten-science/kitten-scientists";
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("INPUT_")) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env[key];
    }
  }
});

after(() => rm("./release-info.json"));

it("fails without assets", async () => {
  const moctokit = new Moctokit();

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "next",
    })
    .reply({
      data: {
        assets: undefined,
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "nightly",
    })
    .reply({
      data: {
        assets: undefined,
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      data: {
        assets: undefined,
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        name: "v2.0.0-beta.9",
      },
      status: 200,
    });

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo
    .main()
    .then(() => {
      throw new Error("Expected unit to throw.");
    })
    .catch((error: unknown) =>
      expect(unknownToError(error).message).to.match(/No assets found in release./),
    );
});

it("fails if no usescript in release", async () => {
  const moctokit = new Moctokit();

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "next",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/README.md",
            name: "README.md",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "nightly",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/README.md",
            name: "README.md",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
      },
      status: 200,
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      data: {
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.9/README.md",
            name: "README.md",
          },
        ],
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        name: "v2.0.0-beta.9",
      },
      status: 200,
    });

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo
    .main()
    .then(() => {
      throw new Error("Expected unit to throw.");
    })
    .catch((error: unknown) =>
      expect(unknownToError(error).message).to.match(/Couldn't find userscript in assets./),
    );
});

it("runs", async () => {
  const moctokit = new Moctokit();

  mockHappyPath(moctokit);

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo.main();
});

it("writes release info to file", async () => {
  const moctokit = new Moctokit();

  process.env.INPUT_FILENAME = "release-info.json";

  mockHappyPath(moctokit);

  const releaseInfo = new ReleaseInfo({
    context: { repo: {} } as unknown as typeof context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo.main();

  await stat("./release-info.json").then(stats => expect(stats).to.exist);
});
