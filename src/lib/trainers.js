export const TRAINERS = [
  {
    id: 'rival-blue',
    name: 'Blue (Rivaal)',
    type: 'rival',
    pokemonId: 9, // Blastoise
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    quote: 'Ik ruik een verliezer vanaf hier! Bereid je voor om verpletterd te worden!',
    winQuote: 'Niemand kan mij verslaan! Ik ben de sterkste!',
    loseQuote: 'Wat? Onmogelijk! Dat moet geluk zijn geweest...',
    reward: 200,
    greeting: 'Wat wil je? Kom je opgeven of wil je vechten?',
    dialogue: {
      pokemon: [
        'Mijn Blastoise is de machtigste van allemaal. Zijn Hydro Pump mist nooit!',
        'Ik train alleen de allersterkste Pokémon. Zwakkelingen laat ik achter.',
        'Wist je dat Blastoise zijn kanonnen kan inklappen voor meer snelheid?'
      ],
      tips: [
        'Zorg dat je Pokémon getraind zijn, anders is dit zonde van mijn tijd.',
        'Types voordeel is alles. Leer het uit je hoofd of ga naar huis.',
        'Mijn opa heeft me alles geleerd. Jij hebt nog een lange weg te gaan.'
      ],
      gossip: [
        'Ik heb gehoord dat er een zeldzame Pokémon is gezien in de geheime grot.',
        'Is Professor Eik nog steeds zo traag met die Pokédex? Ik heb hem al bijna vol!',
        'Die Silver denkt dat hij stoer is, maar hij is gewoon een dief.'
      ]
    }
  },
  {
    id: 'friend-misty',
    name: 'Misty (Vriendin)',
    type: 'friend',
    pokemonId: 121, // Starmie
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png',
    quote: 'Water is het beste element! Ben je klaar om nat te worden?',
    winQuote: 'Mijn Water-Pokémon falen nooit!',
    loseQuote: 'Wow, je bent flink verbeterd. Goed gevecht!',
    reward: 150,
    greeting: 'Hee Felix! Kom je zwemmen of vechten?',
    dialogue: {
      pokemon: [
        'Starmie is echt de allerbeste Pokémon ter wereld. Kijk hoe hij glinstert!',
        'Water-Pokémon zijn elegant en krachtig tegelijk.',
        'Heb je mijn Psyduck gezien? Hij heeft altijd hoofdpijn...'
      ],
      tips: [
        'Gebruik status-moves! Een bevroren tegenstander kan niet terugslaan.',
        'Zorg voor een goede balans in je team, niet alleen maar aanvallers.',
        'Vergeet niet je Pokémon regelmatig te laten rusten in het Center.'
      ],
      gossip: [
        'Heb je mijn fiets toevallig ergens gezien? Ash heeft hem nog steeds niet vergoed!',
        'Brock is stiekem een heel erg goede kok, heb je zijn soep wel eens geproefd?',
        'Ik hoorde dat Blue weer eens ruzie had met zijn opa.'
      ]
    }
  },
  {
    id: 'friend-brock',
    name: 'Brock (Vriend)',
    type: 'friend',
    pokemonId: 95, // Onix
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
    quote: 'Mijn Steen-Pokémon zijn net zo hard als mijn wil!',
    winQuote: 'Geduld en een rotsvaste verdediging zijn de sleutel.',
    loseQuote: 'Je hebt mijn perfecte verdediging gebroken...',
    reward: 150,
    greeting: 'Ah, Felix! Een goede trainer laat zijn Pokémon nooit in de steek.',
    dialogue: {
      pokemon: [
        'Mijn Onix weegt meer dan 200 kilo! Hij is massief.',
        'Steen-Pokémon hebben een hoge verdediging, maar pas op voor water!',
        'Geodude zijn overal te vinden in de grotten hier in de buurt.'
      ],
      tips: [
        'Een goede trainer kookt ook voor zijn Pokémon. Dat versterkt de band.',
        'Forceer je Pokémon niet. Luister naar hun behoeften.',
        'Soms is verdedigen belangrijker dan direct aanvallen.'
      ],
      gossip: [
        'Heb je zusters Joy of agent Jenny nog gezien in het dorp?',
        'Ik was eigenlijk soep aan het koken voor mijn broertjes en zusjes toen jij kwam.',
        'Misty kan soms erg koppig zijn als het om haar fiets gaat.'
      ]
    }
  },
  {
    id: 'rival-silver',
    name: 'Silver (Rivaal)',
    type: 'rival',
    pokemonId: 160, // Feraligatr
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png',
    quote: 'Zwakkelingen verdienen geen Pokémon. Dat zal ik je bewijzen!',
    winQuote: 'Precies wat ik dacht. Je bent pathetisch.',
    loseQuote: 'Nee! Hoe kon ik verliezen van iemand zoals jij?',
    reward: 200,
    greeting: 'Ga uit mijn weg, tenzij je hier bent om uitgedaagd te worden.',
    dialogue: {
      pokemon: [
        'Mijn Feraligatr vernietigt alles op zijn pad met zijn kaken.',
        'Ik wil alleen Pokémon die brute kracht hebben.',
        'Zeldzaamheid boeit me niet, zolang ze maar winnen.'
      ],
      tips: [
        'Alleen kracht telt. Vriendschap is voor watjes.',
        'Val altijd aan. Rusten is voor de zwakken.',
        'Ik zal de sterkste trainer ter wereld worden. En niemand houdt me tegen.'
      ],
      gossip: [
        'Team Rocket is terug, en deze keer hebben ze een plan dat werkt.',
        'Ik heb een Pokémon gestolen van het lab... maar vertel het niemand.',
        'De rest van de trainers hier zijn veel te zachtaardig.'
      ]
    }
  },
  {
    id: 'champion-cynthia',
    name: 'Cynthia (Kampioen)',
    type: 'rival',
    pokemonId: 445, // Garchomp
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png',
    quote: 'Laten we zien of de band met je Pokémon écht sterk is.',
    winQuote: 'Een fantastisch gevecht, maar je hebt nog veel te leren.',
    loseQuote: 'Fascinerend... Je bent een uitzonderlijke trainer.',
    reward: 300,
    greeting: 'Hallo daar. Geniet je van je reis met je Pokémon?',
    dialogue: {
      pokemon: [
        'Garchomp en ik hebben samen de wereld rondgereisd.',
        'Elke Pokémon heeft een onbegrensd potentieel als je goed voor ze zorgt.',
        'Draak-Pokémon zijn zeldzaam, maar hun kracht is ongeëvenaard.'
      ],
      tips: [
        'Heb je je ooit verdiept in de mythologie van de Sinnoh regio?',
        'Soms vertelt de historie ons meer over de toekomst dan we denken.',
        'Geloof in je Pokémon, en zij zullen in jou geloven.'
      ],
      gossip: [
        'Er gaan geruchten over een vreemd altaar diep in de bergen.',
        'Ik voel een grote verandering aankomen in de Pokémon-wereld.',
        'Veel trainers focussen alleen op winnen, maar vergeten het plezier.'
      ]
    }
  },
];
