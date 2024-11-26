import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Parasha } from '../../@Types/chabadType';
import { deleteParashaById, getAllParashot, updateParasha } from '../../services/parasha-service';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import dialogs from '../../ui/dialogs';
import { Link } from 'react-router-dom';
import './AdminParashot.scss';

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
        <div className="admin-parashot">
            <h2 className="admin-parashot-title">Parashot</h2>

            {loading && <div className="loading-text">Loading...</div>}
            {error && <div className="error-text">{error.message}</div>}
            {!loading && filteredParashot.length === 0 && <div className="no-parashot-text">No parashot found.</div>}

            <div className="desktop-view">
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
                                <Table.Row key={parasha._id} className="parasha-row">
                                    <Table.Cell>{parasha.author}</Table.Cell>
                                    <Table.Cell>{parasha.title}</Table.Cell>
                                    <Table.Cell>{parasha.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(parasha.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <div className="actions">
                                            <Link to={`/beitChabad/editParasha/${parasha._id}`} className="edit-link">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDeleteParasha(parasha._id)} className="delete-button">
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

            <div className="mobile-view">
                {filteredParashot.map((parasha) => (
                    <div key={parasha._id} className="parasha-card">
                        <div className="parasha-title">
                            {parasha.title} - {parasha.author}
                        </div>
                        <div className="parasha-text">{parasha.miniText}</div>
                        <div className="parasha-date">{new Date(parasha.createdAt).toLocaleDateString()}</div>
                        <div className="mobile-actions">
                            <Link to={`/beitChabad/editParasha/${parasha._id}`} className="edit-link">
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteParasha(parasha._id)} className="delete-button">
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
