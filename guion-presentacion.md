# Guión palabra por palabra — Claude Code en la práctica

*Todo lo que aparece en texto normal se dice tal cual, palabra por palabra.*
*Lo que va en bloques `[ ]` son acciones (no se dicen). Los títulos en inglés son solo para ubicarte en la slide.*
*Duración estimada leyendo a ritmo normal: ~40-45 minutos.*

---

## Slide 1 — Portada ("follow along")

Buenas a todos, gracias por venir.

Mientras nos vamos acomodando, os dejo en pantalla un comando. Abrís una PowerShell, pegáis esa línea, y Claude Code se instala solo — no necesitáis nada más. Si alguien va con Mac o Linux, que me avise y le paso el equivalente.

Y esta vez instalarlo no es opcional del todo, porque al final de la charla vais a hacer algo todos a la vez: vais a imputar en Dédalo la hora de este seminario... desde vuestro terminal, sin abrir Dédalo. Así que id instalando, que luego lo usamos.

Soy Javi Ludeña, y en los próximos cuarenta y cinco minutos os voy a contar cómo trabajar con Claude Code en el día a día. Va a haber dos demos en vivo, y al final os vais a llevar algo que podéis usar mañana mismo: imputar horas en Dédalo sin abrir el navegador. Sí, habéis oído bien. Luego llegamos a eso.

## Slide 2 — "claude code is a new kind of ai assistant"

Empecemos por lo básico: ¿qué es Claude Code?

Claude Code no es un autocompletado. No es una ventanita de chat que te sugiere la siguiente línea. Es un agente que corre en tu terminal: lee tu repositorio entero, edita ficheros, ejecuta comandos, corre los tests y hace commits. Tú diriges, él ejecuta.

Cinco ideas rápidas sobre lo que lo hace diferente. Primero: vive en el terminal, no en el IDE — aunque también hay extensión para VS Code si la preferís. Segundo: trabaja con las herramientas que ya usáis. Tercero: encaja en vuestros flujos de trabajo actuales, no os obliga a cambiar nada. Cuarto: es de propósito general — sirve para programar, pero también para investigar un bug, escribir documentación o, como veremos, hablar con Dédalo. Y quinto, y esto es lo que más me gusta: es infinitamente extensible. Al final de la charla veremos cómo lo hemos conectado a los sistemas internos de Altia.

El flujo de trabajo que recomienda Anthropic es: explorar, planificar, codificar, commitear. Quedaos con esa secuencia porque va a salir varias veces.

## Slide 3 — "useful things to try on day one"

Cosas útiles para el primer día.

Para arrancar, escribís `claude` en cualquier repositorio y ya tenéis una sesión.

De esta lista os destaco dos. La primera: `/init`. Le pedís que genere el fichero CLAUDE.md inicial de vuestro proyecto y en un minuto tenéis una base sobre la que trabajar. Ahora veremos qué es ese fichero, porque es probablemente lo más importante de toda la charla.

La segunda: la almohadilla. Si escribís almohadilla y una nota — por ejemplo, "recuerda que en este proyecto los tests se lanzan con make test" — esa nota se guarda en memoria y Claude la tendrá presente en las siguientes sesiones. Cada vez que le corrijáis algo, fijadlo con la almohadilla y no tendréis que repetirlo.

Y una de higiene: `/clear` resetea el contexto. Una tarea, una sesión limpia. No arrastréis la conversación de la mañana a la tarea de la tarde.

## Slide 4 — "keybindings worth memorizing"

Atajos de teclado. Hay siete en la slide, pero os pido que memoricéis solo tres.

Uno: shift más tabulador. Cambia entre los modos de trabajo — ahora veremos qué es el modo plan, que es el importante.

Dos: la arroba. Escribís arroba y el nombre de un fichero o carpeta, y lo metéis directamente al contexto de la conversación. Es la forma más rápida de decirle "mira esto".

Y tres: escape, escape. Pulsáis escape dos veces y volvéis a un punto anterior de la conversación. Es el control-zeta de la sesión: si Claude se ha ido por las ramas, retrocedéis y reformuláis.

El resto están en la slide y os pasaremos el material, no hace falta que los apuntéis.

## Slide 5 — "pick your model"

Hablemos de modelos, porque esto afecta directamente al bolsillo.

Con `/model` podéis cambiar de modelo en mitad de la sesión. Y la estrategia que os recomiendo es muy simple: Sonnet como caballo de batalla para el día a día — es rápido y es barato — y subir a Opus solo cuando el problema lo merece. No hace falta pagar el modelo grande para renombrar una variable.

Dentro del selector de modelo, con las flechas izquierda y derecha, podéis ajustar además el esfuerzo de razonamiento. Hay cuatro niveles: bajo, medio, alto... y uno más que mucha gente no conoce: extra-alto, el xhigh. La regla es sencilla: más esfuerzo significa que el modelo dedica más tiempo a razonar antes de responder — más calidad en problemas difíciles, pero más lento y más caro.

¿Cuándo usar cada uno? Medio para el día a día. Alto cuando el problema tiene miga. Y el xhigh reservadlo para lo realmente difícil: ese bug que lleváis dos días persiguiendo, un diseño de arquitectura complicado, un refactor delicado. Es el modo "piénsatelo todo lo que haga falta" — no lo dejéis puesto por defecto, porque pagaréis en tiempo y en tokens cosas que no lo necesitan.

Veis ahí un tercer modelo, Fable. Ese tiene truco, y os lo cuento un poco más adelante con un comando que casi nadie usa y que a mí me encanta.

## Slide 6 — "CLAUDE.md"

Y llegamos a CLAUDE.md, que como os decía es probablemente la pieza más importante.

CLAUDE.md es el fichero que Claude Code lee automáticamente cada vez que arranca en vuestro proyecto. Es donde le contáis todo lo que no está en el código: las convenciones del equipo, cómo se ejecutan los tests, qué partes no debe tocar, y cómo os gusta que trabaje.

Pensadlo como el onboarding que le daríais a una persona nueva en el equipo. El código dice el qué; el CLAUDE.md dice el cómo.

## Slide 7 — "where CLAUDE.md lives"

¿Y dónde vive este fichero? En tres sitios posibles, y los tres se combinan.

En la raíz del repositorio: ese es el del equipo. Se commitea, se comparte, y así todos los que usen Claude Code en ese proyecto trabajan con las mismas reglas.

En una subcarpeta: reglas específicas de ese módulo. Por ejemplo, el módulo de facturación tiene sus propias convenciones — pues ahí van.

Y en vuestra home, en punto-claude: ese es el personal. Vuestras manías, vuestras preferencias, y os sigue a todos los proyectos.

## Slide 8 — "a good CLAUDE.md teaches claude how to think"

Ahora bien, ¿qué se pone en un CLAUDE.md? Aquí hay un error muy común, que es llenarlo de reglas de formato. Y el mejor contraejemplo que conozco es el CLAUDE.md de Andrej Karpathy — tenéis la referencia abajo.

El suyo no da reglas rígidas; enseña patrones de razonamiento. Son cuatro principios.

Uno: piensa antes de codificar. No asumas; si algo es ambiguo, dilo antes de escribir una línea.

Dos: simplicidad primero. La solución más simple que resuelve el problema. Nada de funcionalidades especulativas por si acaso.

Tres: cambios quirúrgicos. Cada línea que toques tiene que poder trazarse a lo que se pidió.

Y cuatro: ejecución orientada a objetivos. Convertir peticiones vagas en objetivos verificables.

Fijaos en una cosa: ninguno de los cuatro dice "usa tabuladores" o "nombra las variables en camelCase". Le enseñan a pensar, no a formatear. Esa es la diferencia entre un CLAUDE.md bueno y uno mediocre.

## Slide 9 — "keep it short"

Y una regla práctica antes de cerrar este bloque: corto. Ciento cincuenta líneas como máximo.

El CLAUDE.md son preferencias, no documentación. La documentación del proyecto ya debería estar en el README y en el propio código. Y hay una razón técnica para esto: todo lo que pongáis en ese fichero viaja con cada prompt que enviáis. Un CLAUDE.md largo se lee peor y compite por contexto con vuestra tarea real. Menos es más.

## Slide 10 — "a prompt is a work order, not a question"

Pasemos a los prompts. Y el cambio de mentalidad es este: con un agente, un prompt no es una pregunta — es una orden de trabajo. Como el encargo que le haríais a un compañero.

Repaso rápido de la lista: dad contexto, no solo la tarea — qué fichero, por qué, qué no debe romperse. Sed específicos con el resultado que esperáis. En cambios grandes, pedid un plan antes del código. Iterad — no hace falta el prompt perfecto a la primera; se corrige y se refina, como con cualquier compañero. Y dad ejemplos cuando el formato de salida importa.

Pero el punto en el que quiero que os fijéis es el último, porque es la palanca más potente de todas: añadid restricciones. Decirle lo que no debe tocar acota más que describir mejor la tarea. "Mantén la API pública. Sin dependencias nuevas. No toques el CSS." Tres frases que evitan el noventa por ciento de las sorpresas.

## Slide 11 — "weak prompt vs better prompt"

Dos ejemplos reales, prompt flojo contra prompt bueno.

Flojo: "arregla el bug del login". Mejor: "el endpoint de login devuelve un error quinientos cuando el email tiene mayúsculas; revisa el método login del AuthController y añade el caso a los tests existentes". El mismo bug, pero uno da un punto de partida, un lugar donde mirar y un criterio de terminado.

Flojo: "mejora este componente". Mejor: "refactoriza UserTable para paginar en cliente, mantén la API pública del componente y no añadas dependencias nuevas". Fijaos: la mitad del prompt bueno son restricciones.

No hace falta escribir así a la primera. Se empieza simple y se itera. Pero cuanto mejor el encargo, mejor el resultado — exactamente igual que con las personas.

## Slide 12 — "plan / act / auto"

Modos de trabajo. Hay tres, y elegir bien entre ellos es la diferencia entre disfrutar Claude Code y sufrirlo.

Modo plan: solo lectura. Claude explora el código, hace preguntas si las tiene, y os propone un plan. No toca una sola línea hasta que aprobáis. Es vuestro seguro de vida en cambios grandes.

Modo act, el normal: ejecuta, pero pidiendo permiso en cada paso — cada edición, cada comando.

Y modo auto: no pregunta. Toma la decisión razonable y sigue, y solo os interrumpe si está realmente bloqueado. Mucho más rápido para tareas largas. Y tranquilos: hay comandos que siguen bloqueados aunque estéis en auto — un git push no sale sin vuestro permiso.

[ MICRO-DEMO 1 — sobre el repo de Control Tower (~4 min). Si vas justo de tiempo, sáltala: di "os lo enseño en la demo grande" y pasa a la slide 13. ]

De hecho, dejadme que os lo enseñe. Y no en un proyecto de juguete: en el nuestro.

[ Abre el terminal en net-controltower-git. ]

Estoy en el repo de Control Tower. Primero, una de arqueología, que es de las cosas que más uso en el día a día.

[ Escribe: "¿Por qué RecertificationRequired es nullable? Mira el historial de git" — o sustitúyela por una duda real equivalente sobre una decisión reciente del código. ]

Le pregunto por qué esta columna es nullable, y que mire el historial. Fijaos lo que está haciendo: git log, git blame, está leyendo los commits... y me responde con el contexto de la decisión: quién lo cambió, cuándo, y qué problema resolvía. Esto con un compañero nuevo en el proyecto vale su peso en oro — y con uno veterano también, porque nadie se acuerda de por qué se hizo algo hace ocho meses.

Y ahora el modo plan. Pulso shift tabulador y fijaos abajo: modo plan, solo lectura.

[ Pulsa shift+tab hasta ver "plan". Escribe una petición real y deliberadamente ambigua de vuestro backlog — elígela antes de la charla; cuanto más real, más impacto. ]

Le pido un cambio de los que dan miedo, así de vago, tal cual llega a veces en una tarea. Y en vez de ponerse a escribir código, está explorando la solución... y me propone un plan: qué proyectos de la solución va a tocar, en qué orden, y qué deja fuera.

Y aquí decido yo: apruebo, o corrijo el plan antes de que escriba una sola línea. Esto es lo que evita el ochenta por ciento de los sustos.

[ Cancela con escape y vuelve a las slides. ]

## Slide 13 — "when to use which"

¿Cuándo usar cada modo? Regla sencilla.

Cambio grande, ambiguo, o que toca varios ficheros: plan primero, siempre.

Cambio pequeño y claro — un fix puntual, un typo, una tarea acotada: act directo, sin ceremonia.

El flujo completo: explorar, planificar, actuar, revisar. Y subrayo lo último: mirad el diff. Siempre. "Lo hizo la IA" no es una code review. Vuestro criterio no se delega.

## Slide 14 — "mcp: give claude your systems"

Y ahora cambiamos de tercio, porque llegamos a mi parte favorita de la charla.

Hasta aquí, todo lo que hace Claude Code pasa dentro de vuestro repositorio. Pero vuestro trabajo no vive solo en el repo. Vive en Dédalo, en Redmine, en la wiki del proyecto, en mil sitios más. Y cada vez que saltáis del terminal a una de esas herramientas, pagáis un peaje de contexto.

MCP — Model Context Protocol — es el estándar que resuelve esto. Un servidor MCP le da a Claude herramientas y contexto de sistemas externos, sin salir del terminal y sin copiar y pegar datos a mano.

Para que os hagáis una idea rápida: un MCP es como una API, pero pensada para que la consuma un modelo de lenguaje. En vez de endpoints y una colección de Postman, expone herramientas descritas en lenguaje natural — y es el modelo el que decide cuál llamar y con qué parámetros. Vosotros habláis en castellano; él traduce a llamadas.

## Slide 15 — "case: mcp-dedalo"

Y esto no es teoría, porque en Altia ya lo tenemos funcionando: el MCP de Dédalo.

La cadena es la que veis: Claude Code habla con mcp-dedalo, que habla con la API de Redmine, que es Dédalo. Resultado: imputación de horas y gestión de tareas desde vuestro terminal.

Requisitos: Node veintidós o superior, y ya está. La autenticación es automática por el single sign-on de Altia — sin tokens, sin variables de entorno, sin pedir credenciales a nadie.

## Slide 16 — "one command to set it up"

¿Y cuánto cuesta configurarlo? Un comando. Este que veis: claude mcp add, transporte http, y la URL del proxy de Altia.

Y aquí os pido que lo hagáis conmigo, porque dentro de dos minutos lo vais a necesitar. Los que habéis instalado Claude Code al principio: abrid el terminal y ejecutad este comando — os lo paso también por el chat de Teams para que no lo copiéis de pantalla. La primera vez que lo uséis se os abrirá el navegador con el login corporativo de Altia; os autenticáis, y no volvéis a verlo.

[ Pega en el chat de Teams de la sesión: el comando `claude mcp add --transport http mcpdedalo https://mcpproxy.altia.es/metamcp/dedalo/mcp` ]

Mientras terminéis: el repositorio interno con toda la documentación está en garage, en Laboratory, mycopilot-resources. Y si tenéis cualquier problema, en ServiceDesk hay una cola específica: Gestor MyAssistant.

## Slide 17 — "then just talk to it" + DEMO PRINCIPAL (participativa)

Y una vez configurado... simplemente habláis con él. Como veis en los ejemplos. Pero esto hay que verlo en vivo — y hoy no lo voy a hacer yo solo: lo vamos a hacer todos.

[ DEMO PRINCIPAL (~10 min). Terminal con fuente grande. SSO ya hecho por la mañana. Proyecto de Dédalo elegido de antemano (PPPPPPP) donde todos los asistentes tengan permisos. Si algo falla: capturas del plan B y la frase "os enseño cómo quedó cuando lo probé esta mañana", sin dramatizar. ]

**Paso 1 — Calentamiento: leer.**

[ Escribe: "¿Cuáles son mis tareas pendientes en Dédalo?" ]

Empiezo yo. Le pregunto: ¿cuáles son mis tareas pendientes en Dédalo? Así, en castellano, sin más.

Y fijaos en un detalle importante mientras trabaja: yo no le he dicho qué herramienta usar. El MCP expone veinte herramientas, y es él quien ha decidido llamar a list_my_issues. Yo no me sé los nombres de las herramientas — ni falta que me hace.

Ahí están: mis tareas reales, las mismas que veríais si abrierais Dédalo ahora mismo.

**Paso 2 — Crear la tarea del seminario, en vivo.**

Hasta aquí solo hemos leído. Ahora vamos a escribir. Y vamos a crear una tarea especial.

[ Escribe: "Crea una tarea en el proyecto PPPPPPP con el asunto 'Seminario Claude Code — asistencia' y la descripción 'Tarea para que cada asistente impute la hora del seminario desde Claude Code'" ]

Le pido que cree una tarea en el proyecto del seminario: "Seminario Claude Code — asistencia".

Fijaos: antes de escribir en Dédalo me pide confirmación. Esto es el modo act que veíamos antes — escribe, pero con mi permiso. Confirmo... y ahí está: tarea creada, con su número.

[ Apunta el ID que devuelve. Pégalo en el chat de Teams en tamaño bien visible y déjalo también escrito en pantalla. ]

Ese número que veis es importante, porque ahora os toca a vosotros.

**Paso 3 — Ahora todos: imputad vuestra hora.**

Los que tenéis Claude Code instalado y el MCP configurado de hace dos minutos: abrid el terminal y decidle esto — os lo paso por Teams:

[ Pega en Teams: Imputa 1 hora en la tarea NNNNNN con el comentario "asistencia al seminario de Claude Code" ]

"Imputa una hora en la tarea" — el número que os acabo de pasar — "con el comentario: asistencia al seminario de Claude Code".

Eso es. Acabáis de imputar la hora de esta charla sin abrir Dédalo. La primera imputación de vuestra vida hecha por un agente. Que no se os olvide el resto de la semana, eso sí.

[ Mientras la gente lo hace, tú en paralelo: escribe "Imputa 1 hora en la tarea NNNNNN con el comentario 'ponente del seminario'" ]

Yo mientras imputo la mía, que el ponente también ficha.

**Paso 4 — El momento de la verdad.**

[ Espera un minuto. Escribe: "Muéstrame el tiempo imputado en la tarea NNNNNN, agrupado por persona" ]

Y ahora, la prueba del algodón. Le pido que me enseñe el tiempo imputado en la tarea, agrupado por persona... y mirad: ahí estáis apareciendo. Cada línea es uno de vosotros imputando desde su terminal, ahora mismo.

[ Abre Dédalo en el navegador, ve a la tarea. ]

Y para los escépticos, que hacéis bien en serlo: abro Dédalo de verdad... y ahí están las horas. No hay trampa.

[ Cierra el navegador, vuelve a las slides. ]

Esto es lo que quiero que os llevéis hoy: esto ya está disponible, os cuesta un comando configurarlo, funciona con vuestro usuario de siempre — y acabáis de comprobarlo con vuestras propias manos.

## Slide 18 — "three tricks most people don't use"

Recta final. Tres trucos que dan mucho valor y que casi nadie usa.

Uno: `/compact`. Cuando una sesión se hace muy larga, comprime toda la conversación en un resumen y seguís trabajando sin empezar de cero. El contexto se libera; el hilo no se pierde.

Dos: `/cost` y `/context`. El primero os dice cuánto lleva costando la sesión; el segundo, cuán lleno va el contexto y en qué se está yendo. Son el cuentakilómetros: cuando el contexto va muy cargado, mejor sesión nueva que arrastrar ruido.

Y tres, mi favorito: `/advisor`. ¿Os acordáis del modelo Fable de antes? Pues esto: trabajáis vuestra sesión normal en Sonnet, rápido y barato, y en los momentos que de verdad importan — antes de comprometeros con un enfoque, cuando algo no converge, o antes de dar una tarea por terminada — invocáis `/advisor`. Toda la conversación se reenvía a un modelo más potente que la revisa como un segundo par de ojos. No cambiáis de modelo toda la sesión; pedís una segunda opinión puntual. Usado con cabeza, es baratísimo.

## Slide 19 — "agents: delegate without burning context"

Un concepto más: los subagentes.

Claude puede lanzar agentes secundarios para encargarles tareas. Y la clave es esta: cada subagente trabaja en su propia ventana de contexto, y a vuestra sesión solo vuelve el resultado.

¿Por qué importa? Imaginad que necesitáis buscar algo en un repositorio enorme. Si lo hace vuestra sesión principal, se traga docenas de ficheros y os llena el contexto de ruido. Si lo hace un subagente, él se lee los cuarenta ficheros en su propio contexto y a vosotros os vuelve solo la respuesta. Vuestro contexto, limpio.

Casos ideales: explorar codebases grandes, trabajos en paralelo y revisiones de código.

## Slide 19b — "how to launch them: just ask"

¿Y cómo se lanza un subagente? Pues... pidiéndolo. No hay sintaxis especial.

"Usa un subagente para encontrar todos los sitios donde validamos emails." "Lanza tres agentes en paralelo, uno por módulo." "Que un agente revise este diff antes de commitear." Lenguaje natural y ya.

Y si queréis ir un paso más allá: con `/agents` podéis definir especialistas reutilizables — un revisor, un tester — cada uno con su propio prompt y sus propias herramientas. Se guardan en la carpeta punto-claude, se commitean, y todo el equipo los hereda.

