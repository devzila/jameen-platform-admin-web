import CompanyIndex from "views/company/Index.js";
import CompanyEdit from "views/company/Edit.js";
import UserEdit from "views/user/Edit.js";
import TableList from "views/TableList.js";

const dashboardRoutes = [
  {
    path: "/company",
    name: "Comapnies",
    icon: "nc-icon nc-chart-pie-35",
    component: CompanyIndex,
    layout: "/admin"
  },
  {
    path: "/company/edit",
    name: "ComapnyEdit",
    icon: "nc-icon nc-chart-pie-35",
    component: CompanyEdit,
    layout: "/admin",
    redirect: true
  },
  {
    path: "/user",
    name: "Users",
    icon: "nc-icon nc-circle-09",
    component: UserEdit,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
