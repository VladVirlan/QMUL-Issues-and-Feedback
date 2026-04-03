import '/src/index.css'
import './ServiceCheckPage.css'
import dangerSign from '/src/assets/service_check/danger-sign.svg';
import warningSign from '/src/assets/service_check/warning-sign.svg';
import { useState } from 'react';

const services = [
  {
    name: "Campus or Building",
    desc: "Maintenance, outages",
    status: "Good",
    downdesc: "",
  },
  {
    name: "eLearning",
    desc: "QPlus, QReview",
    status: "Good",
    downdesc: "",
  },
  {
    name: "Email",
    desc: "Office 365, IMAP",
    status: "Good",
    downdesc: "",
  },
  {
    name: "Printing",
    desc: "Central Print Service, Student printing",
    status: "Partial",
    downdesc: "Printing service is experiencing delays. Some printers may be offline. Expected to be resolved by 17:00.",
  },
  {
    name: "Wi-Fi",
    desc: "eduroam",
    status: "No service",
    downdesc: "Wifi cut off for 2 hours due to power failure in data centre. Expected to be resolved by 16:30.",
  },
];

const getStatusClass = (status) => {
  const normalized = status.toLowerCase();

  if (normalized === 'good') return 'green';
  if (normalized === 'partial') return 'orange';
  return 'red';
};

function ServiceCheckPage() {
    const [openServiceIndex, setOpenServiceIndex] = useState(null);

    const toggleService = (index) => {
        setOpenServiceIndex((current) => (current === index ? null : index));
    };

    return (
        <div className="ServiceCheckPage">
            <div className={"HeaderRow"}>
                <div>
                    <h1>QMUL IT Service Status</h1>
                    <p>Last updated: 2024-06-01 14:30</p>
                </div>
                <button className={"backBtn"}>Back</button>
            </div>
            <div className={"ServiceIntroContainer"}>
                <div className={"ServiceCountContainer"}>
                    <img src={dangerSign} alt="Danger Sign" />
                    <div className={`ServiceCountCard red`}>
                        <p>1 No Service</p>
                    </div>
                </div>
                <div className={"ServiceCountContainer"}>
                    <img src={warningSign} alt="Warning Sign" />
                    <div className={'ServiceCountCard orange'}>
                        <p>1 Partial Service</p>
                    </div>
                </div>
            </div>

            <div className={"ServiceListContainer"}>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`ServiceCard ${openServiceIndex === index ? 'isOpen' : ''}`}
                        onClick={() => service.downdesc && toggleService(index)}
                    >
                        <div className={"ServiceContent"}>
                            <div>
                                <h3>{service.name}</h3>
                                <p className={"ServiceDescription"}>{service.desc}</p>
                            </div>
                            <div>
                                <p className={`status ${getStatusClass(service.status)}`}>
                                    {service.status}
                                </p>
                            </div>
                        </div>
                        {service.downdesc && (
                            <div className={"HiddenServiceContent"}>
                                <p>{service.downdesc}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}



export default ServiceCheckPage;