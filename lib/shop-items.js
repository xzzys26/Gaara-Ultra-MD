export const shopItems = [
  // Original Items
  { id: "pesca", name: "Caña de Pescar", price: 3500, description: "Aumenta tus ganancias en la pesca." },
  { id: "suerte", name: "Poción de Suerte", price: 9800, description: "Aumenta la probabilidad de éxito en los robos por 24h." },
  { id: "mascota", name: "Mascota Rara", price: 21000, description: "Demuestra tu estatus con una mascota exótica." },
  { id: "cofre", name: "Cofre del Tesoro", price: 70000, description: "Contiene una cantidad aleatoria de monedas (puede ser más o menos del precio)." },

  // --- 100 New Items (Prices Increased by 40%) ---

  // Tools
  { id: "pico", name: "Pico de Hierro", price: 1400, description: "Permite minar en busca de gemas." },
  { id: "hacha", name: "Hacha de Acero", price: 1680, description: "Permite talar árboles encantados." },
  { id: "mapa", name: "Mapa Desgastado", price: 700, description: "Revela la ubicación de un tesoro menor." },
  { id: "brujula", name: "Brújula Mágica", price: 4200, description: "Siempre apunta a la aventura más cercana." },
  { id: "martillo", name: "Martillo de Forja", price: 2520, description: "Necesario para la herrería." },
  { id: "ganzua", name: "Ganzúa Oxidada", price: 420, description: "Una pequeña probabilidad de abrir cofres cerrados." },
  { id: "pala", name: "Pala de Enterrador", price: 1120, description: "Útil para desenterrar secretos." },
  { id: "lupa", name: "Lupa de Detective", price: 2100, description: "Ayuda a encontrar pistas ocultas." },
  { id: "red", name: "Red de Mariposas", price: 840, description: "Para atrapar insectos raros." },
  { id: "horca", name: "Horca de Granjero", price: 560, description: "Ideal para las tareas de la granja." },

  // Consumables
  { id: "pocion_vida", name: "Poción de Vida Menor", price: 140, description: "Restaura una pequeña cantidad de salud." },
  { id: "pocion_mana", name: "Poción de Maná Menor", price: 168, description: "Restaura una pequeña cantidad de maná." },
  { id: "pan", name: "Hogaza de Pan", price: 28, description: "Un bocado simple y saciante." },
  { id: "manzana", name: "Manzana Roja", price: 42, description: "Crujiente y dulce." },
  { id: "carne", name: "Filete Cocido", price: 112, description: "Recupera energía rápidamente." },
  { id: "trebol", name: "Trébol de 4 Hojas", price: 1400, description: "Aumenta tu suerte por una hora." },
  { id: "elixir", name: "Elixir de Sabiduría", price: 2800, description: "Doble de experiencia por 30 minutos." },
  { id: "antidoto", name: "Antídoto Universal", price: 350, description: "Cura cualquier veneno." },
  { id: "invisibilidad", name: "Poción de Invisibilidad", price: 7000, description: "Te vuelve invisible por 5 minutos." },
  { id: "galleta", name: "Galleta de la Fortuna", price: 70, description: "¿Qué dirá tu suerte hoy?" },

  // Collectibles
  { id: "gema_roja", name: "Gema Roja Pequeña", price: 700, description: "Brilla con una luz cálida." },
  { id: "gema_azul", name: "Gema Azul Pequeña", price: 700, description: "Fría al tacto." },
  { id: "moneda_oro", name: "Moneda de Oro Antigua", price: 1400, description: "De un reino olvidado." },
  { id: "diente_dragon", name: "Diente de Dragón Bebé", price: 11200, description: "Sorprendentemente afilado." },
  { id: "pluma_grifo", name: "Pluma de Grifo", price: 5600, description: "Increíblemente ligera." },
  { id: "reliquia", name: "Reliquia Misteriosa", price: 16800, description: "Nadie sabe para qué sirve, pero es valiosa." },
  { id: "estatua", name: "Estatua de Gato de Jade", price: 28000, description: "Un objeto de gran belleza y valor." },
  { id: "perla_negra", name: "Perla Negra", price: 42000, description: "Codiciada por reyes y piratas." },
  { id: "huevo_oro", name: "Huevo de Oro Macizo", price: 105000, description: "Pesa una tonelada. ¿O no?" },
  { id: "corona_oxidada", name: "Corona Oxidada", price: 3500, description: "Perteneció a un rey menor." },

  // Funny/Meme Items
  { id: "roca", name: "Roca Mascota", price: 14, description: "Es una roca. No hace mucho." },
  { id: "calcetin", name: "Calcetín Solitario", price: 7, description: "Ha perdido a su pareja." },
  { id: "aire", name: "Botella de Aire Puro", price: 140, description: "100% aire de montaña (o eso dice la etiqueta)." },
  { id: "chiste", name: "Chiste Malo Embotellado", price: 35, description: "Ábrelo bajo tu propio riesgo." },
  { id: "patito", name: "Patito de Goma", price: 56, description: "El compañero de baño ideal." },
  { id: "banana", name: "Cáscara de Banana", price: 21, description: "Cuidado donde la tiras." },
  { id: "pelusa", name: "Pelusa de Ombligo Rara", price: 1, description: "Una pieza de colección única." },
  { id: "sombrero_lata", name: "Sombrero de Papel de Aluminio", price: 84, description: "Para protegerte de las ondas psíquicas." },
  { id: "moco", name: "Moco de Goblin Falso", price: 49, description: "Perfecto para bromas." },
  { id: "ruido", name: "Sonido de Flatulencia en un Saco", price: 77, description: "El clásico que nunca falla." },

  // Weapons (Cosmetic)
  { id: "espada_madera", name: "Espada de Madera", price: 210, description: "Para entrenar. No corta mucho." },
  { id: "daga_hierro", name: "Daga de Hierro", price: 560, description: "Rápida y fiable." },
  { id: "arco_simple", name: "Arco Simple", price: 490, description: "No incluye flechas." },
  { id: "hacha_mano", name: "Hacha de Mano", price: 630, description: "Buena para lanzar... o para cortar leña." },
  { id: "baston_mago", name: "Bastón de Mago Aprendiz", price: 700, description: "Tiene una gema falsa que brilla." },
  { id: "lanza_corta", name: "Lanza Corta", price: 532, description: "Mejor mantener la distancia." },
  { id: "mandoble_acero", name: "Mandoble de Acero", price: 2100, description: "Pesada pero poderosa." },
  { id: "ballesta_ligera", name: "Ballesta Ligera", price: 1680, description: "Fácil de recargar." },
  { id: "lucero_alba", name: "Lucero del Alba", price: 1260, description: "Una bola con pinchos unida a un palo." },
  { id: "katana", name: "Katana de Exhibición", price: 7000, description: "Doblada más de mil veces. No usar para cortar." },

  // Armor (Cosmetic)
  { id: "tunica_cuero", name: "Túnica de Cuero", price: 420, description: "Protección básica y con estilo." },
  { id: "yelmo_hierro", name: "Yelmo de Hierro", price: 700, description: "Protege la cabeza de golpes... y de pájaros." },
  { id: "guantes_tela", name: "Guantes de Tela", price: 112, description: "Mantienen tus manos limpias." },
  { id: "botas_viajero", name: "Botas de Viajero", price: 350, description: "Cómodas para largas caminatas." },
  { id: "escudo_madera", name: "Escudo de Madera Redondo", price: 280, description: "Mejor que usar tus manos para parar flechas." },
  { id: "cota_malla", name: "Cota de Malla", price: 2800, description: "Ofrece una buena protección." },
  { id: "capa_viaje", name: "Capa de Viaje con Capucha", price: 560, description: "Para pasar desapercibido." },
  { id: "grebas_acero", name: "Grebas de Acero", price: 1120, description: "Protección para tus espinillas." },
  { id: "amuleto_proteccion", name: "Amuleto de Protección", price: 1400, description: "Dicen que da suerte." },
  { id: "armadura_completa", name: "Armadura de Placas Completa", price: 14000, description: "Impresionante y muy ruidosa." },

  // Magical Items
  { id: "orbe_vision", name: "Orbe de Visión", price: 4900, description: "Permite ver lugares lejanos." },
  { id: "runa_fuego", name: "Runa de Fuego", price: 1680, description: "Contiene la esencia del fuego." },
  { id: "runa_hielo", name: "Runa de Hielo", price: 1680, description: "Fría como el aliento de un dragón de hielo." },
  { id: "libro_hechizos", name: "Libro de Hechizos Básico", price: 3080, description: "Contiene un par de trucos de magia." },
  { id: "polvo_desaparicion", name: "Polvo de Desaparición", price: 1120, description: "¡Puf!" },
  { id: "piedra_levitacion", name: "Piedra de Levitación", price: 8400, description: "Flota ligeramente sobre tu mano." },
  { id: "espejo_verdad", name: "Espejo de la Verdad", price: 10500, description: "Refleja la verdadera forma de las cosas." },
  { id: "varita_roble", name: "Varita de Roble", price: 1260, description: "Una varita simple pero fiable para un mago." },
  { id: "talisman_bestias", name: "Talismán de las Bestias", price: 6300, description: "Permite hablar con los animales." },
  { id: "filacteria", name: "Filacteria Vacía", price: 35000, description: "Un objeto de poder oscuro. ¿Para qué la querrás?" },

  // Food & Ingredients
  { id: "queso", name: "Rueda de Queso", price: 210, description: "Un manjar en cualquier taberna." },
  { id: "hierba_curativa", name: "Hierba Curativa", price: 70, description: "Un remedio popular." },
  { id: "raiz_mordida", name: "Raíz de Mordida de Troll", price: 420, description: "Un ingrediente de pociones potente." },
  { id: "hongo_lunar", name: "Hongo Lunar", price: 308, description: "Brilla en la oscuridad." },
  { id: "sal_negra", name: "Sal Negra", price: 112, description: "Usada en rituales de protección." },
  { id: "botella_vino", name: "Botella de Vino Barato", price: 140, description: "Sabe a vinagre, pero calienta el alma." },
  { id: "saco_harina", name: "Saco de Harina", price: 56, description: "El inicio de todo buen pan." },
  { id: "semillas_misteriosas", name: "Paquete de Semillas Misteriosas", price: 280, description: "Plántalas y a ver qué sale." },
  { id: "ojo_newt", name: "Ojo de Tritón", price: 252, description: "No es un ojo de verdad. Es una baya." },
  { id: "tarro_miel", name: "Tarro de Miel", price: 168, description: "Dulce y pegajosa." },

  // Miscellaneous
  { id: "cuerda", name: "Cuerda de Cáñamo (10m)", price: 140, description: "Nunca sabes cuándo la necesitarás." },
  { id: "linterna", name: "Linterna de Aceite", price: 420, description: "Para explorar lugares oscuros." },
  { id: "saco_dormir", name: "Saco de Dormir de Piel", price: 700, description: "Para descansar en tus aventuras." },
  { id: "kit_pesca", name: "Kit de Pesca Avanzado", price: 5600, description: "Incluye sedal de mithril." },
  { id: "tienda_campana", name: "Tienda de Campaña", price: 2100, description: "Un hogar lejos del hogar." },
  { id: "pedernal", name: "Pedernal y Acero", price: 112, description: "Para encender fogatas." },
  { id: "odre_agua", name: "Odre de Agua", price: 84, description: "Mantente hidratado." },
  { id: "pergamino", name: "Pergamino en Blanco", price: 56, description: "Para escribir tus propias historias." },
  { id: "tinta", name: "Frasco de Tinta y Pluma", price: 98, description: "La pluma es de cuervo." },
  { id: "mochila_cuero", name: "Mochila de Cuero Grande", price: 1400, description: "Para llevar todos tus tesoros." }
];
