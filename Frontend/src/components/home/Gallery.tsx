export default function Gallery() {
  const images = Array.from({ length: 6 }).map(
    (_, i) =>
      `https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=${i}`,
  );

  return (
    <section id="gallery" className="ak-section">
      <div className="ak-container text-center">
        <p className="ak-kicker">Gallery</p>
        <h2 className="ak-heading mt-4">A glimpse inside the studio</h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <div key={i} className="ak-card overflow-hidden p-2">
              <img
                src={img}
                alt="ANFAL K studio preview"
                className="h-72 w-full rounded-[20px] object-cover transition hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
