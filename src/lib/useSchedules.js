import { useSwr } from "./useSwr";

export function useSchedules(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/schedule/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const schedules = data;
	return [schedules, { mutate, loading }];
}