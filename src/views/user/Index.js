import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import { CNavbar, CContainer, CNavbarBrand, CCol, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

// react-bootstrap components
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Loader from "components/Loader";
function Index() {
  const { companyId } = useParams();
  const [users, setusers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { get, post, response, loading, error } = useFetch();
  const [searchKeyword, setSearchKeyword] = useState(null);

  useEffect(() => {
    loadInitialusers();
  }, [currentPage]);
  const navigate = useNavigate();
  const addUser = () => {
    navigate(`/companies/${companyId}/users/add`);
  };

  async function loadInitialusers() {
    let endpoint = `/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`;
    if (searchKeyword) {
      endpoint += `&q[username_cont]=${searchKeyword}`;
    }
    let initialusers = await get(endpoint);
    console.log(response);
    if (response.ok) {
      setusers(initialusers.data);
      setPagination(initialusers.data.pagination);
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1);
  }

  return (
    <div>
      <section>
        <div>
          <div className="mask d-flex align-items-center h-100 mt-3 ">
            <div className="w-100">
              <div className="row justify-content-center">
                <div className="col-12">
                  <CNavbar expand="lg" colorScheme="light" className="bg-white">
                    <CContainer fluid>
                      <CNavbarBrand href="#">User</CNavbarBrand>
                      <div className="d-flex justify-content-end">
                        <div
                          className="d-flex align-items-center"
                          role="search"
                        >
                          <input
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onReset={loadInitialusers}
                            className="form-control  custom_input"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                          <button
                            onClick={loadInitialusers}
                            className="btn btn-outline-success custom_search_button"
                            type="submit"
                          >
                            <CIcon icon={freeSet.cilSearch} />
                          </button>
                        </div>

                        <button
                          className="custom_theme_button btn m-0 mx-3"
                          onClick={addUser}
                        >
                          Add User
                        </button>
                      </div>
                    </CContainer>
                  </CNavbar>
                  <hr className="p-0 m-0 border-0 text-secondary" />

                  <div className="table-responsive bg-white">
                    <table className="table table-striped mb-1">
                      <thead>
                        <tr>
                          <th className="pt-3 pb-3 border-0">Name</th>
                          <th className="pt-3 pb-3 border-0">Email</th>
                          <th className="pt-3 pb-3 border-0">Phone Number</th>
                          <th className="pt-3 pb-3 border-0">Role</th>
                          <th className="pt-3 pb-3 border-0">Action </th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <th>{user.name}</th>
                            <td className="pt-3">{user.email}</td>
                            <td className="pt-3">{user.mobile_number}</td>
                            <td className="pt-3">{user.role.name}</td>

                            <td>
                              <Dropdown key={user.id}>
                                <Dropdown.Toggle
                                  as={CustomDivToggle}
                                  style={{ cursor: "pointer" }}
                                >
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    <NavLink
                                      key={`edit-${user.id}`}
                                      to={`/companies/${companyId}/users/${user.id}/edit`}
                                    >
                                      Edit
                                    </NavLink>
                                  </Dropdown.Item>

                                  <Dropdown.Item>
                                    <NavLink
                                      key={`user-show-${user.id}`}
                                      to={`/companies/${companyId}/users/${user.id}`}
                                    >
                                      User Show
                                    </NavLink>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loading ? <Loader /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <CNavbar
          colorScheme="light"
          className="bg-light d-flex justify-content-center"
        >
          <CRow>
            <CCol md="12">
              {pagination?.total_pages > 1 ? (
                <Paginate
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={pagination.per_page}
                  pageCount={pagination.total_pages}
                  forcePage={currentPage - 1}
                />
              ) : (
                <br />
              )}
            </CCol>
          </CRow>
        </CNavbar>
      </section>
    </div>
  );
}

export default Index;
