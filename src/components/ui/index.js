"use client";

import React from "react";

export function PageShell({ children, className = "" }) {
  return <div className={`admin-page ${className}`.trim()}>{children}</div>;
}

export function PageHeader({
  eyebrow = "Platform Admin",
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__copy">
        {eyebrow ? (
          typeof eyebrow === "string" ? (
            <span className="admin-page-header__eyebrow">{eyebrow}</span>
          ) : (
            <div className="admin-page-header__eyebrow">{eyebrow}</div>
          )
        ) : null}
        <h1 className="admin-page-header__title">{title}</h1>
        {subtitle ? (
          <p className="admin-page-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="admin-page-header__actions">{actions}</div>
      ) : null}
    </div>
  );
}

export function ContentCard({ children, className = "", flush = false }) {
  return (
    <div className={`admin-card ${className}`.trim()}>
      <div
        className={`admin-card__body ${
          flush ? "admin-card__body--flush" : ""
        }`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

export function FilterBar({ children, actions }) {
  return (
    <div className="admin-filters">
      {children}
      {actions ? <div className="admin-filters__actions">{actions}</div> : null}
    </div>
  );
}

export function FilterField({ label, children }) {
  return (
    <div className="admin-field">
      {label ? <label>{label}</label> : null}
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
}) {
  return (
    <div className="admin-search">
      <input
        className="form-control"
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) onSearch();
        }}
      />
      {onSearch ? (
        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-search__btn"
          onClick={onSearch}
          aria-label="Search"
        >
          <i className="fas fa-search" />
        </button>
      ) : null}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  size,
  className = "",
  type = "button",
  ...props
}) {
  const sizeClass = size === "sm" ? "admin-btn--sm" : "";
  return (
    <button
      type={type}
      className={`admin-btn admin-btn--${variant} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ active, label, tone }) {
  const resolvedTone =
    tone ||
    (active === true ? "success" : active === false ? "muted" : "muted");
  const text =
    label ||
    (active === true ? "Active" : active === false ? "Inactive" : "Unknown");

  return (
    <span className={`admin-badge admin-badge--${resolvedTone}`}>{text}</span>
  );
}

export function EmptyState({
  title = "No results",
  text = "Try adjusting your filters or search.",
  colSpan,
}) {
  const content = (
    <div className="admin-empty">
      <p className="admin-empty__title">{title}</p>
      <p className="admin-empty__text">{text}</p>
    </div>
  );

  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan}>{content}</td>
      </tr>
    );
  }

  return content;
}

export function DataTable({ columns = [], children, loading, empty, colSpan }) {
  const span = colSpan || columns.length || 1;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table table">
        {columns.length > 0 ? (
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col}>{col.label || col}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={span}>
                <div className="admin-loading">{loading}</div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>{children || empty}</tbody>
        )}
      </table>
    </div>
  );
}

export function FormShell({
  title,
  subtitle,
  onBack,
  children,
  maxWidth = true,
}) {
  return (
    <PageShell>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          onBack ? (
            <AdminButton variant="secondary" onClick={onBack}>
              Go Back
            </AdminButton>
          ) : null
        }
      />
      <ContentCard className={maxWidth ? "admin-form-shell" : ""}>
        <div className="admin-form">{children}</div>
      </ContentCard>
    </PageShell>
  );
}

export function DetailList({ items = [] }) {
  return (
    <div className="admin-detail-list">
      {items.map((item) => (
        <div className="admin-detail-row" key={item.label}>
          <div className="admin-detail-row__label">{item.label}</div>
          <div className="admin-detail-row__value">{item.value ?? "-"}</div>
        </div>
      ))}
    </div>
  );
}

export function EntityCell({ image, title, subtitle, round = false }) {
  const src = image && typeof image === "object" ? image.src : image;
  return (
    <div className="admin-entity">
      {src ? (
        <img
          src={src}
          alt=""
          className={`admin-thumb ${round ? "admin-thumb--round" : ""}`.trim()}
        />
      ) : null}
      <div className="admin-entity__meta">
        <div className="cell-title">{title}</div>
        {subtitle ? <span className="cell-sub">{subtitle}</span> : null}
      </div>
    </div>
  );
}
