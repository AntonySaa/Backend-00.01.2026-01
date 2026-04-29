const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const router = Router();

const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Hackatón Express Pro - API Docs',
  customCss: `
    .topbar { background: #1a1a2e !important; }
    .topbar-wrapper img { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='30px'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E"); }
  `,
}));

module.exports = router;
