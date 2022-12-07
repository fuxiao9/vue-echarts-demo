const SellerPage = () => import("@/views/SellerPage");
const TrendPage = () => import("@/views/TrendPage")

const routes = [
  {
    path: "/seller",
    component: SellerPage,
  },
  {
    path: "/trend",
    component: TrendPage,
  },
];

export default routes;
