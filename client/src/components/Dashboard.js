import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css";
import Workspace from "./Workspace";

export default function Dashboard() {
  return (
    <div className="Dashboard">
      <Navbar />
      <div className="inner">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
}
