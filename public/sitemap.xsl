<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sitemap</title>
        <style type="text/css">
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 2rem 1rem;
            font-family: Georgia, "Times New Roman", serif;
            background: #f9fafb;
            color: #111827;
          }
          h1 {
            margin: 0 0 1.25rem;
            font-size: 1.75rem;
            font-weight: 700;
          }
          table {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            border-collapse: collapse;
            background: #ffffff;
            border: 1px solid #d1d5db;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }
          th, td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
            word-break: break-all;
          }
          th {
            background: #111827;
            color: #ffffff;
            font-weight: 600;
          }
          tr:nth-child(even) td {
            background: #f3f4f6;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .wrap {
            max-width: 1100px;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Sitemap</h1>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="//*[local-name()='url'] | //*[local-name()='sitemap']">
                <tr>
                  <td>
                    <a href="{*[local-name()='loc']}">
                      <xsl:value-of select="*[local-name()='loc']" />
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="*[local-name()='lastmod']" />
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
