import { useEffect, useState } from "react"
import "./Dashboard.css";

interface Model {
    slug: string,
    name: string,
    providers: {
        provider: string,
        providerWebsite: string,
        inputTokenCost: number,
        outputTokenCost: number
    }[]
}

export const Models = () => {
    const [models, setModels] = useState<Model[] | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    async function getModels() {
        try {
            console.log('hii');
            const response = await fetch(
                "http://localhost:3000/models/models-and-providers", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(response.status !== 200) {
                console.log('The response is not available!')
                throw new Error();
            }
            const data = await response.json();
            console.log(data);
            setModels(data);
        } catch (error) {
            throw new Error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getModels();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <span className="dashboard-brand dashboard-title">Models</span>
            </div>

            <div className="dashboard-container">
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <p className="dashboard-section-title">Available Models</p>

                        {loading && (
                            <p className="dashboard-muted">Loading models...</p>
                        )}

                        <div className="dashboard-list">
                            {models && models.map((model) => (
                                <div className="dashboard-list-item" key={model.slug}>
                                    <p className="dashboard-row-title">{model.name}</p>
                                    <div className="dashboard-spacer" />
                                    <p className="dashboard-label">Model Name:
                                        <span className="dashboard-muted"> {model.name}</span>
                                    </p>
                                    <p className="dashboard-label">Model Slug:
                                        <span className="dashboard-muted"> {model.slug}</span>
                                    </p>

                                    <div className="dashboard-spacer" />

                                    {/* Nested Providers */}
                                    {model.providers.map((p) => (
                                        <div
                                            className="dashboard-list-item"
                                            key={p.provider}
                                            style={{ marginTop: '8px' }}
                                        >
                                            <p className="dashboard-subtitle">Providers:</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <p className="dashboard-label">Provider Name:
                                                        <span className="dashboard-muted"> {p.provider}</span>
                                                    </p>
                                                    <p className="dashboard-label">Provider Website:
                                                        <a
                                                            href={p.providerWebsite}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="dashboard-muted"
                                                        >
                                                            {" "}{p.providerWebsite}
                                                        </a>
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p className="dashboard-label">Input Token Cost:
                                                        <span className="dashboard-muted"> ${p.inputTokenCost}</span>
                                                    </p>
                                                    <p className="dashboard-label">Output Token Cost:
                                                        <span className="dashboard-muted"> ${p.outputTokenCost}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}