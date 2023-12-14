// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			apiKey: string;
			apiSecret: string;
			plantId: string;
			pollInterval: number;
			epl: boolean
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };