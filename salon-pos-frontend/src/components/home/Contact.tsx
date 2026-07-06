import { Camera, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const details = [
    { icon: <MapPin size={20} />, text: "Aulnay-sous-Bois, France" },
    { icon: <Phone size={20} />, text: "+33 6 00 00 00 00" },
    { icon: <Camera size={20} />, text: "@anfalk_institute" },
  ];

  return (
    <section id="contact" className="ak-section bg-white">
      <div className="ak-container">
        <div className="ak-card mx-auto max-w-4xl px-5 py-12 text-center sm:px-10">
          <p className="ak-kicker">Contact</p>
          <h2 className="ak-heading mt-4">Visit the institute</h2>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {details.map((item) => (
              <div
                key={item.text}
                className="rounded-2xl border border-[#e8e2d8] bg-[#f7f4ee] px-5 py-4 text-sm font-semibold text-[#171717]"
              >
                <span className="flex items-center justify-center gap-3 sm:justify-start">
                  {item.icon}
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <button className="ak-button mt-10 px-8 py-4">Contact Us</button>
        </div>
      </div>
    </section>
  );
}
