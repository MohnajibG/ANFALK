const reviews = [
  {
    name: "Sarah M.",
    text: "Exceptional service and a beautifully calm experience.",
  },
  {
    name: "Lina K.",
    text: "The most polished beauty studio I have tried.",
  },
  {
    name: "Nadia R.",
    text: "Perfect results every time I visit.",
  },
];

export default function Testimonials() {
  return (
    <section className="ak-section ak-section-soft">
      <div className="ak-container text-center">
        <p className="ak-kicker">Reviews</p>
        <h2 className="ak-heading mt-4">Loved by our clients</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="ak-card p-8">
              <p className="ak-muted">"{r.text}"</p>
              <h4 className="mt-6 font-bold text-[#0b0b0b]">{r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
