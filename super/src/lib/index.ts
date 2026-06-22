const API_BASE: string = process.env.NEXT_PUBLIC_API_URL!;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? res.statusText);
    return data as T;
}

export const api = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export default API_BASE;

export async function verifyUserData(
    serverResponse: any,
    credentials: any
) {
    const data = await serverResponse.json();
    const user = data?.[0];

    if (!user) {
        console.error("No user found");
        return null;
    }

    if (
        credentials.email !== user.address.e ||
        credentials.password !== user.source.sauce
    ) return null;

    return {
        id: String(user.uId),
        email: user.address.e,
        role: user.authority.super,
        token: user.authority.recognize,
    };
}