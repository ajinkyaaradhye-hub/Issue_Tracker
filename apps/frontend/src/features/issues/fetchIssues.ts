import axios from "axios";

export interface IssueFilters {
    role?: string;
    status?: string;
    priority?: string;
}

export const fetchIssues = async (filters: IssueFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);

    const token = localStorage.getItem("token");

    const query = params.toString();
    const url = query ? `/api/issues?${query}` : "/api/issues";

    const { data } = await axios.get(url, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true, // optional if backend expects cookies
    });

    return data;
};
