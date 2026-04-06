import './Services.css';
import { useState } from 'react';
const initialServices = [
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

const STATUS_OPTIONS = ['Good', 'Partial', 'No service'];




const Services = () => {
    const [services, setServices] = useState(initialServices);
    const [draftServices, setDraftServices] = useState(
        initialServices.map((service) => ({
            status: service.status,
            desc: service.desc,
            downdesc: service.downdesc,
        }))
    );
    const [openServiceIndex, setOpenServiceIndex] = useState(null);

    const getStatusClass = (status) => {
        const normalized = status.toLowerCase();

        if (normalized === 'good') return 'green';
        if (normalized === 'partial') return 'orange';
        return 'red';
    };

    const toggleService = (index) => {
        setOpenServiceIndex((current) => (current === index ? null : index));
    };

    const updateDraftField = (index, field, value) => {
        setDraftServices((currentDrafts) =>
            currentDrafts.map((draft, draftIndex) =>
                draftIndex === index ? { ...draft, [field]: value } : draft
            )
        );
    };


    return (
        <div className="Services">
            <div className={"ServicesContainer"}>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`ServicesCard ${openServiceIndex === index ? 'isOpen' : ''}`}
                        onClick={() => toggleService(index)}
                    >
                        <div className={"ServicesCardHeader"}>
                            <h2>{service.name}</h2>
                            <p className={`status ${getStatusClass(service.status)}`}>{service.status}</p>
                        </div>
                        <div className={"ServicesCardContent"}>
                            <div className={"ServicesCardContentSection"}>
                                <p>Status</p>
                                <select
                                    className={"ServicesSelect"}
                                    value={draftServices[index].status}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) => updateDraftField(index, 'status', event.target.value)}
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <p>Description</p>
                            <textarea
                                className={"ServicesTextbox"}
                                value={draftServices[index].desc}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => updateDraftField(index, 'desc', event.target.value)}
                            />
                            <p>Outage Details</p>
                            <textarea
                                className={"ServicesTextbox"}
                                rows={3}
                                value={draftServices[index].downdesc}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => updateDraftField(index, 'downdesc', event.target.value)}
                                placeholder={"Add outage details"}
                            />
                            <button
                                className={"UpdateButton"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};
export default Services;