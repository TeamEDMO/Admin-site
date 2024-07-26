// Receive data from the server

async function fetchData<T = any>(endpoint: string, options = {}) {
    const response = await fetch(endpoint, options);

    if (!response.ok)
        return null;

    const data: T | null = await response.json();

    return data;
}

export interface GroupSummary {
    robotID: string;
    names: string[];
}
// Retrieve user data from the server
export async function fetchGroups() {
    const data = await fetchData<GroupSummary[]>(relativeURLWithPort(`activeSessions`, "8080"));

    return data ?? [];
}

export interface GroupInfo {
    robotID: string;
    players: { name: string; helpRequested: boolean }[]
}
export async function fetchGroupInfo(robotName: string) {
    const data = await fetchData<GroupInfo>(relativeURLWithPort(`sessions/${robotName}`, "8080"));

    return data ?? { robotID: `${robotName} (Not active)`, players: [] };
}

export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    return urlParams.get(param);
}

export function relativeURLWithPort(relativeURLFromRoot: string, port: string) {
    return `${window.location.protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
}