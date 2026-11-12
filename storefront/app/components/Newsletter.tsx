"use client";

import { useState } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section className="section section--tight">
      <div className="page-width">
        <div className="newsletter">
          <div>
            <p className="section__eyebrow">TechNest Insider</p>
            <h2>Πρώτος στα drops, πρώτος στο game.</h2>
            <p>Early access σε limited drops, εκπτώσεις και reviews. Χωρίς spam.</p>
          </div>
          <div>
            <form
              className="newsletter__form"
              onSubmit={(event) => {
                event.preventDefault();
                setDone(true);
              }}
            >
              <label className="visually-hidden" htmlFor="newsletter-email">
                Email
              </label>
              <input id="newsletter-email" type="email" required placeholder="to email σου" />
              <button className="btn" type="submit">
                Εγγραφή
              </button>
            </form>
            {done ? <p className="form-message">Ευχαριστούμε! Θα λαμβάνεις πρώτος τα drops.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
