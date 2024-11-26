import { Table, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Parasha } from '../../@Types/chabadType';
import { useSearch } from '../../hooks/useSearch';
import { deleteParashaById, getAllParashot } from '../../services/parasha-service';
import dialogs from '../../ui/dialogs';


const AdminParashot = () => {
    const { searchTerm } = useSearch();
    const [parashot, setParashot] = useState<Parasha[]>([]);
    const [filteredParashot, setFilteredParashot] = useState<Parasha[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllParashot()
            .then(data => {
                console.log('Parashot fetched:', data); // Log the response
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


    const handleDeleteParasha = async (parashaId: string) => {
        const result = await dialogs.confirm("Delete Parasha", "Are you sure you want to delete this parasha?");
        if (result.isConfirmed) {
            try {
                await deleteParashaById(parashaId);
                setParashot(parashot.filter(parasha => parasha._id !== parashaId));
                dialogs.success("Parasha Deleted", "The parasha has been deleted successfully.");
            } catch (err) {
                dialogs.error("Error", "Failed to delete the parasha.");
            }
        }
    };

    return (
        <div className="overflow-x-auto bg-white dark:border-gray-700 dark:bg-gray-800">
            <h2 className='text-4xl text-gray-800 mb-7 text-center mt-7'>Parashot</h2>
            <div className="admin-products-add-button mb-4 flex justify-end">
                <Tooltip content="Add Product" placement="top" className="text-sm bg-gray-800 text-white rounded px-2 py-1">
                    <a href="admin/parasha/create" className="text-white bg-[#c37d69] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <FiPlus size={20} />
                        <span className="sr-only">Add Product</span>
                    </a>
                </Tooltip>
            </div>
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500 text-center mb-4">{error.message}</div>}
            {!loading && filteredParashot.length === 0 && <div className="text-center">No parashot found.</div>}

            <div className="hidden lg:block">  {/* Desktop view */}
                {!loading && filteredParashot.length > 0 && (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Author</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Mini Text</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredParashot.map((parasha) => (
                                <Table.Row key={parasha._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{parasha.author}</Table.Cell>
                                    <Table.Cell>{parasha.title}</Table.Cell>
                                    <Table.Cell>{parasha.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(parasha.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col gap-2">
                                            <Link to={`/beitChabad/admin/edit/${parasha._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                Edit b
                                            </Link>
                                            <button onClick={() => handleDeleteParasha(parasha._id)} className="text-red-600 hover:text-red-800">
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>

            <div className="block lg:hidden">  {/* Mobile view */}
                {filteredParashot.map((parasha) => (
                    <div key={parasha._id} className="parasha-card p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                            {parasha.title} - {parasha.author}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">{parasha.miniText}</div>
                        <div className="text-gray-700 dark:text-gray-300">{new Date(parasha.createdAt).toLocaleDateString()}</div>
                        <div className="flex justify-between items-center mt-4">
                            <Link to={`/beitChabad/admin/edit/${parasha._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteParasha(parasha._id)} className="text-red-600 hover:text-red-800">
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminParashot;
