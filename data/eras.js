// Eras de la línea del tiempo. "clase" = tomado de las notas de clase; "comp" = complemento con fuente.
window.CURSO = {
  titulo: "Historia II - Iglesia medieval, reformada y moderna (Materia Presencial)",
  subtitulo: "Iglesia medieval, reformada y moderna (Materia Presencial)",
  escuela: "Escuela BEREA — El Lugar de Su Presencia",
  docente: "Andrés Fonseca Ibáñez",
  url: "https://sites.google.com/supresencia.com/historia2",
  creemos: "https://supresencia.com/que-creemos",
  nota: "Línea del tiempo de estudio construida a partir de las notas de clase y complementada con fuentes abiertas y verificables. Las reflexiones de cada era se hacen desde la fe que confiesa El Lugar de Su Presencia."
};

window.ERAS = [
  {
    id: "prologo", n: "Prólogo", nombre: "La Iglesia antes de la Edad Media", desde: 33, hasta: 476, color: "#9a6b3f", grupo: "Antecedentes",
    clase: "Constantino, primer emperador cristiano; el obispo como figura de autoridad; Nicea (325) y la división del Imperio (395).",
    comp: "Contexto breve: de Pentecostés a la caída de Roma, para entender de dónde viene la Iglesia medieval.",
    fe: "La Iglesia nació con el derramamiento del Espíritu Santo en Pentecostés (Hch 2). La fe en un solo Dios que existe en tres personas, Padre, Hijo y Espíritu Santo, confesada en Nicea, es la misma que confiesa hoy la Iglesia.",
    repaso: [
      { p: "¿Qué concilio del año 325 afirmó que Cristo es de la misma sustancia que el Padre?", r: "El Concilio de Nicea." },
      { p: "¿En qué año se dividió el Imperio Romano en Oriente y Occidente?", r: "En el 395 d.C." },
      { p: "En Oriente obedecían al Emperador; en Occidente, ¿a quién?", r: "Al Papa (obispo de Roma)." }
    ]
  },
  {
    id: "papado", n: "Etapa 1", nombre: "Desarrollo del Papado", desde: 476, hasta: 1417, color: "#8c2f39", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "476–1073: desarrollo, consolidación y decadencia del poder papal. El papado prima en Occidente, no en Oriente. Subetapas: culminación no es desaparición; ya no tenía el poder de antes.",
    comp: "Fechas usuales de las subetapas: desarrollo (476–1073), culminación (1073–1303) y decadencia (1303–1417).",
    fe: "Cristo es la cabeza de la Iglesia (Ef 5:23; Col 1:18) y el único que restaura nuestra relación con Dios (1 Ti 2:5). Ninguna estructura humana ocupa ese lugar.",
    repaso: [
      { p: "¿Por qué el papado creció en Occidente y no en Oriente?", r: "En Oriente el Emperador era fuerte y había cuatro sedes; en Occidente el Estado era débil y Roma era la única sede, así que la Iglesia ocupó ese vacío." },
      { p: "¿Cuáles eran las cinco sedes principales?", r: "Jerusalén, Antioquía, Alejandría, Constantinopla (Oriente) y Roma (Occidente)." },
      { p: "¿Qué pasó en 1054?", r: "El Gran Cisma: se separan la Iglesia de Occidente (católica romana) y la de Oriente (ortodoxa)." }
    ]
  },
  {
    id: "islam", n: "Etapa 2", nombre: "Surgimiento del Islam y el poder musulmán", desde: 570, hasta: 750, color: "#2f6f62", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "570–750: surgimiento del Islam en la Península Arábiga. Fe + política = divide todo. Cinco consecuencias, entre ellas preparar el contexto de las Cruzadas.",
    comp: "Fechas de la Hégira (622), la toma de Jerusalén (638) y el califato Omeya (661–750).",
    fe: "La sinceridad religiosa no garantiza la verdad (Jn 16:2; Hch 26:9). El Evangelio no se impone con la espada: avanza por el amor y por el poder del Espíritu Santo (Zac 4:6).",
    repaso: [
      { p: "¿Qué significa la palabra Islam?", r: "Sumisión o entrega a Dios." },
      { p: "¿Qué es la Hégira y por qué es importante?", r: "La salida de Mahoma de La Meca a Medina (622); con ella empieza el calendario musulmán." },
      { p: "¿Quién frenó el avance musulmán en Tours (732)?", r: "Carlos Martel, abuelo de Carlomagno." }
    ]
  },
  {
    id: "imperio", n: "Etapa 3", nombre: "El Sacro Imperio Romano", desde: 700, hasta: 962, color: "#4b5a8a", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "Después de 476 Europa queda dividida en muchos reinos. Carlomagno, rey de los francos, conquista Europa Occidental y el papa León III lo corona emperador el 25/12/800.",
    comp: "Tratado de Verdún (843) y coronación de Otón I (962), origen del Sacro Imperio Romano Germánico.",
    fe: "Cuando la fe se mezcla con el poder político, la Iglesia se desvía de su llamado. El reino de Cristo no es de este mundo (Jn 18:36).",
    repaso: [
      { p: "¿Qué significa cada palabra de 'Sacro Imperio Romano'?", r: "Sacro: al servicio de Dios y protector de la Iglesia; Imperio: dominio sobre pueblos y gobiernos; Romano: continuar el antiguo Imperio Romano." },
      { p: "¿Quién coronó a Carlomagno y cuándo?", r: "El papa León III, el 25 de diciembre del año 800." },
      { p: "¿Por qué no duró la unidad de su imperio?", r: "Disputas entre herederos y diferencias entre los pueblos conquistados." }
    ]
  },
  {
    id: "cruzadas", n: "Etapa 4", nombre: "Las Cruzadas", desde: 1095, hasta: 1291, color: "#a3482a", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "Cruzada: supuesta propagación del Evangelio (fachada); querían reconquistar territorio. De la II a la VIII Cruzada, la mayoría fracasos; la IV fue el mayor fracaso moral.",
    comp: "La I Cruzada (1095–1099) y la caída de Acre (1291), que no están en las notas.",
    fe: "Ningún pago ni obra humana compra el perdón: se recibe por el arrepentimiento y la fe en Jesucristo (Hch 3:19; Ef 2:8-9). La promesa de perdón a los cruzados anticipa el problema de las indulgencias.",
    repaso: [
      { p: "¿Por qué la IV Cruzada fue el 'mayor fracaso moral'?", r: "Los cruzados saquearon Constantinopla, una ciudad cristiana, y ahondaron la ruptura entre la Iglesia latina y la griega." },
      { p: "¿Qué logró Federico II en la VI Cruzada?", r: "Recuperó Jerusalén por un tratado, sin batalla, hasta 1244." },
      { p: "¿Qué rey dirigió la VII y la VIII Cruzada?", r: "Luis IX de Francia." }
    ]
  },
  {
    id: "monacato", n: "Etapa 5", nombre: "Monacato, arte y literatura medieval", desde: 251, hasta: 1351, color: "#5f7a3a", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "Precursores: Antonio Abad (251) y Pacomio (292). Ante una Iglesia mundanalizada, el monacato sostuvo la Iglesia, evangelizó, preservó la Biblia y fundó bibliotecas y universidades.",
    comp: "Benito de Nursia, Cluny, el arte románico y gótico, la escolástica y Dante.",
    fe: "Dios preservó su Palabra a lo largo de los siglos. La santidad no es solo para un grupo apartado: todo creyente está llamado a una vida santa y fructífera, llena del Espíritu Santo (1 P 1:15-16; Ef 5:18).",
    repaso: [
      { p: "¿Quiénes son los precursores del monacato según la clase?", r: "Antonio Abad (251) y Pacomio (292)." },
      { p: "Nombre dos aportes del monacato.", r: "Copiar a mano la Biblia, conservar manuscritos y obras, fundar bibliotecas y universidades." },
      { p: "¿Qué pandemia golpeó Europa entre 1347 y 1351?", r: "La Peste Negra." }
    ]
  },
  {
    id: "precursores", n: "Etapa 6", nombre: "La reforma religiosa y la caída de Constantinopla", desde: 1170, hasta: 1453, color: "#7a3f7a", grupo: "Iglesia Medieval (476 – 1453)",
    clase: "Cinco movimientos o personas prepararon el camino para lo que Lutero iba a hacer: cátaros, valdenses, Wiclif, Hus y Savonarola. No eran 'protestantes', pero tenían cosas en común. En 1453 cae Constantinopla y acaba la Edad Media.",
    comp: "Fechas exactas de las muertes de Hus (1415) y Savonarola (1498), y una precisión sobre los cátaros.",
    fe: "Valdenses, Wiclif y Hus pusieron la Biblia por encima de la jerarquía y la llevaron a la lengua del pueblo: la autoridad es la Palabra de Dios (2 Ti 3:16). Los cátaros, en cambio, eran dualistas y rechazaban gran parte del Antiguo Testamento.",
    repaso: [
      { p: "¿Quiénes fueron los cinco que prepararon el camino de la Reforma?", r: "Cátaros/albigenses, valdenses, Juan Wiclif, Juan Hus y Jerónimo Savonarola." },
      { p: "¿Qué hizo Wiclif con la Biblia?", r: "La tradujo (impulsó su traducción) al inglés." },
      { p: "¿Qué evento de 1453 marca el fin de la Edad Media?", r: "La caída de Constantinopla ante los turcos otomanos." }
    ]
  },
  {
    id: "reforma", n: "Iglesia Reformada", nombre: "La Reforma", desde: 1453, hasta: 1648, color: "#b8862b", grupo: "Iglesia Reformada (1453 – 1648)",
    clase: "Iglesia Reformada 1453–1648. Renacimiento, humanismo, imprenta y educación prepararon el camino para Lutero. Lutero, Zuinglio, Calvino, Knox; la Reforma por países; la Contrarreforma y Trento; Arminio y Dort; los puritanos.",
    comp: "Fechas y precisiones: Espira 1529 (origen del nombre 'protestante'), Biblia del Oso 1569, Westminster 1646–1647, Westfalia 1648.",
    fe: "La Reforma recuperó verdades que siguen en el centro de la fe: la Biblia como Palabra de Dios y autoridad para la Iglesia, y la salvación por gracia mediante la fe en Jesucristo (Ro 1:17; Ef 2:8-9).",
    repaso: [
      { p: "¿Qué pregunta movía a Lutero?", r: "¿Cómo puede un pecador ser aceptado por un Dios santo? Respuesta: por gracia, por medio de la fe (Ro 1:17)." },
      { p: "¿En qué no estuvieron de acuerdo Lutero y Zuinglio?", r: "En la Cena del Señor." },
      { p: "¿Qué decidió el Sínodo de Dort (1618–1619)?", r: "Rechazó las ideas arminianas (Remonstrancia) y afirmó la doctrina calvinista de la gracia." },
      { p: "¿En qué se diferencia Trento de la Reforma sobre la salvación?", r: "Trento rechazó la justificación solo por la fe (sola fide)." }
    ]
  },
  {
    id: "moderna", n: "Iglesia moderna", nombre: "Despertares, avivamientos y misiones", desde: 1648, hasta: 2026, color: "#2e6e9e", grupo: "Iglesia moderna (1648 – hoy)",
    clase: "Metodismo (Wesley, Whitefield), Primer y Segundo Gran Despertar, Finney, Movimiento de Santidad, Keswick y los inicios del pentecostalismo (Parham, Agnes Ozman, 1901).",
    comp: "Avivamientos del siglo XX y XXI y hechos mundiales hasta hoy (las notas de clase llegan hasta 1901).",
    fe: "Los despertares, el Movimiento de Santidad y el pentecostalismo pusieron de nuevo el énfasis en la conversión personal, la vida santa, la llenura del Espíritu Santo y los dones del Espíritu activos en los creyentes (Hch 1:8; 1 Co 12). Toda experiencia se examina a la luz de la Palabra y por su fruto (1 Jn 4:1; Mt 7:16).",
    repaso: [
      { p: "¿Por qué los llamaron 'metodistas'?", r: "En burla, por su disciplina y método en el Club Santo de Oxford (1729)." },
      { p: "¿Qué enfatizó el Primer Gran Despertar?", r: "La conversión personal, el nuevo nacimiento y una fe vivida personalmente." },
      { p: "¿Qué pasó el 1 de enero de 1901 en Topeka?", r: "Agnes Ozman habló en lenguas en la escuela bíblica de Charles Parham." }
    ]
  },
  {
    id: "colombia", n: "Enfoque", nombre: "La Iglesia evangélica en Colombia", desde: 1825, hasta: 2026, color: "#c9a227", grupo: "Iglesia moderna (1648 – hoy)",
    clase: "",
    comp: "Raíces, denominaciones, persecución, libertad religiosa, crecimiento de las iglesias grandes y quienes dieron su vida. Basado en fuentes de prensa y académicas.",
    fe: "El crecimiento de la Iglesia en Colombia costó la vida de pastores y misioneros. La Iglesia existe para adorar a Dios, servir a su comunidad y anunciar a Cristo; su fruto se ve en vidas transformadas y en la fidelidad a la Palabra (Hch 17:11; Gá 5:22-23).",
    repaso: [
      { p: "¿Quién fue el primer misionero presbiteriano en Colombia y cuándo llegó?", r: "Henry Barrington Pratt, en 1856." },
      { p: "¿Qué cambió para las iglesias evangélicas la Constitución de 1991?", r: "Reconoció la libertad de cultos y la igualdad de las iglesias ante la ley." },
      { p: "¿Quién fue Chet Bitterman?", r: "Un lingüista de Wycliffe secuestrado y asesinado por el M-19 en 1981." }
    ]
  }
];
