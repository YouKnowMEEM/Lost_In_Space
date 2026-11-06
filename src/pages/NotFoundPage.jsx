import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Page from "../site/SiteChrome";
import { CATALOG } from "../data/catalog";

/** A friendly dead end that fits the theme: the visitor is "lost in space" and gets three ways back. */
export default function NotFoundPage({ what = "page" }) {
  const pick = CATALOG[Math.floor(Math.random() * CATALOG.length)];
  return (
    <Page title="Lost in space · Sleeping Beauties" description="This page drifted off course. Here are three ways back to the machines.">
      <section className="nf">
        <img className="nf-astro" src="/images/happyAstronaut.png" alt="" width="212" height="295" />
        <div>
          <p className="nf-code">404</p>
          <h1>Lost in space</h1>
          <p className="nf-text">
            We could not find that {what}. Like the machines in this project, it may have drifted away. Here are three ways to get back on course.
          </p>
          <div className="nf-actions">
            <Link className="hp-btn hp-btn-primary" to="/">
              Back to the start
            </Link>
            <Link className="hp-btn hp-btn-quiet" to="/atlas">
              Browse the Atlas
            </Link>
            <Link className="hp-btn hp-btn-quiet" to={pick.route}>
              <Compass size={18} aria-hidden="true" /> Surprise me: {pick.short}
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
