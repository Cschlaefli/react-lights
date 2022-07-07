import { useSwr } from "./useSwr";

export function useDevices(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/dev/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const devices = data;
	return [devices, { mutate, loading }];
}