import { Layout } from "@/components/layout/Layout";
import { CheckCircle, Target, Eye, Users } from "lucide-react";
import aboutImage from "@/assets/about-construction.jpg";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container-custom text-center">
          <p className="text-accent font-semibold uppercase tracking-widest mb-2">About Us</p>
          <h1 className="heading-xl text-primary-foreground mb-4">Building Kenya's Future</h1>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
            Over two decades of excellence in precast concrete manufacturing
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src={aboutImage} alt="BWL Construction" className="rounded-lg shadow-xl" />
            </div>
            <div>
              <h2 className="heading-md text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 text-lg">
                Founded in 2004, BWL Precast Construction has grown from a small local manufacturer to one of Kenya's leading precast concrete suppliers.
              </p>
              <p className="text-muted-foreground mb-6">
                Our state-of-the-art facility in Nairobi's Industrial Area produces high-quality precast concrete products that meet international standards. We serve contractors, developers, and infrastructure projects across East Africa.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "500+", label: "Projects Completed" },
                  { value: "20+", label: "Years Experience" },
                  { value: "50+", label: "Team Members" },
                  { value: "98%", label: "Client Satisfaction" },
                ].map((stat, i) => (
                  <div key={i} className="bg-muted p-4 rounded-lg text-center">
                    <p className="font-display text-3xl text-accent">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <Target className="w-12 h-12 text-accent mb-4" />
              <h3 className="heading-sm text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To deliver superior precast concrete solutions that exceed client expectations through innovation, quality craftsmanship, and reliable service.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <Eye className="w-12 h-12 text-accent mb-4" />
              <h3 className="heading-sm text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To be East Africa's most trusted precast concrete manufacturer, known for durability, innovation, and sustainable building practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-foreground">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Quality", desc: "Uncompromising standards in every product" },
              { title: "Integrity", desc: "Honest and transparent business practices" },
              { title: "Innovation", desc: "Continuous improvement and modern techniques" },
              { title: "Safety", desc: "Prioritizing safety in all operations" },
            ].map((value, i) => (
              <div key={i} className="text-center p-6">
                <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="font-display text-xl text-foreground mb-2">{value.title}</h4>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
