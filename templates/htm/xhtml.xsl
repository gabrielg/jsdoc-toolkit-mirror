<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/02/xpath-functions"
	xmlns:xdt="http://www.w3.org/2005/02/xpath-datatypes"
	exclude-result-prefixes="xhtml xsl fn xs xdt">
<xsl:output
	method="html"
	encoding="UTF-8"
	indent="yes"
	doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
	doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<!-- file overview -->
<xsl:template name="overview">
	<xsl:param name="overview"/>
	<h1><xsl:value-of select="overview/name"/></h1>
	<div class="overview">
	<div class="desc">
		<xsl:value-of select="overview/desc"/>
	</div>
	<ul class="tags">
	<xsl:for-each select="overview/doc/tags/Item">
		<li class="tagItem">
			<xsl:value-of select="title"/>: <xsl:value-of select="desc" disable-output-escaping="yes"/>
		</li>
	</xsl:for-each>
	</ul>
	</div>
</xsl:template>

<!-- symbol details -->
<xsl:template match="symbols/Item">
	<div class="symbol">
	<a><xsl:attribute name="name"><xsl:value-of select="./alias"/></xsl:attribute>
	<xsl:value-of select="./name"/></a>
	<xsl:if test="./desc!='undefined'">
		<div class="desc">
			<xsl:value-of select="./desc"/>
		</div>
	</xsl:if>
	<xsl:if test="count(./doc/tags/Item)&gt;0">
	<ul class="tags">
		<xsl:for-each select="./doc/tags/Item">
			<li class="tagItem">
				<xsl:value-of select="title"/><xsl:text> </xsl:text>
				<xsl:if test="type!='undefined'">
					{<xsl:value-of select="type"/>}<xsl:text> </xsl:text>
				</xsl:if>
				<xsl:if test="name!='undefined'">
					<strong><xsl:value-of select="name"/></strong><xsl:text> </xsl:text>
				</xsl:if>
				<xsl:if test="desc!='undefined'">
					<xsl:value-of select="desc" disable-output-escaping="yes"/>
				</xsl:if>
			</li>
		</xsl:for-each>
	</ul>
	</xsl:if>
	</div>
</xsl:template>

<!-- main document -->
<xsl:template match="/">
<xsl:for-each select="./jsdoc/Item">
<xsl:variable name="filename" select="concat('_', position(), '.html')" />
<xsl:result-document href="{$filename}">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	
	<title>JsDoc</title>
	<link rel="stylesheet" href="style.css" type="text/css" media="screen" />
	</head>
	<body>
		
		<xsl:call-template name="overview">
		<xsl:with-param name="overview" select="symbols/Item[isa='FILE']"/>
		</xsl:call-template>

		<h2>Constructors</h2>
		<xsl:apply-templates select="symbols/Item[isa='CONSTRUCTOR']"/>
		
		<h2>Functions</h2>
		<xsl:apply-templates select="symbols/Item[isa='FUNCTION']"/>
		
		<h2>Objects</h2>
		<xsl:apply-templates select="symbols/Item[isa='OBJECT']"/>

	</body>
</html>

</xsl:result-document>
</xsl:for-each>
</xsl:template>

</xsl:stylesheet>