import { LocalizationManager } from "./Localization";
// Receive data from the server
export interface Value<T = any> {
    Value: T;
}

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
    HelpNumber: number;
}
// Retrieve user data from the server
export async function fetchGroups() {
    const data = await fetchData<GroupSummary[]>(relativeURLWithPort(`sessions`, "8080"));

    return data ?? [];
}

export interface EDMOPlayer {
    name: string;
    HelpRequested: boolean;
}
export interface EDMOTask {
    key: string;
    strings: Record<string, string>;
    completed: boolean;
}
export interface GroupInfo {
    robotID: string;
    players: EDMOPlayer[];
    tasks: EDMOTask[];
    helpEnabled: boolean;
}

export async function fetchGroupInfo(robotName: string) {
    const data = await fetchData<GroupInfo>(relativeURLWithPort(`sessions/${robotName}`, "8080"));

    return data ?? { robotID: `${robotName} (${LocalizationManager.getString("notActive")})`, players: [], tasks: [], helpEnabled: false };
}

export async function sendGroupFeedback(robotName: string, message: string) {
    console.log(`${robotName} ${message}`);
    await fetchData(relativeURLWithPort(`sessions/${robotName}/feedback`, "8080"), { method: "PUT", body: message });
}

export async function setGroupTasks(robotName: string, taskname: string, value: boolean) {
    var obj = Object();
    obj["key"] = taskname;
    obj["completed"] = value;

    return await fetchData(relativeURLWithPort(`sessions/${robotName}/tasks`, "8080"), { method: "PUT", body: JSON.stringify(obj) });
}

export async function setHelpEnabled(robotName: string, value: boolean) {
    var obj = Object();
    obj["Value"] = value;

    return await fetchData(relativeURLWithPort(`sessions/${robotName}/helpEnabled`, "8080"), { method: "PUT", body: JSON.stringify(obj) });
}

export async function getSimpleModeEnabled() {
    return (await fetchData<Value<boolean>>(relativeURLWithPort(`simpleView`, "8080")))?.Value ?? false;
}

export async function setSimpleModeEnabled(value: boolean) {
    var obj = Object();
    obj["Value"] = value;
    return await fetchData(relativeURLWithPort(`simpleView`, "8080"), { method: "PUT", body: JSON.stringify(obj) });
}

export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
// export function relativeURLWithPort(relativeURLFromRoot: string, port: string) {
//     return `${window.location.protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
// }
export function relativeURLWithPort(relativeURLFromRoot: string, port: string, protocol: string | null = window.location.protocol) {
    return `${protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
}