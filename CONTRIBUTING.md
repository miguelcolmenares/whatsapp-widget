# Guía de Contribución - WhatsApp Widget

¡Gracias por tu interés en contribuir al WhatsApp Widget! Esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos
- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto se adhiere a un código de conducta profesional. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

## Cómo Contribuir

### Tipos de Contribuciones

Aceptamos los siguientes tipos de contribuciones:

1. **🐛 Corrección de Bugs**: Reportar o corregir bugs existentes
2. **✨ Nuevas Características**: Proponer e implementar nuevas funcionalidades
3. **📚 Documentación**: Mejorar o traducir documentación
4. **🧪 Tests**: Agregar o mejorar tests
5. **🎨 Mejoras de UI/UX**: Mejorar diseño y experiencia de usuario
6. **⚡ Optimizaciones**: Mejorar rendimiento o reducir tamaño del bundle

## Proceso de Desarrollo

### 1. Configurar el Entorno

```bash
# Clonar el repositorio
git clone https://github.com/miguelcolmenares/whatsapp-widget.git
cd whatsapp-widget

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar build
npm run build

# Ejecutar linter
npm run lint

# Formatear código
npm run prettier
```

### 2. Estructura del Proyecto

```
whatsapp-widget/
├── src/
│   ├── ts/              # Código TypeScript
│   │   ├── index.ts     # Punto de entrada
│   │   ├── whatsappWidget.ts
│   │   └── whatsappAgent.ts
│   ├── less/            # Estilos LESS
│   ├── fonts/           # Fuentes (íconos)
│   └── types/           # Definiciones de tipos
├── __tests__/           # Tests con Jest
├── dist/                # Archivos compilados (generados)
├── Gruntfile.js         # Configuración Grunt (CSS)
├── webpack.config.js    # Configuración Webpack (JS)
└── package.json         # Dependencias y scripts
```

### 3. Workflow de Git

```bash
# Crear una rama desde main
git checkout -b feature/mi-nueva-caracteristica
# o
git checkout -b fix/correccion-de-bug

# Hacer cambios y commits
git add .
git commit -m "feat: descripción breve del cambio"

# Push a tu fork
git push origin feature/mi-nueva-caracteristica
```

### 4. Commits Convencionales

Usamos el formato de [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(alcance): descripción breve

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en el proceso de build o herramientas

**Ejemplos:**
```
feat(widget): add dark mode support
fix(agent): correct date calculation for schedules
docs(readme): update installation instructions
test(widget): add tests for render method
```

## Estándares de Código

### TypeScript

- Usar TypeScript estricto (`strict: true`)
- Evitar `any`, preferir tipos específicos
- Documentar funciones públicas con JSDoc
- Seguir las reglas de ESLint configuradas

```typescript
/**
 * Descripción breve de la función
 * @param param1 - Descripción del parámetro
 * @returns Descripción del retorno
 */
public myMethod(param1: string): boolean {
    // implementación
}
```

### Estilos (LESS/CSS)

- Usar nomenclatura BEM para clases CSS
- Prefijo `wa-w` para todas las clases del widget
- Variables CSS para valores reutilizables
- Mobile-first approach

### Tests

- Escribir tests para toda nueva funcionalidad
- Mantener cobertura de tests > 80%
- Usar nombres descriptivos para tests
- Seguir el patrón AAA (Arrange, Act, Assert)

```typescript
test("should return true when schedule is valid", () => {
    // Arrange
    const agent = new WhatsappAgent(validArgs);
    
    // Act
    const result = agent.isEnabled;
    
    // Assert
    expect(result).toBe(true);
});
```

## Proceso de Pull Request

### Antes de Enviar

1. ✅ Ejecutar `npm test` - Todos los tests deben pasar
2. ✅ Ejecutar `npm run lint` - No debe haber errores de lint
3. ✅ Ejecutar `npm run build` - Build debe ser exitoso
4. ✅ Actualizar documentación si es necesario
5. ✅ Agregar tests para nuevas funcionalidades
6. ✅ Probar manualmente en diferentes navegadores (si aplica)

### Crear Pull Request

1. **Título descriptivo**: Usar formato de commits convencionales
2. **Descripción detallada**: 
   - ¿Qué cambia este PR?
   - ¿Por qué es necesario?
   - ¿Cómo se puede probar?
3. **Screenshots**: Si hay cambios visuales, incluir capturas
4. **Breaking changes**: Documentar claramente si los hay
5. **Issue relacionado**: Referenciar issue relacionado (#123)

### Template de PR

```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva característica (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente cambie)
- [ ] Documentación

## ¿Cómo se probó?
[Describe las pruebas realizadas]

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado un self-review de mi código
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi feature funciona
- [ ] Los tests nuevos y existentes pasan localmente
- [ ] He actualizado la documentación
```

### Proceso de Review

1. Un maintainer revisará tu PR
2. Pueden solicitar cambios o aclaraciones
3. Una vez aprobado, se hará merge
4. Tu contribución aparecerá en el siguiente release

## Reportar Bugs

### Antes de Reportar

1. Buscar en issues existentes
2. Verificar en la última versión
3. Probar en diferentes navegadores

### Template de Bug Report

```markdown
**Descripción del Bug**
[Descripción clara y concisa del bug]

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
[Descripción de lo que esperabas que sucediera]

**Screenshots**
[Si aplica, agregar screenshots]

**Entorno:**
 - OS: [e.g. Windows 10, macOS 12]
 - Browser: [e.g. Chrome 95, Firefox 94]
 - Versión del Widget: [e.g. 3.3.7]

**Contexto Adicional**
[Cualquier otro contexto sobre el problema]
```

## Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu feature request está relacionado con un problema?**
[Descripción clara del problema]

**Describe la solución que te gustaría**
[Descripción clara de lo que quieres que suceda]

**Describe alternativas consideradas**
[Descripción de soluciones o features alternativas]

**Contexto Adicional**
[Cualquier otro contexto o screenshots]
```

## Recursos Útiles

- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Guía de LESS](http://lesscss.org/)
- [Jest Documentation](https://jestjs.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar al maintainer: me@miguelcolmenares.com
- Revisar el archivo [TODO.md](TODO.md) para ideas de contribución

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la licencia Apache del proyecto.

---

¡Gracias por contribuir al WhatsApp Widget! 🙏
