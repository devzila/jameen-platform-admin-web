import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { NavLink, useNavigate, useParams, Link } from "react-router-dom";
import Loader from "components/Loader";

function Index() {
  const { companyId } = useParams();
  const [users, setusers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { get, response, loading } = useFetch();
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const isSearching = searchKeyword.length > 0;

  useEffect(() => {
    loadInitialusers();
  }, [currentPage, searchKeyword]);

  const addUser = () => {
    navigate(`/companies/${companyId}/users/add`);
  };

  async function loadInitialusers() {
    let endpoint = `/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`;

    if (searchKeyword) {
      endpoint += `&q[email_or_name_eq]=${searchKeyword}`;
    }

    const initialusers = await get(endpoint);

    if (response.ok) {
      setusers(initialusers.data);
      setPagination(initialusers.data.pagination);
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1);
  }

  return (
    <div className="p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 bg-transparent p-0">
            <li className="breadcrumb-item">
              <Link to="/companies" className="text-dark text-decoration-none">
                Companies
              </Link>
            </li>

            <li className="breadcrumb-item active text-dark">
              Users
            </li>
          </ol>
        </nav>

        <div className="d-flex align-items-center gap-2">

          <input
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control custom_input"
            type="search"
            placeholder="Search"
          />

          <button
            onClick={loadInitialusers}
            className="btn btn-outline-success custom_search_button"
          >
            <CIcon icon={freeSet.cilSearch} />
          </button>

          <button
            className="custom_theme_button btn"
            onClick={addUser}
          >
            Add User
          </button>

        </div>
      </div>

      <hr className="my-2" />

      {/* TABLE */}
      <div className="table-responsive bg-white">
        <table className="table table-striped mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div>
                    <h5 className="mb-2">
                      {isSearching ? "No Matching Users Found" : "No Users Found"}
                    </h5>

                    <p className="text-muted mb-3">
                      {isSearching
                        ? "Try searching with a different name or email."
                        : "No users have been added to this company yet."}
                    </p>

                    {!isSearching && (
                      <button
                        className="btn btn-primary"
                        onClick={addUser}
                      >
                        Add First User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <th>{user.name}</th>
                  <td>{user.email}</td>
                  <td>{user.mobile_number}</td>
                  <td>{user.role?.name}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle as={CustomDivToggle}>
                        <BsThreeDots />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <NavLink to={`/companies/${companyId}/users/${user.id}/edit`}>
                            Edit
                          </NavLink>
                        </Dropdown.Item>

                        <Dropdown.Item>
                          <NavLink to={`/companies/${companyId}/users/${user.id}`}>
                            User Show
                          </NavLink>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-3">
            <Loader />
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center mt-3">
        {pagination?.total_pages > 1 && (
          <Paginate
            onPageChange={handlePageClick}
            pageRangeDisplayed={pagination.per_page}
            pageCount={pagination.total_pages}
            forcePage={currentPage - 1}
          />
        )}
      </div>

    </div>
  );
}

export default Index;