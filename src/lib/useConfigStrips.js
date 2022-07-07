import { useSwr } from "./useSwr";

export function useConfigStrips(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/config_strips/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const config_strips = data;
	return [config_strips, { mutate, loading }];
}