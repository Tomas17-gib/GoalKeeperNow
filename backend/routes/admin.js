const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const { requireAuth, requireTipo } = require('../middleware/auth')
const router = express.Router()
router.use(requireAuth, requireTipo('admin'))


router.get('/stats', async (req, res) => {
  try {
    const [[u]] = await pool.query('SELECT COUNT(*) AS total FROM usuarios')
    const [[j]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE tipo='jugador'")
    const [[p]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE tipo='portero'")
    const [[prod]] = await pool.query('SELECT COUNT(*) AS total FROM productos')
    const [[sol]] = await pool.query('SELECT COUNT(*) AS total FROM solicitudes')
    const [[comp]] = await pool.query("SELECT COUNT(*) AS total FROM solicitudes WHERE estado='completada'")
    const [[cal]] = await pool.query('SELECT COUNT(*) AS total, AVG(estrellas) AS promedio FROM calificaciones')
    res.json({ usuarios: u.total, jugadores: j.total, porteros: p.total, productos: prod.total, solicitudes: sol.total, partidosCompletados: comp.total, calificaciones: cal.total, calificacionPromedio: cal.promedio ? Number(cal.promedio).toFixed(1) : null })
  } catch (error) { console.error('Error stats:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

router.get('/usuarios', async (req, res) => {
  try {
    const { busqueda } = req.query
    let sql = 'SELECT id, nombre, email, tipo, activo FROM usuarios'
    const params = []
    if (busqueda) { sql += ' WHERE nombre LIKE ? OR email LIKE ?'; params.push('%' + busqueda + '%', '%' + busqueda + '%') }
    sql += ' ORDER BY id DESC'
    const [filas] = await pool.query(sql, params)
    res.json(filas)
  } catch (error) { console.error('Error GET usuarios:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

router.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, password, tipo } = req.body
    if (!nombre || !email || !password || !tipo) return res.status(400).json({ error: 'Faltan campos obligatorios.' })
    const [exist] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email])
    if (exist.length > 0) return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' })
    const hash = await bcrypt.hash(password, 10)
    const [r] = await pool.query('INSERT INTO usuarios (nombre, email, password, tipo, activo, latitud, longitud) VALUES (?, ?, ?, ?, 1, 0, 0)', [nombre, email, hash, tipo])
    if (tipo === 'portero') await pool.query("INSERT INTO porteros (usuario_id, nivel, precio, descripcion) VALUES (?, 'principiante', 0, '')", [r.insertId])
    res.status(201).json({ mensaje: 'Usuario creado.', id: r.insertId })
  } catch (error) { console.error('Error POST usuarios:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

router.put('/usuarios/:id', async (req, res) => {
  try {
    const { nombre, email, tipo } = req.body
    await pool.query('UPDATE usuarios SET nombre=COALESCE(?,nombre), email=COALESCE(?,email), tipo=COALESCE(?,tipo) WHERE id=?', [nombre, email, tipo, req.params.id])
    res.json({ mensaje: 'Usuario actualizado.' })
  } catch (error) { console.error('Error PUT usuario:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

router.put('/usuarios/:id/estado', async (req, res) => {
  try {
    const { activo } = req.body
    await pool.query('UPDATE usuarios SET activo=? WHERE id=?', [activo ? 1 : 0, req.params.id])
    res.json({ mensaje: activo ? 'Usuario activado.' : 'Usuario desactivado.' })
  } catch (error) { console.error('Error PUT estado:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

router.delete('/usuarios/:id', async (req, res) => {
  try {
    if (Number(req.params.id) === req.usuario.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' })
    await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id])
    res.json({ mensaje: 'Usuario eliminado.' })
  } catch (error) { console.error('Error DELETE usuario:', error); res.status(500).json({ error: 'Error del servidor.' }) }
})

module.exports = router
