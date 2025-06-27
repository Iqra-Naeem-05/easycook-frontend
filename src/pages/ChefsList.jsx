import { useEffect, useState, useContext } from "react";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ChefListCard from "../components/ChefListCard";
import { FaSpinner } from "react-icons/fa";

const ChefsList = () => {
  const [chefs, setChefs] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChefs(page);
  }, [user]);

  const fetchChefs = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/chefs-list/?page=${pageNum}`);
      setChefs(response.data.results);
      setCount(response.data.count);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching chefs:", error);
      setChefs([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(count / 8);

  const handleNext = () => {
    if (page < totalPages) fetchChefs(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) fetchChefs(page - 1);
  };

  if (isLoggedIn === null) return null;

  const filteredChefs = chefs.filter((chef) => {
    const query = searchTerm.toLowerCase();
    return (
      chef.username?.toLowerCase().includes(query) ||
      chef.chefprofile?.location?.toLowerCase().includes(query) ||
      chef.chefprofile?.specialties?.toLowerCase().includes(query) ||
      chef.chefprofile?.gender?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-icon fs-1 text-navyBlue" />
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold text-brown mt-n2">Meet Our Chefs</h2>

      <div className="d-flex justify-content-end mb-1">
        <input
          type="text"
          className="form-control form-control-sm w-25 border-maron"
          placeholder="Search chefs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        {filteredChefs.length > 0 ? (
          filteredChefs.map((chef) => (
            <ChefListCard key={chef.id} chef={chef} />
          ))
        ) : (
          <p className="text-center">No chefs match your search.</p>
        )}
      </div>

      {/* Prev/Next Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-navyBlue" onClick={handlePrevious}>Previous</button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">Page {page} of {totalPages}</span>
              </li>
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-navyBlue" onClick={handleNext}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ChefsList;
