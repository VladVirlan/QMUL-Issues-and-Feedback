import { useMemo, useState } from "react";
import "./StudentDashboard.css";
import ECPage from "../ec_page/ECPage";
import ServiceCheckPage from "../service_check/ServiceCheckPage";

const StudentDashboard = ({ onLogout }) => {
    const tabs = useMemo(
        () => [
            {
                id: "ec-claims",
                label: "EC Claims",
                subtitle: "Submit and track your claims",
                component: ECPage,
            },
            {
                id: "service-availability",
                label: "Service Availability",
                subtitle: "View current IT service status",
                component: () => <ServiceCheckPage hideBackButton />,
            }
        ],
        [],
    );

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const activeTabItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];
    const ActiveComponent = activeTabItem.component;

    return (
        <div className="StudentDashboardContainer">
            <div className="StudentDashboardHeader">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Manage your claims, services, and issue tickets in one place.</p>
                </div>
                <button id="LogOutButton" onClick={onLogout}>
                    LOG OUT
                </button>
            </div>

            <div className="StudentTabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? "student-tab active" : "student-tab"}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.label}</span>
                        <small>{tab.subtitle}</small>
                    </button>
                ))}
            </div>

            <div className="StudentTabContent">
                <ActiveComponent />
            </div>
        </div>
    );
};

export default StudentDashboard;
