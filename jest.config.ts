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
	};
};
