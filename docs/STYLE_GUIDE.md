# LaFilmoteca - Guía de Estilos

Esta guía define el sistema de diseño minimalista para LaFilmoteca, asegurando una experiencia visual coherente y profesional en toda la aplicación.

## Paleta de Colores

### Colores Principales

- **Verde Oscuro (#0D1E1A)**: Color principal para fondos y elementos de base. Proporciona un ambiente elegante y cinematográfico.
- **Verde Grisáceo (#50645D)**: Color secundario para elementos de interfaz como bordes, separadores y elementos inactivos.
- **Verde Oliva (#788F6D)**: Color de acento para elementos interactivos como botones, enlaces y elementos destacados.

### Colores Neutros

- **Blanco Roto (#FDFDFC)**: Color principal para textos y elementos que requieren alto contraste sobre fondos oscuros.
- **Gris Claro (#D4DCDD)**: Color para textos secundarios, fondos alternativos y elementos deshabilitados.

## Tipografía

- **Familia Principal**: Inter, system-ui, sans-serif
- **Jerarquía de Textos**:
  - Títulos principales: 24px (1.5rem), negrita
  - Subtítulos: 20px (1.25rem), semibold
  - Texto de cuerpo: 16px (1rem), regular
  - Texto pequeño: 14px (0.875rem), regular
  - Micro texto: 12px (0.75rem), regular

## Espaciado

- **Unidad Base**: 4px
- **Espaciado Interno (padding)**:
  - Pequeño: 8px (0.5rem)
  - Medio: 16px (1rem)
  - Grande: 24px (1.5rem)
  - Extra grande: 32px (2rem)
- **Espaciado Entre Elementos (margin)**:
  - Pequeño: 8px (0.5rem)
  - Medio: 16px (1rem)
  - Grande: 24px (1.5rem)
  - Extra grande: 32px (2rem)

## Bordes y Radios

- **Bordes**:
  - Estándar: 1px solid
  - Enfatizado: 2px solid
- **Radios de Borde**:
  - Pequeño: 4px (0.25rem)
  - Medio: 8px (0.5rem)
  - Grande: 12px (0.75rem)
  - Completo: 9999px (para elementos circulares o píldoras)

## Sombras

- **Sutil**: 0 2px 4px rgba(0, 0, 0, 0.1)
- **Media**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Pronunciada**: 0 10px 15px rgba(0, 0, 0, 0.1)

## Componentes

### Botones

- **Primario**: Fondo verde oliva (#788F6D), texto blanco roto (#FDFDFC)
- **Secundario**: Borde verde grisáceo (#50645D), texto blanco roto (#FDFDFC), fondo transparente
- **Terciario**: Sin borde, texto verde oliva (#788F6D), fondo transparente
- **Deshabilitado**: Fondo gris claro (#D4DCDD), texto verde grisáceo (#50645D)

### Tarjetas

- **Fondo**: Verde oscuro (#0D1E1A) con opacidad reducida
- **Borde**: 1px solid verde grisáceo (#50645D) con opacidad reducida
- **Sombra**: Sutil a media según la elevación
- **Radio**: Medio (8px)

### Formularios

- **Inputs**: Fondo verde oscuro (#0D1E1A), borde verde grisáceo (#50645D), texto blanco roto (#FDFDFC)
- **Focus**: Borde verde oliva (#788F6D)
- **Error**: Borde rojo (#E53E3E)
- **Placeholder**: Verde grisáceo (#50645D) con opacidad

### Navegación

- **Activo**: Texto blanco roto (#FDFDFC), indicador verde oliva (#788F6D)
- **Inactivo**: Texto verde grisáceo (#50645D)
- **Hover**: Texto verde oliva (#788F6D)

## Estados

- **Hover**: Ligero aumento de opacidad o brillo
- **Active/Pressed**: Ligera reducción de opacidad o brillo
- **Focus**: Anillo de enfoque verde oliva (#788F6D)
- **Disabled**: Opacidad reducida (70%)

## Iconografía

- **Estilo**: Líneas simples, minimalistas
- **Tamaños**:
  - Pequeño: 16px
  - Medio: 24px
  - Grande: 32px

## Transiciones y Animaciones

- **Duración**: 150ms - 300ms
- **Timing Function**: ease-in-out
- **Uso**: Aplicar en cambios de estado (hover, active) y en aparición/desaparición de elementos

## Principios de Diseño

1. **Minimalismo**: Usar solo los elementos necesarios para comunicar claramente
2. **Contraste**: Asegurar legibilidad con alto contraste entre texto y fondo
3. **Consistencia**: Mantener patrones de diseño coherentes en toda la aplicación
4. **Jerarquía**: Establecer clara importancia visual entre elementos
5. **Espacio**: Usar espaciado generoso para mejorar legibilidad y enfoque