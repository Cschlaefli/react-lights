import { useSwr } from "./useSwr";

export function useDeviceStrips(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/dev_strips/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const strips = data;
	return [strips, { mutate, loading }];
}