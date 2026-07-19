"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import useApi from "hooks/useApi";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Modal } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import Loader from "components/Loader";
import defaultAvatar from "assets/img/jameen-logo.png";
import {
  PageShell,
  PageHeader,
  ContentCard,
  SearchInput,
  AdminButton,
  DataTable,
  EmptyState,
  EntityCell,
} from "components/ui";

const COLUMNS = [
  { key: "user", label: "User" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "action", label: "Action" },
];

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

  const { get, put, response, loading } = useApi();
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      loadInitialusers();
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, searchKeyword]);

  async function loadInitialusers() {
    let endpoint = `/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`;

    if (searchKeyword) {
      endpoint += `&q[email_or_name_eq]=${searchKeyword}`;
    }

    const initialusers = await get(endpoint);

    if (response.ok) {
      setusers(initialusers.data || []);
      setPagination(
        initialusers.pagination || initialusers.data?.pagination || null
      );
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
    <PageShell>
      <PageHeader
        eyebrow={
          <span>
            <Link href="/companies" className="theme_color">
              Companies
            </Link>
            {" / Users"}
          </span>
        }
        title="Users"
        subtitle="Manage company users, roles, and password resets."
        actions={
          <>
            <SearchInput
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              onSearch={loadInitialusers}
              placeholder="Search users..."
            />
            <AdminButton
              onClick={() => router.push(`/companies/${companyId}/users/add`)}
            >
              Add User
            </AdminButton>
          </>
        }
      />

      <ContentCard flush>
        <DataTable
          columns={COLUMNS}
          loading={loading && !users.length ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title="No users found"
              text="Add a user or try a different search."
            />
          }
        >
          {users.length > 0
            ? users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <EntityCell
                      round
                      image={user.avatar_url || user.avatar || defaultAvatar}
                      title={user.name}
                      subtitle={user.role?.name}
                    />
                  </td>
                  <td className="cell-muted">{user.email}</td>
                  <td className="cell-muted">{user.mobile_number || "-"}</td>
                  <td>{user.role?.name || "-"}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle as={CustomDivToggle}>
                        <BsThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          href={`/companies/${companyId}/users/${user.id}/edit`}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          href={`/companies/${companyId}/users/${user.id}`}
                        >
                          User Show
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => openResetModal(user.id)}>
                          Reset Password
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            : null}
        </DataTable>
      </ContentCard>

      {pagination?.total_pages > 1 ? (
        <Paginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={pagination.per_page}
          pageCount={pagination.total_pages}
          forcePage={currentPage - 1}
        />
      ) : null}

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
                    backgroundColor: "var(--admin-warning-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    color: "var(--admin-warning)",
                  }}
                >
                  <CIcon icon={freeSet.cilWarning} size="xl" />
                </div>
              </div>
              <h5 className="fw-bold">Confirm Password Reset</h5>
              <p className="text-muted mt-2 mb-0">
                Are you sure you want to reset this user&apos;s password?
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
                    backgroundColor: "var(--admin-success-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    color: "var(--admin-success)",
                  }}
                >
                  <CIcon icon={freeSet.cilCheckCircle} size="xl" />
                </div>
              </div>
              <h5 className="fw-bold" style={{ color: "var(--admin-success)" }}>
                Success
              </h5>
              <p className="text-muted mt-2">{apiMessage}</p>
              <small className="text-muted">
                A new password has been sent to the user&apos;s email.
              </small>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center">
          {!resetSuccess ? (
            <>
              <AdminButton
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes, Reset"}
              </AdminButton>
            </>
          ) : (
            <AdminButton onClick={() => setShowModal(false)}>Close</AdminButton>
          )}
        </Modal.Footer>
      </Modal>
    </PageShell>
  );
}

export default Index;
