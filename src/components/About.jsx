import Section from './Section'
import Card from './Card'

const POINTS = [
  { title: 'ניסיון', desc: '12 שנות ניסיון בעיצוב שיער וזקן גברי.' },
  { title: 'אווירה', desc: 'מקום נעים ומזמין, בלי לחץ ובלי המתנות.' },
  { title: 'מקצועיות', desc: 'כלים מקצועיים וטכניקות עדכניות בכל תספורת.' },
]

export default function About() {
  return (
    <Section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold font-display sm:text-4xl">קצת עלינו</h2>
          <p className="mt-4 leading-relaxed text-muted">
            המספרה הוקמה מתוך אהבה למקצוע ולפרטים הקטנים. אנחנו מאמינים
            שתספורת טובה היא לא רק עניין של מספריים — היא עניין של הקשבה, דיוק
            ויחס אישי. כל לקוח יוצא מכאן עם מראה מוקפד וחיוך.
          </p>
        </div>
        <div className="grid gap-4">
          {POINTS.map((point) => (
            <Card key={point.title} className="p-5">
              <h3 className="font-bold text-accent-2">{point.title}</h3>
              <p className="mt-1 text-sm text-muted">{point.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
