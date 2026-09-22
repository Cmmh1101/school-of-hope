-- Migrates the 3 existing posts from https://schoolofhopeinternational.org/blog/ into the
-- new bilingual posts table, with English translations added.
--
-- Run once: Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Run supabase/schema.sql first if you haven't already (this depends on the posts table).
-- Safe to re-run: each insert is keyed on slug and skipped if that slug already exists.

insert into posts (slug, title_es, excerpt_es, body_es, title_en, excerpt_en, body_en, status, published_at)
values (
  'bienvenidos-a-school-of-hope-international',
  'Bienvenidos a School of Hope International',
  'Somos una academia internacional que ofrece educación virtual bilingüe, flexible y accesible, alineada con los estándares educativos de EE. UU.',
  $q$<p>En School of Hope International creemos que la educación transforma vidas, abre puertas y crea oportunidades reales para un mejor futuro.</p>
<p>Somos una academia internacional que ofrece educación virtual bilingüe, flexible y accesible, alineada con los estándares educativos de los Estados Unidos, diseñada para estudiantes y adultos de distintas partes del mundo.</p>
<p>Nuestro enfoque va más allá de lo académico. Educamos con propósito, integridad y compasión, acompañando a cada estudiante en su proceso de aprendizaje y crecimiento personal.</p>
<h3>Educación sin fronteras</h3>
<p>Nuestros programas permiten estudiar desde cualquier lugar, adaptándose al ritmo y realidad de cada estudiante, sin importar su nacionalidad o ubicación.</p>
<h3>Programas que se adaptan a tu vida</h3>
<p>Ofrecemos programas como:</p>
<ul>
<li>Bachillerato Online Acelerado USA</li>
<li>High School 9°–12° grado</li>
<li>High School para Adultos</li>
<li>Doble Titulación USA</li>
<li>Bachillerato Online USA (7°–12°)</li>
</ul>
<p>Todos nuestros programas están diseñados para brindar flexibilidad, acompañamiento académico y una formación integral.</p>
<h3>Nuestra misión</h3>
<p>Brindar educación virtual de calidad, bilingüe y accesible, formando estudiantes con valores, propósito y visión global.</p>
<p>Te damos la bienvenida a una comunidad donde la educación es esperanza.</p>$q$,
  'Welcome to School of Hope International',
  'We are an international academy offering flexible, accessible, bilingual virtual education, aligned with U.S. educational standards.',
  $q$<p>At School of Hope International, we believe education transforms lives, opens doors, and creates real opportunities for a better future.</p>
<p>We are an international academy offering flexible, accessible, bilingual virtual education, aligned with United States educational standards, designed for students and adults from around the world.</p>
<p>Our approach goes beyond academics. We educate with purpose, integrity, and compassion, walking alongside every student through their learning and personal growth.</p>
<h3>Education without borders</h3>
<p>Our programs let you study from anywhere, adapting to each student's pace and circumstances, regardless of nationality or location.</p>
<h3>Programs that fit your life</h3>
<p>We offer programs including:</p>
<ul>
<li>Accelerated Online High School USA</li>
<li>High School, grades 9–12</li>
<li>High School for Adults</li>
<li>USA Dual Diploma</li>
<li>Online High School USA (grades 7–12)</li>
</ul>
<p>Every program is designed to offer flexibility, academic support, and well-rounded formation.</p>
<h3>Our mission</h3>
<p>To provide quality, bilingual, accessible virtual education, forming students with values, purpose, and a global vision.</p>
<p>Welcome to a community where education is hope.</p>$q$,
  'published',
  '2025-01-20T09:00:00-04:00'
)
on conflict (slug) do nothing;

