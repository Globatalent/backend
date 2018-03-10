const sportsmen = [
    {
        _id: 1,
        completeName: 'Rafa Nadal',
        noOfLikes: 3621,
        tag: '@rafanadal',
        about: 'Rafael "Rafa" Nadal Parera (Catalan: [rəfəˈɛɫ nəˈðaɫ pəˈɾeɾə], Spanish: [rafaˈel naˈðal paˈɾeɾa]; born 3 June 1986) is a Spanish professional tennis player, currently ranked world No. 2 in men\'s singles tennis by the Association of Tennis Professionals (ATP)',
    }
];

const sportsmenInfo = [
    {
        _id: 1,
        facebookLink: 'https://www.facebook.com/Nadal/',
        linkedinLink: 'https://www.linkedin.com/company/rafanadalacademy',
        twitterLink: 'https://www.twitter.com/rafaelnadal/',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: 'https://www.instagram.com/rafaelnadal/',
        country: 'Spain',
        residence: 'Manacor, Balearic Islands, Spain',
        born: '3 June 1986 (age 31)',
        birthPlace: 'Manacor, Balearic Islands, Spain',
        height: '1.85 m (6 ft 1 in)',
        coach: `Toni Nadal (1990–2017)
Francisco Roig (2005–)
Carlos Moyá (2016–)`,
        proDate: '2001',
        plays: 'Left-handed (two-handed backhand), born right-handed',
        descriptionText: `Rafael "Rafa" Nadal Parera (Catalan: [rəfəˈɛɫ nəˈðaɫ pəˈɾeɾə], Spanish: [rafaˈel naˈðal paˈɾeɾa]; born 3 June 1986) is a Spanish professional tennis player, currently ranked world No. 2 in men's singles tennis by the Association of Tennis Professionals (ATP). Known as "The King of Clay", he is widely regarded as the greatest clay-court player in history. Nadal's evolution into an all-court threat has established him as one of the greatest tennis players of all time.

        Nadal has won 16 Grand Slam singles titles, 30 ATP World Tour Masters 1000 titles, 19 ATP World Tour 500 tournaments, and the 2008 Olympic gold medal in singles. In majors, Nadal has won 10 French Open titles, three US Open titles, two Wimbledon titles, and one Australian Open title. He was also a member of the winning Spain Davis Cup team in 2004, 2008, 2009, and 2011. In 2010, he became the seventh male player in history and youngest of five in the Open Era to achieve the Career Grand Slam at age 24. He is the second male player, after Andre Agassi, to complete the singles Career Golden Slam. In 2011, Nadal was named the Laureus World Sportsman of the Year.
`
    }
];

const sportsmenMilestones = [
    {
        _id: 1,
        milestones: [
            { won: true, year: 2005, event: 'French Open'},
            { won: true, year: 2006, event: 'French Open'},
            { won: false, year: 2006, event: 'Winbledon'},
            { won: true, year: 2007, event: 'French Open'},
            { won: false, year: 2007, event: 'Winbledon'},
            { won: true, year: 2008, event: 'French Open'},
            { won: true, year: 2008, event: 'Winbledon'},
        ]
    }
];

const sportsmenExpenses = [
    {
        _id: 1,
        expenses: [
            { prize: 2000, event: 'French Open', year: 2005 },
            { prize: 1500, event: 'French Open', year: 2006 },
            { prize: 1700, event: 'Winbledon', year: 2006 },
            { prize: 1800, event: 'French Open', year: 2007 },
            { prize: 1700, event: 'Winbledon', year: 2007 },
            { prize: 3000, event: 'French Open', year: 2008 },
            { prize: 1700, event: 'Winbledon', year: 2008 },
        ]
    }
];
const sportsmenPicture = [    
    {
        _id: 1,
        picture: "../../images/rafa.jpg"
    }
];



module.exports = {
    sportsmen,
    sportsmenInfo,
    sportsmenMilestones,
    sportsmenExpenses,
    sportsmenPicture
}