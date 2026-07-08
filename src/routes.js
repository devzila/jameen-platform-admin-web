import CompanyIndex from "views/company/Index.js";
import CompanyShow from "views/company/Show.js";
import CompanyEdit from "views/company/Edit.js";
import CompanyAdd from "views/company/Add.js";
import UserIndex from "views/user/Index.js";
import UserEdit from "views/user/Edit.js";
import UserAdd from "views/user/Add.js";
import UserShow from "views/user/Show.js";
import SubscriptionIndex from "views/subscription/Index.js";
import SubscriptionShow from "views/subscription/Show.js";
import SubscriptionEdit from "views/subscription/Edit.js";
import SubscriptionAdd from "views/subscription/Add.js";
import { Navigate } from "react-router-dom";
import InvoiceTemplates from "/Users/devzila/Workspace/jameen/jameen-platform-admin-web/src/views/InvoiceTemplates/Index.js";
import InvoiceTemplateIndex from "/Users/devzila/Workspace/jameen/jameen-platform-admin-web/src/views/InvoiceTemplates/Index.js";
import InvoiceTemplateAdd from "/Users/devzila/Workspace/jameen/jameen-platform-admin-web/src/views/InvoiceTemplates/Add.js";
import InvoiceTemplateEdit from "/Users/devzila/Workspace/jameen/jameen-platform-admin-web/src/views/InvoiceTemplates/Edit.js";
import InvoiceTemplateShow from "/Users/devzila/Workspace/jameen/jameen-platform-admin-web/src/views/InvoiceTemplates/Show.js";
const dashboardRoutes = [
  {
    path: "/companies",
    name: "Comapnies",
    icon: "nc-icon nc-chart-pie-35",
    component: <CompanyIndex />,
    main: true,
  },
  {
    path: "/invoice-templates",
    name: "Invoice Templates",
    icon: "nc-icon nc-single-copy-04",
    component: <InvoiceTemplates />,
    main: true,
  },

  {
    path: "/subscriptions",
    name: "Subscription",
    icon: "nc-icon nc-notes",
    component: <SubscriptionIndex />,
    main: true,
  },
  { path: "/", component: <Navigate to="/companies" /> },
  { path: "/companies/add", component: <CompanyAdd /> },
  { path: "/companies/:id", component: <CompanyShow /> },
  { path: "/companies/:id/edit", component: <CompanyEdit /> },
  { path: "/companies/:companyId/users", component: <UserIndex /> },
  {
    path: "/companies/:companyId/users/add",
    component: <UserAdd />,
  },
  {
    path: "/companies/:companyId/users/:userId",
    component: <UserShow />,
  },
  {
    path: "/companies/:companyId/users/:userId/edit",
    component: <UserEdit />,
  },
  {
    path: "/invoice-templates/add",
    component: <InvoiceTemplateAdd />,
  },

  {
    path: "/invoice-templates/:id",
    component: <InvoiceTemplateShow />,
  },

  {
    path: "/invoice-templates/:id/edit",
    component: <InvoiceTemplateEdit />,
  },
  { path: "/subscriptions/add", component: <SubscriptionAdd /> },
  { path: "/subscriptions/:id", component: <SubscriptionShow /> },
  {
    path: "/subscriptions/:id/edit",
    component: <SubscriptionEdit />,
  },
];

export default dashboardRoutes;
