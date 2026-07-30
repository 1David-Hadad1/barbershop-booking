import { motion } from 'framer-motion'
import Section from './Section'
import Card from './Card'

const SERVICES = [
  {
    title: 'תספורת גברים',
    desc: 'תספורת מדויקת בהתאמה אישית לצורת הפנים והסגנון שלכם.',
    price: '80 ₪',
    duration: '20 דק׳',
  },
  {
    title: 'עיצוב זקן',
    desc: 'עיצוב וטיפוח זקן מקצועי, כולל גימור בסכין.',
    price: '60 ₪',
    duration: '20 דק׳',
  },
  {
    title: 'תספורת + זקן',
    desc: 'החבילה המושלמת — מראה מלוטש מהשיער ועד הזקן.',
    price: '120 ₪',
    duration: '40 דק׳',
    highlight: true,
  },
]

export default function Services() {
  return (
    <Section id="services" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold font-display sm:text-4xl">השירותים שלנו</h2>
        <p className="mt-3 text-muted">כל מה שצריך בשביל מראה מסודר, במחיר הוגן ובלי הפתעות.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card
              className={`flex h-full flex-col gap-4 p-6 ${
                service.highlight ? 'border-accent/50 shadow-accent/10' : ''
              }`}
            >
              {service.highlight && (
                <span className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-2">
                  הכי פופולרי
                </span>
              )}
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="flex-1 text-sm text-muted">{service.desc}</p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted">{service.duration}</span>
                <span className="text-lg font-extrabold text-gradient">{service.price}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
