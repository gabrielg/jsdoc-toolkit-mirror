<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fn="http://www.w3.org/2005/02/xpath-functions"
  xmlns:xdt="http://www.w3.org/2005/02/xpath-datatypes"
  exclude-result-prefixes="xhtml xsl fn xs xdt">
<xsl:output method="html" version="1.0" encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.1//EN" doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd" indent="yes"/>

<xsl:template match="overview">
	<h1><xsl:value-of select="./name"/></h1>
	<xsl:if test="./doc/tags/Item[title='overview']/desc!='undefined'">
	<div class="overview">
	<xsl:value-of select="./doc/tags/Item[title='overview']/desc"/>
	</div>
	</xsl:if>
	<ul class="tags">
	<xsl:for-each select="./doc/tags/Item">
		<xsl:if test="title!='overview'">
		<li class="tagItem"><xsl:value-of select="title"/>: <xsl:value-of select="desc" disable-output-escaping="yes"/></li>
		</xsl:if>
	</xsl:for-each>
	</ul>
</xsl:template>

<xsl:template match="symbols/Item">
	<p><xsl:value-of select="./isa"/><xsl:text> </xsl:text>
	<a><xsl:attribute name="name"><xsl:value-of select="./alias"/></xsl:attribute>
	<xsl:value-of select="./name"/></a>
	<ul class="tags">
		<xsl:for-each select="./doc/tags/Item">
		<li class="tagItem">
			<xsl:value-of select="title"/><xsl:text> </xsl:text>
			<xsl:if test="type!='undefined'">
				{<xsl:value-of select="type"/>}<xsl:text> </xsl:text>
			</xsl:if>
			<xsl:if test="name!='undefined'">
				<b><xsl:value-of select="name"/></b><xsl:text> </xsl:text>
			</xsl:if>
			<xsl:if test="desc!='undefined'">
				<xsl:value-of select="desc" disable-output-escaping="yes"/>
			</xsl:if>
		</li>
		</xsl:for-each>
	</ul>
	</p>
</xsl:template>

<xsl:template match="/">
<xsl:for-each select="./JsDoc/Item">
<xsl:variable name="filename" select="concat('_', position(), '.html')" />
<xsl:result-document href="{$filename}">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
	<title>JsDoc</title>
	<link rel="stylesheet" href="style.css" type="text/css" media="screen" />
	</head>
	<body>
		<xsl:apply-templates select="overview"/>
		
		<xsl:apply-templates select="symbols/Item"/>
	</body>
</html>
</xsl:result-document>
</xsl:for-each>
</xsl:template>

</xsl:stylesheet>