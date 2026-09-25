-- One-time backfill: assigns a category to the 3 posts that existed before the
-- category field was added. Run once in Supabase SQL Editor, after schema.sql.
-- New posts get their category from the admin panel going forward; edit any of
-- these anytime from there too if a different category fits better.

update posts set category = 'noticias'  where slug = 'bienvenidos-a-school-of-hope-international';
update posts set category = 'educacion' where slug = 'escuela-online-bilingue';
update posts set category = 'comunidad' where slug = 'educacion-con-proposito';
