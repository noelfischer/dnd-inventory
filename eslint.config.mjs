import nextVitals from "eslint-config-next/core-web-vitals";

export default [
	{
		ignores: [".next/**", "node_modules/**"],
	},
	...nextVitals,
	{
		rules: {
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/immutability": "off",
		},
	},
];