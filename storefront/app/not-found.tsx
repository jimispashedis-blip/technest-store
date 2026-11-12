import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-width section center">
      <p className="section__eyebrow">404</p>
      <h1>Χάθηκες στο respawn;</h1>
      <p className="muted" style={{ maxWidth: "50ch", marginInline: "auto" }}>
        Η σελίδα που ψάχνεις δεν υπάρχει ή μετακινήθηκε.
      </p>
      <Link className="btn" href="/products">
        Επιστροφή στο κατάστημα
      </Link>
    </div>
  );
}
