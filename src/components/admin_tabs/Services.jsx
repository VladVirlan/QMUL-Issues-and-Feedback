import './Services.css';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';

const initialServices = [];

const STATUS_OPTIONS = ['Good', 'Partial', 'No service'];

const Services = () => {
    const [services, setServices] = useState(initialServices);
    const [draftServices, setDraftServices] = useState(
        initialServices.map((service) => ({
            status: service.status,
            description: service.description,
            downdescription: service.downdescription,
        }))
    );
    const [openServiceIndex, setOpenServiceIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [savingIndex, setSavingIndex] = useState(null);
    const [updateMessage, setUpdateMessage] = useState({ index: null, type: '', text: '' });
    const updateMessageTimerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchServices = async () => {
            setIsLoading(true);
            setErrorMessage('');

            const { data, error } = await supabase
                .from("services")
                .select("*")
                .order("name", {ascending: true})

            if (!isMounted) {
                return;
            }

            if (error) {
                setErrorMessage(error.message || 'Failed to load services');
                setServices([]);
                setDraftServices([]);
                setIsLoading(false);
                return;
            }

            const normalizedServices = (data || []).map((service, index) => ({
                id: service.id ?? `service-${index}`,
                name: service.name || 'Unnamed service',
                status: STATUS_OPTIONS.includes(service.status) ? service.status : 'Good',
                description: service.description || '',
                downdescription: service.downdescription || '',
            }));

            setServices(normalizedServices);
            setDraftServices(
                normalizedServices.map((service) => ({
                    status: service.status,
                    description: service.description,
                    downdescription: service.downdescription,
                }))
            );
            setIsLoading(false);
        };

        fetchServices();

        return () => {
            isMounted = false;
        };
    }, []);

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

    const clearUpdateMessage = () => {
        if (updateMessageTimerRef.current) {
            clearTimeout(updateMessageTimerRef.current);
            updateMessageTimerRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            clearUpdateMessage();
        };
    }, []);

    const applyServiceUpdate = async (index) => {
        const service = services[index];
        const draft = draftServices[index];

        if (!service || !draft) {
            return;
        }

        clearUpdateMessage();
        setSavingIndex(index);

        const payload = {
            status: draft.status,
            description: draft.description,
            downdescription: draft.downdescription,
        };

        const { error } = await supabase
            .from('services')
            .update(payload)
            .eq('id', service.id);

        if (error) {
            setUpdateMessage({
                index,
                type: 'error',
                text: error.message || 'Unable to update service',
            });
            setSavingIndex(null);
            return;
        }

        setServices((currentServices) =>
            currentServices.map((currentService, serviceIndex) =>
                serviceIndex === index ? { ...currentService, ...payload } : currentService
            )
        );

        setUpdateMessage({
            index,
            type: 'success',
            text: 'Saved to database',
        });

        setSavingIndex(null);
        updateMessageTimerRef.current = setTimeout(() => {
            setUpdateMessage((current) => (current.index === index ? { index: null, type: '', text: '' } : current));
        }, 1800);
    };


    return (
        <div className="Services">
            <h1>Service Status</h1>
            <div className={"ServicesContainer"}>
                {isLoading && <p>Loading services...</p>}
                {!isLoading && errorMessage && <p>Could not load services: {errorMessage}</p>}
                {!isLoading && !errorMessage && services.length === 0 && <p>No services found.</p>}
                {services.map((service, index) => (
                    // Keep a safe fallback while data is loading/reloading.
                    (() => {
                        const draft = draftServices[index] || { status: service.status, description: service.description, downdescription: service.downdescription };
                        return (
                    <div
                        key={service.id || index}
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
                                    value={draft.status}
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
                                value={draft.description}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => updateDraftField(index, 'description', event.target.value)}
                            />
                            <p>Outage Details</p>
                            <textarea
                                className={"ServicesTextbox"}
                                rows={3}
                                value={draft.downdescription}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => updateDraftField(index, 'downdescription', event.target.value)}
                                placeholder={"Add outage details"}
                            />
                            <button
                                className={`UpdateButton ${updateMessage.index === index && updateMessage.type === 'success' ? 'isUpdated' : ''}`}
                                disabled={savingIndex === index}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    applyServiceUpdate(index);
                                }}
                            >
                                {savingIndex === index ? 'Saving...' : 'Update'}
                            </button>
                            {updateMessage.index === index && updateMessage.text && (
                                <p className={`UpdateFeedback ${updateMessage.type}`}>
                                    {updateMessage.text}
                                </p>
                            )}
                        </div>
                    </div>
                        );
                    })()
                ))}
            </div>
        </div>
    )
};
export default Services;