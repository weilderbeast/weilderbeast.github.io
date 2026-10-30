import { initRouter } from "./components/page";
import { loadTheme } from "./components/theme";
import "./pages";
import { qsRequired } from "./utils/utils";

loadTheme();
initRouter(qsRequired(".app"));
