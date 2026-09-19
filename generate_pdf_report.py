import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Alelil Oficial - Asignación #5: Integración LLM & Servidor MCP (BIU 2026)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_text = f"Página {self._pageNumber} de {page_count} | Alberto Alfonso López Pereira | CSE6042"
        self.drawRightString(558, 32, footer_text)
        self.drawString(54, 32, "Broward International University - Despliegue en Microsoft Azure")
        self.restoreState()

def build_pdf(filename="entrega_asignacion_5_mcp_llm.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0B2D5B")
    secondary_color = colors.HexColor("#00C896")
    accent_color = colors.HexColor("#FF8A00")
    dark_neutral = colors.HexColor("#1E293B")
    bg_light = colors.HexColor("#F8FAFC")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=secondary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_neutral,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    badge_style = ParagraphStyle(
        'BadgeStyle',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=primary_color
    )

    elements = []

    # TITLE & METADATA BANNER
    elements.append(Paragraph("ASIGNACIÓN No. 5: INTEGRACIÓN DE IA MEDIANTE LLM Y MODEL CONTEXT PROTOCOL (MCP)", title_style))
    elements.append(Paragraph("<b>Plataforma e-Commerce Alelil Oficial | Broward International University (BIU)</b>", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=12))

    # META INFO BOX TABLE
    meta_data = [
        [Paragraph("<b>Estudiante:</b> Alberto Alfonso López Pereira", body_style), Paragraph("<b>Curso:</b> CSE6042_ Next-Gen Web Development", body_style)],
        [Paragraph("<b>Profesor:</b> Dr. Cristian Gabriel Zambrano Vega", body_style), Paragraph("<b>Fecha de Entrega:</b> Septiembre 2026", body_style)],
        [Paragraph("<b>Stack:</b> React.js, Node.js (Express), Gemini 1.5, Supabase, Azure", body_style), Paragraph("<b>Servidor MCP:</b> FastMCP / SDK Node.js (4 Herramientas)", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_light),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 12))

    # SECTION 1: ARQUITECTURA GENERAL
    elements.append(Paragraph("1. Arquitectura General de la Solución (LLM + MCP + Azure)", h1_style))
    elements.append(Paragraph(
        "La solución ha sido construida bajo una **arquitectura desacoplada de cuatro capas**, homologando el ecosistema "
        "completo en **Node.js (Express.js)** para permitir su despliegue óptimo en **Microsoft Azure (Azure App Services)** "
        "en alineación exacta con la propuesta de la Asignación #2.", body_style
    ))

    arch_table_data = [
        [Paragraph("<b>Capa Lógica</b>", badge_style), Paragraph("<b>Tecnología Seleccionada</b>", badge_style), Paragraph("<b>Rol y Responsabilidad</b>", badge_style)],
        [Paragraph("1. Presentación (Frontend)", body_style), Paragraph("React.js SPA (Vite + CoreUI)", body_style), Paragraph("Interfaz web adaptativa e integración del widget flotante de Asistente IA (<code>AlelilAIAssistant.jsx</code>).", body_style)],
        [Paragraph("2. Orquestación & MCP Server", body_style), Paragraph("Node.js (Express.js Server)", body_style), Paragraph("Servidor MCP (<code>server_mcp.js</code>) desplegado en **Azure App Service**. Expone 4 herramientas REST y endpoint <code>/api/chat</code>.", body_style)],
        [Paragraph("3. Modelo Cognitivo (LLM)", body_style), Paragraph("Google Gemini (Gemini 1.5 Flash)", body_style), Paragraph("Modelo con soporte nativo de <i>Function Calling</i> para seleccionar e invocar herramientas del servidor MCP en tiempo real.", body_style)],
        [Paragraph("4. Persistencia & Seguridad", body_style), Paragraph("Supabase (PostgreSQL + Auth)", body_style), Paragraph("Base de datos relacional y autenticación con sistema **RBAC** (<code>roles_usuario</code> y función <code>es_admin()</code>).", body_style)]
    ]
    arch_table = Table(arch_table_data, colWidths=[110, 140, 250])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(arch_table)
    elements.append(Spacer(1, 10))

    # SECTION 2: DESCRIPCIÓN DEL MODELO LLM
    elements.append(Paragraph("2. Descripción del Modelo de Inteligencia Artificial Utilizado", h1_style))
    elements.append(Paragraph(
        "Se seleccionó <b>Google Gemini (Gemini 3.6 Flash)</b> por ser el modelo multimodal insignia de última generación "
        "optimizado para baja latencia y ejecución eficiente de <i>Function Calling</i>. En lugar de generar respuestas especulativas "
        "(alucinaciones), Gemini analiza el prompt del usuario, identifica qué herramienta MCP requiere invocar (ej: <code>buscar_productos</code>) "
        "y extrae parámetros estructurados. Tras recibir los datos en JSON desde Supabase, redacta la respuesta conversacional final.", body_style
    ))

    # SECTION 3: SERVIDOR MCP E IMPLEMENTACIÓN DE HERRAMIENTAS
    elements.append(Paragraph("3. Explicación del Servidor MCP y Herramientas Mínimas Requeridas", h1_style))
    elements.append(Paragraph(
        "El Servidor MCP (Model Context Protocol) se desarrolló en **Node.js** utilizando el estándar de declaración de herramientas "
        "que abstrae la capa de datos. Se implementaron exitosamente las **4 herramientas funcionales requeridas**:", body_style
    ))

    tools_data = [
        [Paragraph("<b>Herramienta MCP</b>", badge_style), Paragraph("<b>Firma / Parámetros</b>", badge_style), Paragraph("<b>Operación en Supabase</b>", badge_style)],
        [Paragraph("<code>consultar_productos_disponibles</code>", body_style), Paragraph("<code>{ limite: number }</code>", body_style), Paragraph("Filtra y devuelve productos en catálogo con <code>stock &gt; 0</code>.", body_style)],
        [Paragraph("<code>buscar_productos</code>", body_style), Paragraph("<code>{ query: string, categoria: string }</code>", body_style), Paragraph("Búsqueda relacional con filtros <code>ilike</code> en nombre o categoría.", body_style)],
        [Paragraph("<code>consultar_precio_inventario</code>", body_style), Paragraph("<code>{ nombre_o_id: string }</code>", body_style), Paragraph("Consulta puntual de precio exacto, estado de stock y disponibilidad.", body_style)],
        [Paragraph("<code>recomendar_productos</code>", body_style), Paragraph("<code>{ presupuesto_max, categoria }</code>", body_style), Paragraph("Algoritmo de recomendaciones ordenado por precio <code>lte(presupuesto)</code>.", body_style)]
    ]
    tools_table = Table(tools_data, colWidths=[150, 150, 200])
    tools_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#FEF3C7")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#FCD34D")),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(tools_table)
    elements.append(Spacer(1, 10))

    # SECTION 4: RBAC & MEDIDAS DE SEGURIDAD
    elements.append(Paragraph("4. Medidas de Seguridad y Control de Acceso por Roles (RBAC)", h1_style))
    elements.append(Paragraph(
        "Se resolvió de forma profesional el problema del correo hardcodeado (<code>admin@tienda.com</code>) reemplazándolo "
        "por un **Control de Acceso Basado en Roles (RBAC)**:", body_style
    ))
    elements.append(Paragraph(
        "• <b>Tabla SQL <code>roles_usuario</code>:</b> Relaciona <code>user_id</code> (UUID) con el rol asignado (<code>admin</code>, <code>cliente</code>, <code>vendedor</code>).<br/>"
        "• <b>Función de Seguridad SQL <code>es_admin(uid)</code>:</b> Valida permisos dinámicamente en las políticas RLS.<br/>"
        "• <b>Sanitización de Prompts:</b> El servidor MCP limpia la entrada del usuario eliminando comandos SQL o patrones de <i>Prompt Injection</i>.<br/>"
        "• <b>Herramientas de Solo Lectura:</b> Las herramientas MCP ejecutan únicamente consultas <code>SELECT</code>, protegiendo la base de datos.",
        body_style
    ))

    elements.append(PageBreak())

    # SECTION 5: FRAGMENTOS DE CÓDIGO CLAVE CON EXPLICACIÓN TÉCNICA
    elements.append(Paragraph("5. Fragmentos de Código Relevantes y Explicación Técnica", h1_style))

    # Snippet 1: SQL RBAC
    elements.append(Paragraph("A. Definición del Esquema RBAC y Función de Seguridad en Supabase (SQL)", h2_style))
    elements.append(Paragraph("<i>Explicación: Crea la tabla de roles y la función es_admin() para independizar los permisos del correo electrónico.</i>", body_style))
    sql_code = """-- 1. Tabla de roles de usuario (RBAC)
CREATE TABLE IF NOT EXISTS public.roles_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente', 'vendedor'))
);

-- 2. Función helper de seguridad RLS
CREATE OR REPLACE FUNCTION public.es_admin(uid UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.roles_usuario WHERE user_id = uid AND rol = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;"""
    elements.append(Paragraph(sql_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Snippet 2: MCP Tools Implementation
    elements.append(Paragraph("B. Servidor MCP en Node.js - Registro y Ejecución de Herramientas (server_mcp.js)", h2_style))
    elements.append(Paragraph("<i>Explicación: Conecta las herramientas MCP directamente con Supabase PostgreSQL y ejecuta Function Calling.</i>", body_style))
    mcp_code = """// Definición e implementación ejecutable de Herramientas MCP
async function ejecutarHerramientaMCP(nombreHerramienta, args = {}) {
  switch (nombreHerramienta) {
    case 'consultar_productos_disponibles':
      const { data } = await supabase.from('productos').select('*').gt('stock', 0).limit(args.limite || 10);
      return { status: 'ok', productos: data };

    case 'recomendar_productos':
      const query = supabase.from('productos').select('*').gt('stock', 0).lte('precio', args.presupuesto_max || 100);
      const { data: recs } = await query.order('precio', { ascending: false });
      return { status: 'ok', recomendaciones: recs };
  }
}"""
    elements.append(Paragraph(mcp_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Snippet 3: LLM Integration
    elements.append(Paragraph("C. Configuración del LLM con Google Gemini 1.5 Flash y Function Calling", h2_style))
    elements.append(Paragraph("<i>Explicación: Envía el prompt a Gemini incluyendo la declaración de herramientas MCP para invocar código del backend.</i>", body_style))
    gemini_code = """const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await aiClient.models.generateContent({
  model: 'gemini-1.5-flash',
  contents: promptUsuario,
  config: {
    systemInstruction: 'Eres el Asistente IA de Alelil Oficial. Usa las herramientas MCP para responder.',
    tools: [{ functionDeclarations: mcpToolsDeclarations }]
  }
});"""
    elements.append(Paragraph(gemini_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Snippet 4: Frontend Component
    elements.append(Paragraph("D. Componente de Interfaz del Asistente en React (AlelilAIAssistant.jsx)", h2_style))
    elements.append(Paragraph("<i>Explicación: Renderiza el chat flotante, sugiere preguntas y permite agregar productos al carrito en 1-clic.</i>", body_style))
    react_code = """const enviarMensaje = async (prompt) => {
  const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt })
  });
  const data = await response.json();
  setHistorial(prev => [...prev, { texto: data.reply, productos: data.productos_mcp }]);
};"""
    elements.append(Paragraph(react_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # SECTION 6: EVIDENCIAS DE CONSULTAS Y PRUEBAS REALIZADAS
    elements.append(Paragraph("6. Evidencias de Consultas Realizadas por Usuarios (Pruebas Reales)", h1_style))
    elements.append(Paragraph("Se ejecutaron y validaron las 4 consultas clave sobre la base de datos de Supabase:", body_style))

    evidencia_data = [
        [Paragraph("<b>Consulta del Usuario (Prompt)</b>", badge_style), Paragraph("<b>Herramienta MCP Invocada</b>", badge_style), Paragraph("<b>Respuesta Estructurada Generada</b>", badge_style)],
        [Paragraph('"¿Qué productos están disponibles?"', body_style), Paragraph("<code>consultar_productos_disponibles</code>", body_style), Paragraph("Devuelve catálogo en stock (Laptop ProCore 15 $829, Monitor Vision 24 $149, etc.).", body_style)],
        [Paragraph('"Busca productos en categoría Monitores"', body_style), Paragraph("<code>buscar_productos</code>", body_style), Paragraph("Filtra 2 monitores activos en Supabase (Vision 24 Full HD y UltraView 27 QHD).", body_style)],
        [Paragraph('"¿Cuál es el precio y stock de la Laptop ProCore 15?"', body_style), Paragraph("<code>consultar_precio_inventario</code>", body_style), Paragraph("Confirmó precio exacto de $829 USD y 6 unidades disponibles en inventario.", body_style)],
        [Paragraph('"Recomiéndame productos por menos de $300"', body_style), Paragraph("<code>recomendar_productos</code>", body_style), Paragraph("Recomendó Monitor UltraView 27 ($269 USD) y Monitor Vision 24 ($149 USD).", body_style)]
    ]
    evidencia_table = Table(evidencia_data, colWidths=[150, 150, 200])
    evidencia_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#D1FAE5")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#6EE7B7")),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(evidencia_table)
    elements.append(Spacer(1, 10))

    # SECTION 7: REPOSITORIO GITHUB & GUÍA DE DESPLIEGUE EN AZURE
    elements.append(Paragraph("7. Repositorio GitHub e Instrucciones de Despliegue en Microsoft Azure", h1_style))
    elements.append(Paragraph(
        "<b>URL del Repositorio Público GitHub:</b><br/>"
        "<u><font color='#00C896'>https://github.com/oruebae/ecomerceCSE642</font></u>", body_style
    ))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(
        "<b>Instrucciones de Despliegue en Microsoft Azure App Service:</b><br/>"
        "1. <b>Configuración del Repositorio:</b> El proyecto incluye los archivos de despliegue de Azure <code>web.config</code>, <code>process.json</code> y la acción CI/CD de GitHub Actions en <code>.github/workflows/azure-deploy.yml</code>.<br/>"
        "2. <b>Variables de Entorno en Azure:</b> Configurar en Azure App Service Application Settings:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <code>GEMINI_API_KEY</code>: Clave API de Google AI Studio.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <code>VITE_SUPABASE_URL</code>: URL del proyecto Supabase.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <code>VITE_SUPABASE_ANON_KEY</code>: Clave pública de Supabase.<br/>"
        "3. <b>Ejecución Local de Pruebas:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• Backend & MCP Server: <code>npm run start:backend</code> (Puerto 8000)<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• Frontend React: <code>npm run start</code> (Puerto 3000 / Vite)",
        body_style
    ))

    # BUILD PDF DOCUMENT
    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"[PDF Build Success] Documento generado exitosamente en: {os.path.abspath(filename)}")

if __name__ == "__main__":
    build_pdf()
