import '/src/index.css'
import './ServiceCheckPage.css'
import dangerSign from '/src/assets/service_check/danger-sign.svg';
import warningSign from '/src/assets/service_check/warning-sign.svg';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/supabaseClient.js';

const normalizeService = (service, index) => ({
  id: service.id ?? `service-${index}`,
  name: service.name || 'Unnamed service',
  status: ['Good', 'Partial', 'No service'].includes(service.status) ? service.status : 'Good',
  description: service.description || '',
  downdescription: service.downdescription || '',
});

const getStatusClass = (status) => {
  const normalized = status.toLowerCase();
  if (normalized === 'good') return 'green';
  if (normalized === 'partial') return 'orange';
  return 'red';
};

const ServiceCheckPage = () => {
    const [services, setServices] = useState([]);
    const [openServiceIndex, setOpenServiceIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchServices = async () => {
            setIsLoading(true);
            setErrorMessage('');

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('name', { ascending: true });

            if (!isMounted) {
                return;
            }

            if (error) {
                setErrorMessage(error.message || 'Failed to load services');
                setServices([]);
                setIsLoading(false);
                return;
            }

            setServices((data || []).map(normalizeService));
            setIsLoading(false);
        };

        fetchServices();

        return () => {
            isMounted = false;
        };
    }, []);

    const summaryCounts = useMemo(() => {
        return services.reduce(
            (accumulator, service) => {
                const normalized = service.status.toLowerCase();

                if (normalized === 'no service') accumulator.noService += 1;
                if (normalized === 'partial') accumulator.partial += 1;

                return accumulator;
            },
            { noService: 0, partial: 0 }
        );
    }, [services]);

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
            </div>
            <div className={"ServiceIntroContainer"}>
                <div className={"ServiceCountContainer"}>
                    <img src={dangerSign} alt="Danger Sign" />
                    <div className={`ServiceCountCard red`}>
                        <p>{summaryCounts.noService} No Service</p>
                    </div>
                </div>
                <div className={"ServiceCountContainer"}>
                    <img src={warningSign} alt="Warning Sign" />
                    <div className={'ServiceCountCard orange'}>
                        <p>{summaryCounts.partial} Partial Service</p>
                    </div>
                </div>
            </div>

            <div className={"ServiceListContainer"}>
                {isLoading && <p>Loading services...</p>}
                {!isLoading && errorMessage && <p>Could not load services: {errorMessage}</p>}
                {!isLoading && !errorMessage && services.length === 0 && <p>No services found.</p>}
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className={`ServiceCard ${openServiceIndex === index ? 'isOpen' : ''}`}
                        onClick={() => toggleService(index)}
                    >
                        <div className={"ServiceContent"}>
                            <div>
                                <h3>{service.name}</h3>
                                <p className={"ServiceDescription"}>{service.description}</p>
                            </div>
                            <div>
                                <p className={`status ${getStatusClass(service.status)}`}>
                                    {service.status}
                                </p>
                            </div>
                        </div>
                        <div className={"HiddenServiceContent"}>
                            <p>{service.downdescription || 'No outage details provided.'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceCheckPage;