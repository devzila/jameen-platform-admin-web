import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Modal, Button } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { NavLink, useNavigate, useParams, Link } from "react-router-dom";
import Loader from "components/Loader";
import defaultAvatar from "assets/img/jameen-logo.png";

function Index() {
  const { companyId } = useParams();

  const [users, setusers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const { get, put, response, loading } = useFetch();
  const navigate = useNavigate();

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

  const openResetModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
    setResetSuccess(false);
    setApiMessage("");
  };

  const handleResetPassword = async () => {
    const res = await put(
      `/v1/platform_admin/companies/${companyId}/users/${selectedUserId}/reset_password`
    );

    if (response.ok) {
      setResetSuccess(true);
      setApiMessage(res.message || "Password reset successfully.");
    } else {
      setResetSuccess(true);
      setApiMessage(res.error || "Something went wrong");
    }
  };

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
            <li className="breadcrumb-item active text-dark">Users</li>
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

          <button className="custom_theme_button btn" onClick={addUser}>
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
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.avatar_url || defaultAvatar}
                    alt={user.name || "User"}
                    width={20}
                    height={20}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                </td>
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
                      <Dropdown.Item
                        as={NavLink}
                        to={`/companies/${companyId}/users/${user.id}/edit`}
                      >
                        Edit
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={NavLink}
                        to={`/companies/${companyId}/users/${user.id}`}
                      >
                        User Show
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => openResetModal(user.id)}
                      >
                        Reset Password
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <Loader />}
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

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          {!resetSuccess ? (
            <>
              <div className="mb-3">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#fff3cd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <CIcon icon={freeSet.cilWarning} size="xl" />
                </div>
              </div>

              <h5 className="fw-bold">Confirm Password Reset</h5>
              <p className="text-muted mt-2">
                Are you sure you want to reset this user's password?
              </p>
            </>
          ) : (
            <>
              <div className="mb-3">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#d1e7dd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <CIcon icon={freeSet.cilCheckCircle} size="xl" />
                </div>
              </div>

              <h5 className="fw-bold text-success">Success</h5>
              <p className="text-muted mt-2">{apiMessage}</p>
              <small className="text-muted">
                A new password has been sent to the user's email.
              </small>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center">
          {!resetSuccess ? (
            <>
              <Button
                variant="light"
                onClick={() => setShowModal(false)}
                className="px-4"
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleResetPassword}
                disabled={loading}
                className="px-4"
              >
                {loading ? "Processing..." : "Yes, Reset"}
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={() => setShowModal(false)}
              className="px-5"
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Index;