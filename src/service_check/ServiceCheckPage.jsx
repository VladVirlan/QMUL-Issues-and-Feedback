import './ServiceCheckPage.css';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    name: "Campus or Building",
    desc: "Maintenance, outages",
    status: "Good",
  },
  {
    name: "eLearning",
    desc: "QPlus, QReview",
    status: "Good",
  },
  {
    name: "Email",
    desc: "Office 365, IMAP",
    status: "Good",
  },
  {
    name: "Printing",
    desc: "Printing delays affecting student queues",
    status: "Partial",
  },
  {
    name: "Wi-Fi",
    desc: "Outage in multiple buildings",
    status: "No service",
  },
];

const getStatusClass = (status) => {
  const normalized = status.toLowerCase();
  if (normalized === 'good') return 'green';
  if (normalized === 'partial') return 'orange';
  return 'red';
};

function ServiceCheckPage() {
    const navigate = useNavigate();

    return (
        <div className="ServiceCheckPage">
            <div className={"HeaderRow"}>
                <div>
                    <h1>QMUL IT Service Status</h1>
                    <p>Last updated: 2024-06-01 14:30</p>
                </div>
                <button className={"backBtn"} onClick={() => navigate('/dashboard')}>Back</button>
            </div>
            <div className={"ServiceIntroContainer"}>
                <div className={`NoServiceCountCard`}>
                    <span>🚨</span>
                    <p>No Service: </p>
                    <p>1</p>
                </div>
                <div className={'PartialServiceCountCard'}>
                    <span>⚠️</span>
                    <p>Partial Service: </p>
                    <p>1</p>
                </div>
            </div>
            <div className={"ServiceListContainer"}>
                {services.map((service, index) => (
                    <div key={index} className="ServiceCard">
                        <div>
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                        </div>
                        <span className={`status ${getStatusClass(service.status)}`}>
                            {service.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceCheckPage;