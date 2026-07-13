# Claude Code en la práctica

*Seminario interno — Altia · ~40-45 min + preguntas*

---

## Agenda

1. ¿Qué es Claude Code? *(~3 min)*
2. `CLAUDE.md` *(~6 min)*
3. Cómo hacer buenos prompts *(~6 min)*
4. Modo Plan / Act *(~6 min)*
5. MCPs — y el caso real de Dédalo *(~10 min, con demo en vivo)*
6. Trucos avanzados *(~5 min)*
7. Claude Design → Claude Code *(~4 min)*
8. Para saber más *(~2 min)*
9. Cierre y preguntas

---

## 1. ¿Qué es Claude Code?

Claude Code es un agente de codificación que corre en tu terminal (o VS Code/IDE). No es autocompletado: **lee tu repo, edita ficheros, ejecuta comandos, corre tests y hace commits** por sí mismo, siguiendo tus instrucciones.

Flujo típico recomendado por Anthropic: **Explore → Plan → Code → Commit**.

---

## 2. `CLAUDE.md`

Es el fichero que Claude Code lee automáticamente al arrancar en un proyecto. Ahí le das el contexto que no está en el código: convenciones, cómo correr tests, qué NO tocar, cómo prefieres que trabaje.

Dónde puede vivir:
- Raíz del repo (`./CLAUDE.md`) — se comparte con el equipo si se commitea.
- Subcarpetas — reglas específicas de ese módulo.
- `~/.claude/CLAUDE.md` — preferencias personales, en todos tus proyectos.

### Ejemplo de referencia

[`andrej-karpathy-skills/CLAUDE.md`](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) es un buen ejemplo porque no da reglas rígidas, enseña **patrones de razonamiento**. Se estructura en 4 principios:

| Principio | Idea |
|---|---|
| **Think Before Coding** | No asumas, no escondas la confusión. Si algo es ambiguo, dilo antes de codificar. |
| **Simplicity First** | La solución más simple que resuelve el problema. Nada de features especulativas. |
| **Surgical Changes** | Cambios quirúrgicos: cada línea tocada debe trazarse a la petición del usuario. |
| **Goal-Driven Execution** | Convertir peticiones vagas en objetivos verificables, con criterios de éxito claros. |

**Punto para la charla**: un buen `CLAUDE.md` no es una lista larga de reglas — es enseñarle a Claude *cómo pensar* en tu proyecto.

**Regla práctica**: máximo ~150 líneas. No es documentación exhaustiva del proyecto (eso ya debería estar en el propio código/README) — son **preferencias**: cómo te gusta que trabaje, qué evitar, qué convenciones respetar. Un `CLAUDE.md` largo se lee peor y compite por contexto en cada prompt.

---

## 3. Cómo hacer buenos prompts

Con un agente, el prompt no es una pregunta puntual: es una instrucción de trabajo. Algunas ideas clave:

- **Da contexto, no solo la tarea.** Qué archivo/módulo, por qué, qué no debe romperse.
- **Sé específico en el resultado esperado.** "Arréglalo" vs. "el test `test_login` falla con timeout, revisa el mock de `AuthService`".
- **Pide plan antes de código** en cambios grandes o ambiguos (ver punto 4).
- **Itera.** No hace falta el prompt perfecto a la primera — corrige y refina como con un compañero.
- **Da ejemplos** cuando el formato de salida importa (ej. estilo de commit, estructura de un JSON).
- **Añade restricciones.** Acotar lo que NO debe tocar/usar reduce el margen de que se vaya por las ramas. Ej: "Añade paginación a `UserTable.tsx`. No cambies la API pública del componente, no añadas dependencias nuevas, no toques el CSS."

| Prompt flojo | Prompt mejor |
|---|---|
| "Arregla el bug del login" | "El endpoint `/login` devuelve 500 cuando el email tiene mayúsculas. Revisa `AuthController.login` y añade el caso a los tests existentes." |
| "Mejora este componente" | "Refactoriza `UserTable.tsx` para paginar en cliente, sin cambiar la API pública del componente ni añadir dependencias nuevas." |

---

## 4. Modo Plan / Act

- **Plan mode**: Claude solo lee y explora — no edita nada. Te propone un plan que tú apruebas antes de que toque una sola línea.
- **Act (modo normal)**: Claude ejecuta directamente — edita, corre comandos, commitea.

**¿Cuándo usar cada uno?**

- Cambios grandes, ambiguos, o que tocan varios ficheros → **Plan** primero.
- Cambios pequeños y claros (fix puntual, typo, tarea acotada) → **Act** directo.

Flujo completo recomendado: **Explore → Plan → Act → Review**. Ver el diff, no asumir que "porque lo hizo la IA está bien".

*(Demo en vivo sugerida: pedir un cambio ambiguo en modo Plan y mostrar el plan antes de aprobarlo.)*

---

## 5. MCPs (Model Context Protocol)

Un MCP es un servidor que le da a Claude Code **herramientas y contexto de sistemas externos** — sin que tengas que salir del editor ni copiar/pegar datos a mano.

### Caso real en Altia: MCP Dédalo

Integra Redmine/Dédalo (imputación de horas, tareas) directamente en tu copiloto.

```
Claude Code → mcp-dedalo → Redmine API → Dédalo (BBDD)
```

**Requisitos**: Node.js 22+ y credenciales SSO de Altia (no hace falta token ni variables de entorno, la autenticación es automática vía SSO).

**Configuración** (fichero `.mcp.json` del proyecto, o vía `claude mcp add`):

```json
{
  "mcpServers": {
    "mcpdedalo": {
      "type": "http",
      "url": "https://mcpproxy.altia.es/metamcp/dedalo/mcp"
    }
  }
}
```

o por CLI:

```bash
claude mcp add --transport http mcpdedalo https://mcpproxy.altia.es/metamcp/dedalo/mcp
```

Al primer uso se abre el navegador pidiendo login SSO de Altia.

**Algunas herramientas que expone** (20 en total):

| Herramienta | Para qué |
|---|---|
| `list_my_issues` | Tareas asignadas a mí |
| `get_dedalo_issue` | Detalle de una tarea |
| `update_dedalo_issue_done_ratio` | Actualizar % de avance |
| `update_dedalo_issue_time` | **Imputar horas** en una tarea |
| `update_dedalo_issue_status` / `_notes` | Cambiar estado / añadir comentario |
| `create_dedalo_issue` | Crear tarea nueva |
| `list_projects` / `search_project` | Buscar proyectos |

**Ejemplos de uso real** (lenguaje natural, sin salir de Claude Code):

```
"¿Cuáles son mis tareas pendientes en Dédalo?"
"Imputa 3 horas de desarrollo en la tarea 123456"
"Marca la tarea 123456 como Resuelta y ponla al 100%"
"Comenta en la tarea 123456: bloqueado esperando acceso al entorno de pruebas"
```

*(Demo en vivo: listar tareas propias e imputar horas en una tarea real desde Claude Code.)*

> Repo interno de referencia: `mcp-dedalo` (garage.altia.es, Laboratory/mycopilot-resources). Soporte: ServiceDesk TI → "Gestor MyAssistant".

---

## 6. Trucos avanzados

Tres cosas que dan mucho valor y poca gente usa:

- **Auto mode.** Modo en el que Claude Code no para a preguntar en cada paso: toma la decisión razonable y sigue, y solo te interrumpe cuando está realmente bloqueado (falta un dato, una decisión que solo puedes tomar tú). Va mucho más rápido en tareas largas; luego revisas el resultado igual.

- **Mirar las stats.** `/cost` muestra coste y duración de la sesión; `/context` muestra cuánto del contexto llevas gastado y en qué (system prompt, herramientas, historial...). Útil para saber cuándo conviene arrancar una sesión nueva en vez de arrastrar contexto innecesario.

- **`/advisor` — segunda opinión con un modelo más fuerte.** Puedes trabajar tu sesión normal en Sonnet (rápido y barato) y, en los puntos que importan — antes de comprometerte con un enfoque, cuando algo no converge, o antes de dar la tarea por terminada — invocar `/advisor`. Reenvía toda la conversación a un modelo más potente (Opus) para que la revise como un segundo par de ojos, sin tener que cambiar de modelo toda la sesión. Barato de usar bien: solo en los momentos que realmente lo justifican.

---

## 7. Claude Design → Claude Code

*(Sección a completar)*

Idea general: diseñar la UX/UI en la herramienta web de Claude Design y traer ese diseño de vuelta a Claude Code para implementarlo directamente sobre el proyecto, cerrando el ciclo diseño → código sin reescribir a mano la maquetación.

---

## 8. Para saber más

Anthropic Academy — cursos oficiales, gratuitos, con certificado (`anthropic.skilljar.com`):

- **Claude Code 101** — introducción, workflow Explore → Plan → Code → Commit.
- **Claude Code in Action** — setup, contexto, comandos personalizados, MCP servers, integración GitHub, hooks, SDK.
- **Introduction to subagents**
- **Introduction to agent skills**

---

## 9. Cierre

- Claude Code no sustituye el criterio del equipo: revisa el diff, no asumas.
- Empieza por un buen `CLAUDE.md` y prompts con contexto real.
- Usa Plan mode en lo ambiguo, Act en lo claro.
- El MCP de Dédalo ya está disponible — probadlo esta semana.

**¿Preguntas?**
