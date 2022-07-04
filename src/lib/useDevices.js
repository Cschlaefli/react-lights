import { useSwr } from "./useSwr";

export function useDevices() {
	const { data, mutate } = useSwr("/dev");
	// if data is not defined, the query has not completed
	const loading = !data;
	const devices = data;
	return [devices, { mutate, loading }];
}