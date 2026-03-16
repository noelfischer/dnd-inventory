import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
	{
		ignores: [".next/**", "node_modules/**", "playwright-report/**"],
	},
	...nextVitals,
	{
		rules: {
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/immutability": "off",
		},
	},
];

export default config;