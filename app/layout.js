import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import Providers from "components/Providers";

import "bootstrap/dist/css/bootstrap.min.css";
import "assets/css/animate.min.css";
import "assets/scss/light-bootstrap-dashboard-react.scss";
import "assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Jameen: Platform Admin Console",
  description: "Platform administration console for Jameen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${montserrat.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
