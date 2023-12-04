const movies = `Welcome to Redville: 2023 | 1h 30m | 4.8 rating | Genre: Crime, Drama, Mystery & thriller
'Welcome to Redville' is about a young couple seeks refuge in a secluded desert town after a robbery attempt goes wrong. They soon have a run-in with the local sheriff whose daughter entices them to steal her uncle's million-dollar diamond. Isaac H. Eaton directed Welcome to Redville, and stars Sabrina Haskett, Jake Manley, Highdee Kuan. and Chris Elliott.

Transmorphers: Mech Beasts: 2023 | 1h 32m | 4.6 rating | Genre: Sci-fi
'Transmorphers: Mech Beasts' hapeens years after the events of Transmorphers, a newer, more advanced species of alien robots descends on a rebuilt Earth, threatening once again to destroy the planet.The director of Transmorphers Mech Beasts is  Michael Su, and the film stars Tania Fox, Mica Javier and Tom Arnold.

Jones Family Christmas: 2023 | 1h 37m | 6.0 rating | Genre: Kids & family, Holiday, Comedy
'Top Gun: Maverick' is about Heather Jones as she manages to get her family under one roof for Christmas, but all is not merry and bright in this home because it gets impacted by bushfires.  Stef Smith directed Jones Family Christmas, which stars Heather Mitchell, Ella Scott Lynch, and Max McKenna.

John Wick: Chapter 4: 2023 | 2h 49m | 7.7 rating | Genre: Action
John Wick (Keanu Reeves) uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.Chad Stahelski directed John Wick: Chapter 4, starring Keanu Reeves,Scott Adkins and Donnie Yen.

Scream VI: 2023 | 2h 2m | 6.5 rating | Genre: Holiday, Horror, Mystery & thriller
'Scream VI' is about Four survivors of the Ghostface murders leave Woodsboro behind for a fresh start in New York City. However, they soon find themselves in a fight for their lives when a new killer embarks on a bloody rampage. The director of 'Scream VI' is Matt Bettinelli-Olpin, Tyler Gillett and the film stars Melissa Barrera, Jenna Ortega and Hayden Panettiere.

Saw X: 2023 | 1h 58m | 6.7 rating | Genre: Horror, Mystery & thriller
The thriller movie 'Saw X' happnes between the events of 'Saw' and 'Saw II', a sick and desperate John Kramer travels to Mexico for a risky and experimental medical procedure in hopes of a miracle cure for his cancer, only to discover the entire operation is a scam to defraud the most vulnerable. Armed with a newfound purpose, the infamous serial killer returns to his work, turning the tables on the con artists in his signature visceral way through devious, deranged, and ingenious traps.Kevin Greutert directed Saw X, which stars Tobin Bell, Shawnee Smith and Synnøve Macody Lund.

Ghosted: 2023 | 1h 56m | 5.8 rating | Genre: Action, Romance, Adventure
In the film 'Ghosted', Cole falls head over heels for enigmatic Sadie, but then makes the shocking discovery that she's a secret agent. Before they can decide on a second date, Cole and Sadie are swept away on an international adventure to save the world.Dexter Fletcher directed Ghosted and it stars Ana de Armas, Chris Evans and Ryan Reynolds.

Insidious: The Red Door: 2023 | 1h 47m | 5.5 rating | Genre: Horror, Mystery & thriller
'Insidious: The Red Door': Josh Lambert heads east to drop his son, Dalton, off at school. However, Dalton's college dream soon becomes a living nightmare when the repressed demons of his past suddenly return to haunt them both. Patrick Wilson directed Insidious: The Red Door and it stars Patrick Wilson, Rose Byrne and Lin Shaye.

Bullet Train: 2023 | 2h 07m | 7.2 rating | Genre: Action
'Bullet Train': A skilled assassin boards a high-speed bullet train in Japan to complete his mission only to find that other assassins have boarded with the same goal. Directed by David Leitch,starring Brad Pitt, Sandra Bullock, Joey King, Aaron Taylor-Johnson, and Bad Bunny.

See How They Run: 2023 | 1h 48m | 7.3 rating | Genre: Comedy, Mystery
The film 'See How They Run' happens in 1950s London, a desperate Hollywood film producer sets out to turn a popular play into a movie. When members of the production are murdered, world-weary Inspector Stoppard and rookie Constable Stalker find themselves in the midst of a puzzling whodunit. Directed by Tom George, starring Sam Rockwell, Saoirse Ronan, Adrien Brody, Ruth Wilson, and Mark Strong.

The Banshees of Inisherin: 2023 | 1h 49m | 8.1 rating | Genre: Drama, Mystery
The 'The Banshees of Inisherin' happens on a remote Irish island, a man's close friendship with his lifelong companion is destroyed as secrets are revealed and ancient feuds resurface.Directed by Martin McDonagh, starring Colin Farrell, Brendan Gleeson, Barry Keoghan, Cillian Murphy,and Kerry Condon.

Men: 2023 | 1h 40m | 6.9 rating | Genre: Horror, Psychological
The film 'Men' is about Harper when she goes on a solo vacation to the English countryside seeking peace and tranquility. However, her solitude is broken by the arrival of a mysterious man. Directed by Alex Garland, starring Jessie Buckley, Rory Kinnear, Paapa Essiedu, Gayle Rankin, and Zakaria Bakkali.`;

const { supabase } = require("./utils");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { createEmbedding } = require("./utils");

async function splitDocuments(content) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 30,
  });

  const output = await splitter.createDocuments([content]);

  const data = await Promise.all(
    output.map(async ({ pageContent }) => ({
      content: pageContent,
      embedding: await createEmbedding(pageContent),
    }))
  );

  await supabase.from("movies").insert(data);
}

splitDocuments(movies);
