import { useSwr } from "./useSwr";

export function useDevice(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/dev/${params.address}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	const device = data;
	return [device, { mutate, loading }];
}