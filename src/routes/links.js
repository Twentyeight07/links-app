const { Router } = require('express');
const router = Router();

const { pool } = require('../database.js');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
  res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body;
  const user_id = req.user.id;

  const [rows] = await pool.query(
    'INSERT INTO links(title, url, description, user_id) VALUES(?, ?, ?, ?)',
    [title, url, description, user_id]
  );
  req.flash('success', 'Link saved successfully! :)');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
  const rows = await pool.query('SELECT * FROM links WHERE user_id = ?', [
    req.user.id,
  ]);
  const links = rows[0];
  // console.log(links[0]);
  res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE id = ?', [id]);
  req.flash('success', 'Link deleted successfully! :)');
  res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  const links = rows[0];
  res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;
  console.log(title, url, description);

  await pool.query(
    'UPDATE links SET title = ?, url = ?, description = ? WHERE id = ?',
    [title, url, description, Number(id)]
  );

  req.flash('success', 'Link updated! :)');
  res.redirect('/links');
});

module.exports = router;
