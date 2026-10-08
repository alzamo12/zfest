import { useState } from "react";
import FestCard from "../../components/FestCard/FestCard";
import FestCardSkeleton from "../../components/FestCardSkeleton/FestCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function Fests() {
    //   const [fests, setFests] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const axiosPublic = useAxiosPublic();

    const { data: fests = [], error: queryError, refetch, isLoading: loading } = useQuery({
        queryKey: ['fests'],
        queryFn: async () => {
            const res = await axiosPublic.get('/fests');
            return res.data;
        }
    });

    //   source -gpt
    // const load = async (signal) => {
    //     try {
    //         setLoading(true);
    //         setError("");

    //         const data = await getFests(signal);

    //         setFests(data);
    //     } catch (err) {
    //         if (err.name !== "AbortError") {
    //             setError(err.message);
    //         }
    //     } finally {
    //         if (!signal.aborted) {
    //             setLoading(false);
    //         }
    //     }
    // };

    // // gpt
    // useEffect(() => {
    //     const controller = new AbortController();

    //     getFests(controller.signal)
    //         .then((data) => {
    //             setFests(data);
    //         })
    //         .catch((err) => {
    //             if (err.name !== "AbortError") {
    //                 setError(err.message);
    //             }
    //         })
    //         .finally(() => {
    //             if (!controller.signal.aborted) {
    //                 setLoading(false);
    //             }
    //         });

    //     return () => controller.abort();
    // }, []);

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold sm:text-4xl">Fests</h1>
                    <p className="mt-1 text-base-content/70">
                        Find a fest, check its events, and register.
                    </p>
                </div>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, venue or city"
                    aria-label="Search fests"
                    className="input input-bordered w-full sm:w-80"
                />
            </header>

            {queryError ? (
                <div role="alert" className="alert alert-error">
                    <span>Couldn't load fests: {queryError}</span>
                    <button className="btn btn-sm" onClick={() => refetch()}>
                        Try again
                    </button>
                </div>
            ) : loading ? (
                <Grid>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <FestCardSkeleton key={i} />
                    ))}
                </Grid>
            ) : fests.length === 0 ? (
                <div className="rounded-box border border-dashed border-base-300 py-20 text-center">
                    <p className="text-lg font-medium">
                        {query ? "No fests match your search" : "No fests yet"}
                    </p>
                    <p className="mt-1 text-base-content/70">
                        {query ? "Try a different name or city." : "Check back soon."}
                    </p>
                </div>
            ) : (
                <Grid>
                    {fests.map((fest) => (
                        <FestCard key={fest._id} fest={fest} />
                    ))}
                </Grid>
            )}
        </main>
    );
}

const Grid = ({ children }) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);
