import React, { useState } from "react";
import "./Performance.css";

const Performance = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const metrics = {
        uptime: "99.98%",
        responseTime: "120ms",
        activeUsers: 342,
        requests: "12,430",
    };

    const trends = {
        uptime: "up",
        responseTime: "down",
        activeUsers: "up",
        requests: "up",
    };

    const systemStatus = {
        database: "Online",
        api: "Degraded",
        auth: "Running",
    };

    function refreshMetrics() {
        setLoading(true);

        setTimeout(() => {
            setLastUpdated(new Date());
            setLoading(false);
        }, 800);
    }

    function toggleMaintenance() {
        const confirmAction = window.confirm(
            maintenanceMode
                ? "Disable maintenance mode?"
                : "Enable maintenance mode? This will affect users.",
        );

        if (confirmAction) {
            setMaintenanceMode((prev) => !prev);
        }
    }

    function getStatusColor(status) {
        if (status === "Online" || status === "Healthy" || status === "Running")
            return "green";
        if (status === "Degraded") return "orange";
        return "red";
    }

    return (
        <div className="PerformanceContainer">
            <div className="HeaderRow">
                <h2>System Performance</h2>
                <button className="refreshBtn" onClick={refreshMetrics}>
                    Refresh
                </button>
            </div>

            <p className="lastUpdated">
                Last updated: {lastUpdated.toLocaleTimeString()}
            </p>

            {loading && <p className="loadingText">Updating metrics...</p>}

            <div className="MetricsGrid">
                <div className="MetricCard">
                    <p>Uptime</p>
                    <div className="MetricCardDesc">
                        <h3>{metrics.uptime}</h3>
                        <span className={`trend ${trends.uptime}`}>
                            {trends.uptime === "up" ? "↑ 0.2%" : "↓ 0.2%"}
                        </span>
                    </div>
                </div>

                <div className="MetricCard">
                    <p>Response Time</p>
                    <div className="MetricCardDesc">
                        <h3>{metrics.responseTime}</h3>
                        <span className={`trend ${trends.responseTime}`}>
                            {trends.responseTime === "down" ? "↓ 12%" : "↑ 12%"}
                        </span>
                    </div>
                </div>

                <div className="MetricCard">
                    <p>Active Users</p>
                    <div className="MetricCardDesc">
                        <h3>{metrics.activeUsers}</h3>
                        <span className={`trend ${trends.activeUsers}`}>
                            {trends.activeUsers === "up" ? "↑ 8%" : "↓ 8%"}
                        </span>
                    </div>
                </div>

                <div className="MetricCard">
                    <p>Requests (24h)</p>
                    <div className="MetricCardDesc">
                        <h3>{metrics.requests}</h3>
                        <span className={`trend ${trends.requests}`}>
                            {trends.requests === "up" ? "↑ 5%" : "↓ 5%"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="StatusSection">
                <h3>System Status</h3>

                <div className="StatusRow">
                    <span>Database</span>
                    <span
                        className={`status ${getStatusColor(
                            systemStatus.database,
                        )}`}
                    >
                        {systemStatus.database}
                    </span>
                </div>

                <div className="StatusRow">
                    <span>API</span>
                    <span
                        className={`status ${getStatusColor(systemStatus.api)}`}
                    >
                        {systemStatus.api}
                    </span>
                </div>

                <div className="StatusRow">
                    <span>Auth</span>
                    <span
                        className={`status ${getStatusColor(
                            systemStatus.auth,
                        )}`}
                    >
                        {systemStatus.auth}
                    </span>
                </div>
            </div>

            <div className="ActionsSection">
                <h3>System Controls</h3>

                <button
                    className={maintenanceMode ? "danger" : "primary"}
                    onClick={toggleMaintenance}
                >
                    {maintenanceMode
                        ? "Disable Maintenance Mode"
                        : "Enable Maintenance Mode"}
                </button>

                <p className="MaintenanceState">
                    Status:{" "}
                    <strong>
                        {maintenanceMode ? "Maintenance ON" : "System Live"}
                    </strong>
                </p>
            </div>

            <div className="InfoSection">
                <h3>System Info</h3>
                <p>Version: 1.0.0</p>
                <p>Environment: Production</p>
                <p>Region: EU-West</p>
            </div>
        </div>
    );
};

export default Performance;
