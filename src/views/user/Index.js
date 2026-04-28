import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import { CNavbar, CContainer, CNavbarBrand, CCol, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import Loader from "components/Loader";

function Index() {
  const { companyId } = useParams();
  const [users, setusers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { get, post, response, loading } = useFetch();
  const [searchKeyword, setSearchKeyword] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadInitialusers();
  }, [currentPage]);


  const addUser = () => {
    navigate(`/companies/${companyId}/users/add`);
  };


  async function loadInitialusers() {
    let endpoint = `/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`;
    if (searchKeyword) {
      endpoint += `&q[username_cont]=${searchKeyword}`;
    }

    let initialusers = await get(endpoint);

    if (response.ok) {
      setusers(initialusers.data);
      setPagination(initialusers.data.pagination);
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1);
  }

  //RESET PASSWORD FUNCTION
  async function handleResetPassword(id) {
    if (!window.confirm("Reset password ")) return;

    try {
      await post(
        `/v1/platform_admin/companies/${companyId}/users/${id}/reset_password`
      );

      if (response.ok) {
        alert("Password reset ");
      } else {
        alert("password reset successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Error aaya ");
    }
  }

  return (
    <div>
      <section>
        <div className="mask d-flex align-items-center h-100 mt-3">
          <div className="w-100">
            <div className="row justify-content-center">
              <div className="col-12">

                {/* HEADER */}
                <CNavbar expand="lg" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand>User</CNavbarBrand>

                    <div className="d-flex justify-content-end">
                      <input
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="form-control custom_input"
                        placeholder="Search"
                      />

                      <button
                        onClick={loadInitialusers}
                        className="btn btn-outline-success"
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>

                      <button
                        className="btn btn-primary mx-3"
                        onClick={addUser}
                      >
                        Add User
                      </button>
                    </div>
                  </CContainer>
                </CNavbar>

                <hr />

                {/* TABLE */}
                <div className="table-responsive bg-white">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
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
                                  <NavLink
                                    to={`/companies/${companyId}/users/${user.id}/edit`}
                                  >
                                    Edit
                                  </NavLink>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <NavLink
                                    to={`/companies/${companyId}/users/${user.id}`}
                                  >
                                    User Show
                                  </NavLink>
                                </Dropdown.Item>

                                {/* ✅ RESET PASSWORD ADDED */}
                                <Dropdown.Item
                                  onClick={() =>
                                    handleResetPassword(user.id)
                                  }
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
                <CNavbar className="bg-light d-flex justify-content-center">
                  <CRow>
                    <CCol md="12">
                      {pagination?.total_pages > 1 && (
                        <Paginate
                          onPageChange={handlePageClick}
                          pageCount={pagination.total_pages}
                          forcePage={currentPage - 1}
                        />
                      )}
                    </CCol>
                  </CRow>
                </CNavbar>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Index;