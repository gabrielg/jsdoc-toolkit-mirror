<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fn="http://www.w3.org/2005/02/xpath-functions"
  xmlns:xdt="http://www.w3.org/2005/02/xpath-datatypes"
  exclude-result-prefixes="xhtml xsl fn xs xdt">
<xsl:output method="xml" version="1.0" encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.1//EN" doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd" indent="yes"/>

<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
	<title>JsDoc Index</title>
	</head>
	<body>
		<ul><xsl:for-each select="./JsDoc/Item">
		<xsl:variable name="filename" select="concat('_', position(), '.html')" />
		<li>
		<a class="toc" href="{$filename}"><xsl:copy-of select="./overview/name"/></a>
		</li>
		</xsl:for-each></ul>
	</body>
</html>
</xsl:template>

</xsl:stylesheet>