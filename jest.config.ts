import type {Config} from 'jest';

export default async (): Promise<Config> => {
	return {
		preset: "ts-jest",
		testEnvironment: "jsdom",
		transform: {
			"^.+\\.ts?$": "ts-jest",
		},
		transformIgnorePatterns: ["<rootDir>/node_modules/"],
	};
};