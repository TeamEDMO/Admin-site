// Receive data from the server

export async function fetchData<T = any>(endpoint: string, options?: RequestInit) {
    try {
        const response = await fetch(endpoint, options);

        if (!response.ok)
            return null;

        const data: T | null = await response.json();

        return data;
    }
    catch {
        return null;
    }
}

export interface GroupSummary {
    robotID: string;
    names: string[];
}
// Retrieve user data from the server
export async function fetchGroups() {
    const data = await fetchData<GroupSummary[]>(relativeURLWithPort(`sessions`, "8080"));

    return data ?? [];
}

export interface GroupInfo {
    robotID: string;
    players: { name: string; helpRequested: boolean; }[];
}
export async function fetchGroupInfo(robotName: string) {
    const data = await fetchData<GroupInfo>(relativeURLWithPort(`sessions/${robotName}`, "8080"));

    return data ?? { robotID: `${robotName} (Not active)`, players: [] };
}

export async function sendGroupFeedback(robotName: string, message: string) {
    await fetchData(relativeURLWithPort(`sessions/${robotName}/feedback`, "8080"), { method: "PUT", body: message });
}


export async function getGroupTasks(robotName: string) {
    return await fetchData<{ taskName: string, completed: boolean; }>(relativeURLWithPort(`sessions/${robotName}/tasks`, "8080"));
}
export async function setGroupTasks(robotName: string, taskname: string, value: boolean) {
    var obj = Object()
    obj[taskname] = value

    return await fetchData(relativeURLWithPort(`sessions/${robotName}/tasks`, "8080"), { method: "PUT", body: JSON.stringify(obj) });
}

export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

export function relativeURLWithPort(relativeURLFromRoot: string, port: string) {
    return `${window.location.protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
}