insert into posts (slug, title_es, excerpt_es, body_es, title_en, excerpt_en, body_en, status, published_at)
values (
  'escuela-online-bilingue',
  '¿Por qué elegir una escuela online bilingüe?',
  'Hoy más que nunca, estudiar en línea y en dos idiomas es una ventaja real para el futuro académico y profesional.',
  $q$<p>La educación ha evolucionado, y hoy más que nunca, estudiar en línea y en dos idiomas es una ventaja real para el futuro académico y profesional.</p>
<p>En School of Hope International creemos que el bilingüismo abre puertas globales y fortalece el desarrollo integral de nuestros estudiantes.</p>
<h3>Ventajas de la educación online</h3>
<ul>
<li>Flexibilidad de horarios</li>
<li>Aprendizaje desde cualquier lugar</li>
<li>Ritmo personalizado</li>
<li>Ideal para estudiantes y adultos trabajadores</li>
</ul>
<h3>El poder de una educación bilingüe</h3>
<p>Estudiar en español e inglés:</p>
<ul>
<li>Mejora oportunidades universitarias</li>
<li>Fortalece habilidades profesionales</li>
<li>Desarrolla pensamiento global</li>
<li>Prepara para un mundo interconectado</li>
</ul>
<h3>Acompañamiento y propósito</h3>
<p>No solo ofrecemos contenidos académicos, sino acompañamiento, mentoría y una comunidad educativa que apoya el crecimiento personal y académico.</p>
<p>Elegir una escuela online bilingüe es elegir preparación, flexibilidad y futuro.</p>$q$,
  'Why choose a bilingual online school?',
  'Today more than ever, studying online and in two languages is a real advantage for your academic and professional future.',
  $q$<p>Education has evolved, and today more than ever, studying online and in two languages is a real advantage for your academic and professional future.</p>
<p>At School of Hope International, we believe bilingualism opens global doors and strengthens our students' well-rounded development.</p>
<h3>Advantages of online education</h3>
<ul>
<li>Flexible scheduling</li>
<li>Learn from anywhere</li>
<li>Personalized pace</li>
<li>Ideal for students and working adults</li>
</ul>
<h3>The power of a bilingual education</h3>
<p>Studying in Spanish and English:</p>
<ul>
<li>Improves college opportunities</li>
<li>Strengthens professional skills</li>
<li>Builds global thinking</li>
<li>Prepares you for an interconnected world</li>
</ul>
<h3>Support and purpose</h3>
<p>We don't just offer academic content — we offer support, mentorship, and an educational community that champions personal and academic growth.</p>
<p>Choosing a bilingual online school means choosing preparation, flexibility, and a future.</p>$q$,
  'published',
  '2025-01-20T14:00:00-04:00'
)
on conflict (slug) do nothing;

insert into posts (slug, title_es, excerpt_es, body_es, title_en, excerpt_en, body_en, status, published_at)
values (
  'educacion-con-proposito',
  'Educación con propósito: formando estudiantes para el futuro',
  'Educar no es solo transmitir conocimiento, sino formar personas con valores, carácter y visión.',
  $q$<p>En School of Hope International creemos que educar no es solo transmitir conocimiento, sino formar personas con valores, carácter y visión.</p>
<h3>Nuestra educación se fundamenta en principios como:</h3>
<ul>
<li>Integridad</li>
<li>Compasión</li>
<li>Responsabilidad</li>
<li>Propósito</li>
</ul>
<h3>Más allá de las notas</h3>
<p>Buscamos que nuestros estudiantes desarrollen:</p>
<ul>
<li>Pensamiento crítico</li>
<li>Autonomía</li>
<li>Responsabilidad social</li>
<li>Liderazgo con valores</li>
</ul>
<h3>Comunidad y acompañamiento</h3>
<p>Creemos en el acompañamiento constante entre estudiantes, familias y educadores. La educación es un proceso compartido.</p>
<p>Preparados para impactar el mundo. Nuestros estudiantes no solo obtienen un diploma; adquieren herramientas para construir un futuro sólido y contribuir positivamente a sus comunidades.</p>
<p>Educación con propósito es educación con esperanza.</p>$q$,
  'Education with purpose: forming students for the future',
  'Educating isn''t just about passing on knowledge — it''s about forming people with values, character, and vision.',
  $q$<p>At School of Hope International, we believe educating isn't just about passing on knowledge — it's about forming people with values, character, and vision.</p>
<h3>Our education is grounded in principles like:</h3>
<ul>
<li>Integrity</li>
<li>Compassion</li>
<li>Responsibility</li>
<li>Purpose</li>
</ul>
<h3>Beyond grades</h3>
<p>We want our students to develop:</p>
<ul>
<li>Critical thinking</li>
<li>Independence</li>
<li>Social responsibility</li>
<li>Values-driven leadership</li>
</ul>
<h3>Community and support</h3>
<p>We believe in constant support between students, families, and educators. Education is a shared process.</p>
<p>Ready to make an impact: our students don't just earn a diploma, they gain the tools to build a solid future and contribute positively to their communities.</p>
<p>Education with purpose is education with hope.</p>$q$,
  'published',
  '2025-02-07T09:00:00-04:00'
)
on conflict (slug) do nothing;
