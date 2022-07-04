import { useSwr } from "./useSwr";
import {deserializeStrip} from "../services/DeviceService"

export function useStrip(params) {
	const query = new URLSearchParams(params).toString();
	const { data, mutate } = useSwr(`/strips/?${query}`);
	// if data is not defined, the query has not completed
	const loading = !data;
	//deserialize here
	const strip = data ? deserializeStrip(data) : data;
	return [strip, { mutate, loading }];
}