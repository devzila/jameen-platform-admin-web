import CompanyIndex from "views/company/Index.js";
import CompanyShow from "views/company/Show.js";
import CompanyEdit from "views/company/Edit.js";
import CompanyAdd from "views/company/Add.js";
import UserIndex from "views/user/Index.js";
import UserEdit from "views/user/Edit.js";
import UserAdd from "views/user/Add.js";
import UserShow from "views/user/Show.js";
import TableList from "views/TableList.js";
import SubscriptionIndex from "views/subscription/Index.js";
import SubscriptionShow from "views/subscription/Show.js";
import  SubscriptionEdit  from "views/subscription/Edit.js";
import SubscriptionAdd from "views/subscription/Add.js";

const dashboardRoutes = [
  {
    path: "/companies",
    name: "Comapnies",
    icon: "nc-icon nc-chart-pie-35",
    component: CompanyIndex
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList
  },
  {
    path: "/subscriptions",
    name: "Subscription",
    icon: "nc-icon nc-notes",
    component: SubscriptionIndex
  },
  { path: "/companies/add", component: CompanyAdd, redirect: true },
  { path: "/companies/:id", component: CompanyShow, redirect: true },
  { path: "/companies/:id/edit", component: CompanyEdit, redirect: true },
  { path: "/companies/:companyId/users", component: UserIndex, redirect: true },
  { path: "/companies/:companyId/users/add", component: UserAdd, redirect: true },
  { path: "/companies/:companyId/users/:userId", component: UserShow, redirect: true },
  { path: "/companies/:companyId/users/:userId/edit", component: UserEdit, redirect: true },
  { path: "/subscriptions/add", component: SubscriptionAdd, redirect: true},
  { path: "/subscriptions/:id", component: SubscriptionShow, redirect: true },
  { path: "/subscriptions/:id/edit", component: SubscriptionEdit, redirect: true },

];

export default dashboardRoutes;
