// Receive data from the server
async function fetchData(endpoint:string, options = {}) {
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
        return [];
    }
}
// Retrieve user data from the server
export async function fetchUserData(): Promise<any> {
    return await fetchData('assets/testUsers.json');
}
export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    return urlParams.get(param);
}