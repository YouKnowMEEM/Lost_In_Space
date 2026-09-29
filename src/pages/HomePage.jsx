import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const BG = "/images/home-background.jpg";

// Start loading the /space route (its code is split out of this page) as soon as someone shows interest.
const warm = () => import("./SpacePage").catch(() => {});

export default function HomePage() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false); // background image decoded, fade it in
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = img.onerror = () => setReady(true); // if the image fails, the dark backdrop and copy still work
        img.src = BG;
        if (img.complete) setReady(true);
        return () => {
            img.onload = img.onerror = null;
        };
    }, []);

    const explore = () => {
        if (leaving) return;
        setLeaving(true);
        Promise.all([warm(), new Promise((resolve) => setTimeout(resolve, 700))]).then(() => navigate("/space"));
    };

    return (
        <main className={`lp${ready ? " is-ready" : ""}${leaving ? " is-leaving" : ""}`}>
            <div className="lp-bg" aria-hidden="true" />
            <div className="lp-shade" aria-hidden="true" />
            <div className="lp-copy">
                <p className="lp-tag">Abandoned but not forgotten</p>
                <h1>Explore the Sleeping Beauties</h1>
                <button type="button" className="lp-cta" onClick={explore} onPointerEnter={warm} onFocus={warm}>
                    Explore
                </button>
            </div>
        </main>
    );
}
