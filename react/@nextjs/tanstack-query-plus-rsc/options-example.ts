import { queryOptions } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

type Test = {
    id: string;
    name: string;
};

type CustomError = {
  message: string;
};

export const testOptions = queryOptions<Test, CustomError>({
  queryKey: ["custom-tag"],
  queryFn: async () => fetcher("/api"),
});

// USAGE EXAMPLE - useQuery
const { data, error, isLoading } = useQuery(testOptions);

// USAGE EXAMPLE - useMutation
const mutation = useMutation<Test, CustomError, string>({ // This infers the type of TData, TError and TVariables
    mutationFn: async (newName) => {
        return fetcher<Test>("/api", {
            method: "POST",
            body: JSON.stringify({ name: newName }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    onSuccess: (data) => {
        console.log("Data will be of type Test here:", data);
    },
    onError: (error) => {
        console.error("Error will be of type CustomError here:", error.message);
    }
})