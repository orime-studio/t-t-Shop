import { useEffect, useState } from 'react';
import {
  getCarouselImages,
  addCarouselImage,
  deleteCarouselImage,
} from '../services/carousela';
import { Table, Tooltip } from 'flowbite-react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import dialogs from '../ui/dialogs';
import './CarouselAdmin.scss';


const CarouselManager = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const data = await getCarouselImages();
      setImages(data);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      setError(error as Error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("alt", altText);

    try {
      await addCarouselImage(formData);
      fetchCarouselImages();
      setSelectedFile(null);
      setAltText("");
    } catch (error) {
      console.error("Error adding carousel image:", error);
      setError(error as Error);
    }
  };

  const onDelete = (id: string) => {
    dialogs.confirm("Are you sure?", "Do you want to delete this image?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteCarouselImage(id);
            setImages(images.filter(image => image._id !== id));
            dialogs.success("Deleted!", "The image has been deleted.");
          } catch (err) {
            console.error("Error deleting image:", err);
            setError(err as Error);
          }
        }
      })
      .catch(err => setError(err as Error));
  };

  return (
    <div className="admin-carousel-container">
      <h2 className='text-4xl text-gray-800 mb-4 text-center'>Carousel Images</h2>
      <div className="admin-carousel-add-button mb-4 flex justify-end">
        <Tooltip content="Add Image" placement="top" className="text-sm bg-gray-800 text-white rounded px-2 py-1">
          <button
            onClick={handleAddImage}
            className="text-white bg-[#c37d69] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FiPlus size={20} />
            <span className="sr-only">Add Image</span>
          </button>
        </Tooltip>
      </div>
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Alt text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="ml-2 border border-gray-300 rounded p-2"
        />
      </div>
      {error && <div className="text-red-500 text-center mb-4">{error.message}</div>}
      {/* Desktop View */}
      <Table hoverable className="hidden md:table">
        <Table.Head>
          <Table.HeadCell>Image & Alt Text</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Actions</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {images.map((image) => (
            <Table.Row key={image._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <img src={image.url} alt={image.alt} className="h-12 w-12 object-cover rounded-full mr-4" />
                <div className="flex flex-col">
                  <span>{image.alt}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="table-actions">
                  {/* ניתן להוסיף פונקציונליות עריכה כאן */}
                  <button onClick={() => onDelete(image._id)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/* Mobile View */}
      <div className="grid md:hidden gap-4">
        {images.map((image) => (
          <div key={image._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img src={image.url} alt={image.alt} className="h-12 w-12 object-cover rounded-full mr-4" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{image.alt}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              {/* ניתן להוסיף פונקציונליות עריכה כאן */}
              <button onClick={() => onDelete(image._id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;
