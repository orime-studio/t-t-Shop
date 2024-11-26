import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Parasha } from '../../@Types/chabadType';
import { getAllParashot } from '../../services/parasha-service';


const AdminParashot = () => {
    const { searchTerm } = useSearch();
    const [parashot, setParashot] = useState<Parasha[]>([]);
    const [filteredParashot, setFilteredParashot] = useState<Parasha[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllParashot()
            .then(data => {
                console.log('Parashot fetched:', data); // הדפס את התגובה כאן
                if (Array.isArray(data)) {
                    setParashot(data);
                    setFilteredParashot(data);
                } else {
                    setError(new Error("Unexpected response format"));
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredParashot(
            parashot.filter(parasha =>
                parasha.title.toLowerCase().includes(lowercasedSearchTerm) ||
                parasha.author.toLowerCase().includes(lowercasedSearchTerm) ||
                parasha.miniText.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [searchTerm, parashot]);

    return (
        <div className="overflow-x-auto bg-white dark:border-gray-700 dark:bg-gray-800">
            <h2 className='text-4xl text-gray-800 mb-7 text-center mt-7'>Parashot</h2>

            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500 text-center mb-4">{error.message}</div>}
            {!loading && filteredParashot.length === 0 && <div className="text-center">No parashot found.</div>}

            <div className="hidden lg:block">  {/* תצוגה לדסקטופ */}
                {!loading && filteredParashot.length > 0 && (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Author</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Mini Text</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredParashot.map((parasha) => (
                                <Table.Row key={parasha._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{parasha.author}</Table.Cell>
                                    <Table.Cell>{parasha.title}</Table.Cell>
                                    <Table.Cell>{parasha.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(parasha.createdAt).toLocaleDateString()}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>

            <div className="block lg:hidden">  {/* תצוגה למובייל */}
                {filteredParashot.map((parasha) => (
                    <div key={parasha._id} className="parasha-card p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                            {parasha.title} - {parasha.author}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">{parasha.miniText}</div>
                        <div className="text-gray-700 dark:text-gray-300">{new Date(parasha.createdAt).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminParashot;