## Slide — "claude design → claude code"

Penúltimo tema: el ciclo de diseño.

Existe Claude Design, la herramienta web de diseño de interfaces. Y el flujo que se abre es este: diseñáis la interfaz en Claude Design, os traéis ese diseño a Claude Code, y lo implementáis directamente sobre vuestro proyecto. Diseño a código, sin reescribir la maquetación a mano.

## Slide — "first: extract your project's style guide"

Y aquí va el truco que hace que esto funcione de verdad.

Antes de diseñar nada, abrid Claude Code en vuestro proyecto y pedidle esto: "analiza la interfaz de este proyecto y escribe una guía de estilo: colores, tipografía, espaciados, patrones de componentes, convenciones de nombres — en un único fichero autocontenido".

Ese fichero lo subís a Claude Design, y a partir de ahí todos los diseños que genere salen ya con la imagen de vuestro producto. No genéricos: los vuestros. Se hace una vez por proyecto y queda hecho.

## Slide — "learn more"

Para seguir aprendiendo: Anthropic Academy, en anthropic punto skilljar punto com. Cursos oficiales, gratuitos y con certificado.

Os recomiendo empezar por "Claude Code ciento uno" si estáis empezando, y "Claude Code in Action" es el más completo: configuración, contexto, comandos personalizados, servidores MCP, integración con GitHub. Y hay dos cortitos sobre subagentes y skills.

## Slide — "takeaways"

Cuatro ideas para llevaros a casa.

Una: Claude Code no sustituye vuestro criterio. Revisad el diff, siempre.

Dos: empezad por un buen CLAUDE.md y por prompts con contexto real. Es la inversión con mejor retorno.

Tres: modo plan para lo ambiguo, act para lo claro.

Y cuatro: el MCP de Dédalo ya está disponible. Es un comando. Probadlo esta semana — y me contáis.

## Slide final — "questions?"

Y esto es todo. ¿Preguntas?

[ Si nadie arranca, ten esta preparada: ]

Mientras os animáis, os respondo la que me hacen siempre: "¿y esto cuánto cuesta?". Pues para eso está justamente `/cost` — y os sorprendería lo barata que sale una sesión bien llevada en Sonnet.

---

## Checklist de preparación (no se lee — hazlo antes de la charla)

- [ ] Terminal con fuente grande (mínimo 18pt) y buen contraste.
- [ ] Claude Code instalado y logueado (`claude --version`).
- [ ] MCP Dédalo configurado y **SSO hecho esa misma mañana** (lanza un "lista mis tareas" antes de la charla para calentar el login).
- [ ] **Proyecto de Dédalo elegido (PPPPPPP)** donde TODOS los asistentes tengan permisos para imputar. Verifícalo con 2-3 asistentes de distintos equipos ANTES de la charla — es el punto que puede hundir la demo participativa.
- [ ] Ensaya el `create_dedalo_issue` en ese proyecto (y borra la tarea de prueba) para confirmar que tu usuario puede crear tareas.
- [ ] Chat de Teams de la sesión listo para pegar: (1) comando de instalación, (2) comando `claude mcp add`, (3) el prompt de imputación con el ID de la tarea.
- [ ] Avisa en la convocatoria: "traed portátil". Sin portátiles no hay demo participativa.
- [ ] Micro-demo preparada sobre `net-controltower-git`: (1) la pregunta de arqueología ensayada (comprueba que la respuesta sobre RecertificationRequired sale bien, o elige otra decisión reciente del historial), y (2) una petición ambigua real del backlog elegida para el modo plan. Ensaya ambas — en un repo grande la exploración tarda más.
- [ ] Cuidado con datos sensibles en pantalla al explorar el repo real (connection strings, credenciales en configs).
- [ ] **Plan B**: capturas o grabación corta de la demo de Dédalo por si falla red/SSO/proxy. Y si la parte participativa se atasca (SSO masivo lento, permisos), reconviértela sin dramatizar: tú imputas en vivo y les dejas la tarea abierta — "imputad la vuestra al salir, el ID queda en Teams".
- [ ] Notificaciones cerradas (Teams, correo).
- [ ] Si vas justo de tiempo: la micro-demo de la slide 12 se salta; la demo de Dédalo no se recorta nunca — es el motivo de la charla.
