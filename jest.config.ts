import { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
	return {
		preset: "ts-jest",
		testEnvironment: "jsdom",
		transform: {
			"^.+\\.ts?$": "ts-jest",
		},
		transformIgnorePatterns: ["<rootDir>/node_modules/"],
		globals: {
			"ts-jest": {
				tsconfig: "tsconfig.json", // Ruta al archivo tsconfig.json
			},
		},
	};
};
