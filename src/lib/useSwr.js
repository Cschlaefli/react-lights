import useSwrLib from "swr";

const baseUrl = "http://ruse:3000"
const fetcher = (url) => fetch(url).then((r) => r.json());

export function useSwr(url) {
	return useSwrLib(`${baseUrl}${url}`, fetcher);
}