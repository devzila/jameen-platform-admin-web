import Company from "views/Company.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";

const dashboardRoutes = [
  {
    path: "/company",
    name: "Comapnies",
    icon: "nc-icon nc-chart-pie-35",
    component: Company,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Users",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
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
