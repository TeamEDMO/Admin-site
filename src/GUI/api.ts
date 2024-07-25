// Receive data from the server
async function fetchData(endpoint: string, options = {}) {
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
export interface GroupSummary {
    robotID: string;
    names: string[];
}
// Retrieve user data from the server
export async function fetchGroups() {
    const data: GroupSummary[] | null = await fetchData(relativeURLWithPort(`activeSessions`, "8080"));

    if (!data)
        return [];

    return data;
}

export interface GroupInfo {
    robotName: string;
    players: { name: string; helpRequested: boolean }[]
}
export async function fetchGroupInfo(robotName: string) {
    const data: GroupInfo | null = await fetchData(relativeURLWithPort(`sessions/${robotName}`, "8080"));

    if (!data) {
        const sampleUser: GroupInfo = {
            robotName: `${robotName} (Not active)`,
            players: []
        };
        return sampleUser;
    }
    return data;
}

export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    return urlParams.get(param);
}

export function relativeURLWithPort(relativeURLFromRoot: string, port: string) {
    return `${window.location.protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
}