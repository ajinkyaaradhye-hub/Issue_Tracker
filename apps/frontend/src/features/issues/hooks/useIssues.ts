import { useQuery } from "@tanstack/react-query";
import { fetchIssues, type IssueFilters } from "../fetchIssues";


export const useIssues = (filters: IssueFilters) => {
    return useQuery({
        queryKey: ["issues", filters],
        queryFn: () => fetchIssues(filters),
        placeholderData: (prev) => prev,
    });
};
