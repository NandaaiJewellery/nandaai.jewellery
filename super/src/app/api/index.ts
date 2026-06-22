export const BASE_URL: string =
    process.env.NODE_ENV === "development"
        ? process.env.DEV_URL!
        : process.env.NEXT_PUBLIC_APP_URL!;

const API = {
    catalogue: (id?: string) =>
        `${BASE_URL}/api/catalogue${id ? `/${id}` : ""}`,
};
export default API;