import { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
	return {
		preset: "ts-jest",
		testEnvironment: "jsdom",
		transform: {
			"^.+\\.ts?$": [
				"ts-jest",
				{
					tsconfig: "tsconfig.json",
				},
			],
		},
		transformIgnorePatterns: ["<rootDir>/node_modules/"],
		// The Playwright specs in e2e/ and the documentation site have their own runner.
		testPathIgnorePatterns: ["/node_modules/", "<rootDir>/e2e/", "<rootDir>/site/"],
	};
};
