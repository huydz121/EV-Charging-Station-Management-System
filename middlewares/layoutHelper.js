const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

/**
 * Renders a view inside a layout template.
 * Usage in controller: renderWithLayout(res, 'customer/index', 'layouts/customer-layout', { title: '...', ... })
 */
function renderWithLayout(res, view, layout, data = {}) {
  const viewsDir = path.join(__dirname, '..', 'views');
  const viewPath = path.join(viewsDir, view + '.ejs');
  const layoutPath = path.join(viewsDir, layout + '.ejs');

  // Render the view content first
  ejs.renderFile(viewPath, data, (err, contentHtml) => {
    if (err) {
      console.error('View render error:', err);
      return res.status(500).send('View render error: ' + err.message);
    }

    // Render the layout with the content
    data.contentHtml = contentHtml;
    ejs.renderFile(layoutPath, data, (err2, html) => {
      if (err2) {
        console.error('Layout render error:', err2);
        return res.status(500).send('Layout render error: ' + err2.message);
      }
      res.send(html);
    });
  });
}

module.exports = { renderWithLayout };
