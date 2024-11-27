import { Table, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Parasha } from '../../@Types/chabadType';
import { useSearch } from '../../hooks/useSearch';
import { deleteParashaById, getAllParashot } from '../../services/parasha-service';
import dialogs from '../../ui/dialogs';
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
                parasha.source.toLowerCase().includes(lowercasedSearchTerm) ||
                parasha.miniText.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [searchTerm, parashot]);

    const handleDeleteParasha = async (parashaId: string) => {
        const result = await dialogs.confirm("מחיקת פרשה", "האם אתה בטוח שברצונך למחוק את הפרשה?");
        if (result.isConfirmed) {
            try {
                await deleteParashaById(parashaId);
                setParashot(parashot.filter(parasha => parasha._id !== parashaId));
                dialogs.success("פרשה נמחקה", "הפרשה נמחקה בהצלחה.");
            } catch (err) {
                dialogs.error("שגיאה", "לא הצלחנו למחוק את הפרשה.");
            }
        }
    };

    return (
        <div className="admin-parashot-container">
            <h2 className="admin-parashot-header">רשימת פרשות</h2>
            <div className="admin-parashot-add-button">
                <Tooltip content="הוסף פרשה" placement="top" className="text-sm bg-gray-800 text-white rounded px-2 py-1">
                    <a href="admin/parasha/create" className="text-white bg-[#c37d69] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <FiPlus size={20} />
                        <span className="sr-only">הוסף פרשה</span>
                    </a>
                </Tooltip>
            </div>
            {loading && <div className="text-center">טוען...</div>}
            {error && <div className="text-red-500 text-center mb-4">{error.message}</div>}
            {!loading && filteredParashot.length === 0 && <div className="text-center">לא נמצאו פרשות.</div>}

            <div className="hidden lg:block">  {/* Desktop view */}
                {!loading && filteredParashot.length > 0 && (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>תמונה</Table.HeadCell>
                            <Table.HeadCell>מחבר</Table.HeadCell>
                            <Table.HeadCell>כותרת</Table.HeadCell>
                            <Table.HeadCell>טקסט מקוצר</Table.HeadCell>
                            <Table.HeadCell>תאריך יצירה</Table.HeadCell>
                            <Table.HeadCell>פעולות</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredParashot.map((parasha) => (
                                <Table.Row key={parasha._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img
                                            src={parasha.image.url}
                                            alt={parasha.title}
                                            className="parasha-image"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{parasha.source}</Table.Cell>
                                    <Table.Cell>{parasha.title}</Table.Cell>
                                    <Table.Cell>{parasha.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(parasha.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <div className="parasha-actions">
                                            <Link to={`/beitChabad/admin/parasha/edit/${parasha._id}`} className="parasha-actions a">
                                                ערוך
                                            </Link>
                                            <button onClick={() => handleDeleteParasha(parasha._id)} className="parasha-actions button">
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

            <div className="block lg:hidden">
                {filteredParashot.map((parasha) => (
                    <div key={parasha._id} className="parasha-card">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={parasha.image.url}
                                alt={parasha.title}
                                className="parasha-image"
                            />
                            <div>
                                <div className="parasha-text">{parasha.title}</div>
                                <div className="parasha-text-secondary">{parasha.source}</div>
                            </div>
                        </div>
                        <div className="parasha-text-secondary mb-2">{parasha.miniText}</div>
                        <div className="parasha-text-secondary">{new Date(parasha.createdAt).toLocaleDateString()}</div>
                        <div className="flex justify-between items-center mt-4">
                            <Link to={`/beitChabad/admin/parasha/edit/${parasha._id}`} className="parasha-actions a">
                                ערוך
                            </Link>
                            <button onClick={() => handleDeleteParasha(parasha._id)} className="parasha-actions button">
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
