import { useSwr } from "./useSwr";

export function useConfig(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/config/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const config = data;
	return [config, { mutate, loading }];
}