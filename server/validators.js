// validators.js
const { z } = require('zod');

/* ─────────── スキーマ定義 ─────────── */
exports.schemas = {
  requirements: z.object({
    title    : z.string().min(1, 'タイトル必須'),
    detail   : z.string().optional().default(''),
    priority : z.enum(['H', 'M', 'L']).default('M'),
    type     : z.enum(['FR', 'NFR', 'UI']).default('FR'),
    status   : z.enum(['検討中', '確定', '保留']).default('検討中')
  }),
  features: z.object({
    title   : z.string().min(1),
    summary : z.string().optional().default(''),
    priority: z.enum(['H','M','L']).default('M'),
    owner   : z.string().optional().default('')
  }),
  wbs: z.object({
    title   : z.string().min(1),
    owner   : z.string().optional().default(''),
    start   : z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'YYYY-MM-DD'),
    end     : z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'YYYY-MM-DD'),
    progress: z.number().min(0).max(100).default(0)
  })
};

/* ─────────── ミドルウェア化 ─────────── */
exports.validate = (entity) => (req, _res, next) => {
  try {
    // parse → success: 正規化済みデータが返る／error: 例外
    req.validated = exports.schemas[entity].parse(req.body);
    return next();
  } catch (err) {
    return next({ status: 400, message: err.errors?.[0]?.message || 'Validation error' });
  }
};