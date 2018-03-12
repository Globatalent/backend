const sportsmen = [
    {
        _id: 'rafanadal',
        completeName: 'Rafa Nadal',
        country: 'Spain',
        sport: 'Tennis Player',
        noOfLikes: 3621,
        tag: '@rafanadal',
        about: 'Rafael "Rafa" Nadal Parera (Catalan: [rəfəˈɛɫ nəˈðaɫ pəˈɾeɾə], Spanish: [rafaˈel naˈðal paˈɾeɾa]; born 3 June 1986) is a Spanish professional tennis player, currently ranked world No. 2 in men\'s singles tennis by the Association of Tennis Professionals (ATP)',
    },
    {
        _id: 'daniredondo',
        completeName: 'Daniel Redondo',
        country: 'Spain',
        sport: 'Karate',
        noOfLikes: 325,
        tag: '@daniRedondo',
        about: 'Passionate about Karate'
    },
    {
        _id: 'joaosousa',
        completeName: 'Joao Sousa',
        country: 'Portugal',
        sport: 'Tennis Player',
        noOfLikes: 925,
        tag: '@joaosousa',
        about: 'The good tennis player',
    },
    {
        _id: 'luissuarez',
        completeName: 'Luis Suarez',
        country: 'Uruguay',
        sport: 'Football',
        noOfLikes: 1925,
        tag: '@luissuarez',
        about: 'The promise of the FCB',
    },
    {
        _id: 'marcbartra',
        completeName: 'Marc Bartra',
        country: 'Spain',
        sport: 'Football',
        noOfLikes: 3093,
        tag: '@marcbartra',
        about: 'The promise of the Real Betis Balonpie',
    },
    {
        _id: 'blancamillan',
        completeName: 'Blanca Millan',
        country: 'Spain',
        sport: 'Basketball',
        noOfLikes: 120,
        tag: '@blancamillan',
        about: 'She wants to play in the WNBA',
    },
];

const sportsmenInfo = [
    {
        _id: 'rafanadal',
        facebookLink: 'https://www.facebook.com/Nadal/',
        linkedinLink: 'https://www.linkedin.com/company/rafanadalacademy',
        twitterLink: 'https://www.twitter.com/rafaelnadal/',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: 'https://www.instagram.com/rafaelnadal/',
        residence: 'Manacor, Balearic Islands, Spain',
        born: '03/06/1986',
        birthPlace: 'Manacor, Balearic Islands, Spain',
        height: '1.85 m (6 ft 1 in)',
	weight: '80 Kg',
	videos: 'https://www.youtube.com/embed/o3dbfkfuR6c',
        coach: `Toni Nadal (1990–2017)
Francisco Roig (2005–)
Carlos Moyá (2016–)`,
        proDate: '2001',
	team: '',
        skills: 'Left-handed (two-handed backhand), born right-handed',
        descriptionText: `Rafael "Rafa" Nadal Parera (Catalan: [rəfəˈɛɫ nəˈðaɫ pəˈɾeɾə], Spanish: [rafaˈel naˈðal paˈɾeɾa]; born 3 June 1986) is a Spanish professional tennis player, currently ranked world No. 2 in men's singles tennis by the Association of Tennis Professionals (ATP). Known as "The King of Clay", he is widely regarded as the greatest clay-court player in history. Nadal's evolution into an all-court threat has established him as one of the greatest tennis players of all time.

        Nadal has won 16 Grand Slam singles titles, 30 ATP World Tour Masters 1000 titles, 19 ATP World Tour 500 tournaments, and the 2008 Olympic gold medal in singles. In majors, Nadal has won 10 French Open titles, three US Open titles, two Wimbledon titles, and one Australian Open title. He was also a member of the winning Spain Davis Cup team in 2004, 2008, 2009, and 2011. In 2010, he became the seventh male player in history and youngest of five in the Open Era to achieve the Career Grand Slam at age 24. He is the second male player, after Andre Agassi, to complete the singles Career Golden Slam. In 2011, Nadal was named the Laureus World Sportsman of the Year.
`
    },
    {
        _id: 'daniredondo',
        facebookLink: 'https://www.facebook.com/profile.php?id=100009551135774',
        linkedinLink: 'https://www.linkedin.com/in/marketingrfek/',
        twitterLink: 'https://twitter.com/superkarate',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: null,
        residence: 'Spain',
        born: '07/06/1990',
        birthPlace: 'Spain',
        height: '1.85 m (6 ft 1 in)',
	weight: '80 Kg',
	videos: 'http://lipovoy.pro/portfolio-item/daniel-redondo-cardoso-profile/',
        coach: ``,
        proDate: '2001',
	team: '',
        skills: 'Agility, Inward Handsword',
        descriptionText: ` Daniel Redondo is making history in the world of Kyokushin, so he has become the best in the best light weight in the history of Spain. Nevertheless, he is still as humble as ever, a special person in and out of the tatami.
`
    },
    {
        _id: 'joaosousa',
        facebookLink: 'https://www.facebook.com/joao30sousa/',
        linkedinLink: null,
        twitterLink: 'https://twitter.com/joaosousa30',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: 'https://www.instagram.com/joaosousaoficial/',
        residence: 'Portugal',
        born: '30/03/1989',
        birthPlace: 'Portugal',
        height: '1.85 m (6 ft 1 in)',
	weight: '73 Kg',
	videos: 'https://www.youtube.com/embed/okOMTUrsLYg',
        coach: `Frederico Marques (1990–2017)`,
        proDate: '2005',
	team: '',
        skills: 'Right-handed, two-handed backhand',
        descriptionText: ` João Sousa (Guimarães, 30 March 1989) is a Portuguese professional tennis player. Its highest ranking at the individual level was the 28th position, reached on 16th May 2016 after reaching the quarterfinals of the Masters 1000 in Madrid 2016.
`
    },
    {
        _id: 'luissuarez',
        facebookLink: 'https://www.facebook.com/LuisSuarez9/',
        linkedinLink: null,
        twitterLink: 'https://twitter.com/LuisSuarez9',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: 'https://www.instagram.com/LuisSuarez9',
        residence: 'Spain',
        born: '30/03/1989',
        birthPlace: 'Uruguay',
        height: '1.82 m (6 ft 0 in)',
	weight: '86 Kg',
	videos: 'https://www.youtube.com/embed/GaQPuqeHniM',
        coach: `Luis Enrique`,
        proDate: '2005',
	team: 'FC Barcelona',
        skills: 'Speed',
        descriptionText: ` He is a Uruguayan footballer who plays as a striker in the football Club Barcelona of the First Division of Spain. It is also international with the Uruguayan national football team, which is the top scorer.
`
    },
    {
        _id: 'marcbatra',
        facebookLink: 'https://www.facebook.com/marcbartra/',
        linkedinLink: null,
        twitterLink: 'https://twitter.com/Marc_Batra91',
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: 'https://www.instagram.com/marcbartra',
        residence: 'Spain',
        born: '30/03/1989',
        birthPlace: 'Spain',
        height: '1.83 m (6 ft 0 in)',
	weight: '79  Kg',
	videos: 'https://www.youtube.com/embed/OJi2TqPTrus',
        coach: `Quique Setien`,
        proDate: '2011',
	team: 'Real Betis Balonpie',
        skills: 'Defense',
        descriptionText: ` He is an absolute international with the Spanish national team since 2013, with which it was convened for Euro 2016. Previously, with the lower categories of the national team, it was proclaimed under-19 European sub-champion in 2010 and champion of Europe Under-21 in 2013.
`
    },
    {
        _id: 'blancamillan',
        facebookLink: null,
        linkedinLink: null,
        twitterLink: null,
        youtubeLink: null,
        vimeoLink: null,
        instagramLink: null,
        residence: 'Spain',
        born: '30/03/2001',
        birthPlace: 'Spain',
        height: '1.83 m (6 ft 0 in)',
	weight: '75  Kg',
	videos: 'https://www.youtube.com/embed/HOnL6Kpz6D0',
        coach: ``,
        proDate: '2011',
	team: 'Peleteiro',
        skills: 'Pivot',
        descriptionText: ` Galician, at its 17 years recently fulfilled, is one of the most outstanding players of the Spanish women's basketball quarry.

`
    },
];

const sportsmenMilestones = [
    {
        _id: 'rafanadal',
        milestones: [
            { accomplishment: '1º', year: 2005, event: 'French Open'},
            { accomplishment: '1º', year: 2006, event: 'French Open'},
            { accomplishment: '2º', year: 2006, event: 'Winbledon'},
            { accomplishment: '1º', year: 2007, event: 'French Open'},
            { accomplishment: '1º', year: 2007, event: 'Winbledon'},
            { accomplishment: '3º', year: 2008, event: 'French Open'},
            { accomplishment: '4º', year: 2008, event: 'Winbledon'},
        ]
    },
    {
        _id: 'joaosousa',
        milestones: [
            { accomplishment: '1º', year: 2009, event: 'Future'},
            { accomplishment: '2º', year: 2012, event: 'Best Tennis Player Portugal'},
        ]
    },
    {
        _id: 'luissuarez',
        milestones: [
            { accomplishment: '1º', year: 2010, event: 'Maximum Scorer'},
            { accomplishment: '2º', year: 2012, event: 'Golden Boot'},
            { accomplishment: '3º', year: 2016, event: 'Golden Boot'},
            { accomplishment: '3º', year: 2016, event: 'XI World FIFA/FIFPro'},
        ]
    }
];

const sportsmenExpenses = [
    {
        _id: 'rafanadal',
        expenses: [
            { expenses: 2000, event: 'French Open', year: 2005, progress: 'accepted' },
            { expenses: 1500, event: 'French Open', year: 2006, progress: 'accepted' },
            { expenses: 1700, event: 'Winbledon', year: 2006, progress: 'accepted' },
            { expenses: 1800, event: 'French Open', year: 2007, progress: 'accepted' },
            { expenses: 1700, event: 'Winbledon', year: 2007, progress: 'accepted' },
            { expenses: 3000, event: 'French Open', year: 2008, progress: 'accepted' },
            { expenses: 1700, event: 'Winbledon', year: 2008, progress: 'accepted' },
        ]
    },
    {
        _id: 'joaosousa',
        expenses: [
            { expenses: 1000, event: 'Future', year: 2009, progress: 'accepted' },
            { expenses: 1500, event: 'Best Tennis Player Portugal', year: 2012, progress: 'accepted' },
           
        ]
    },
    {
        _id: 'luissuarez',
        expenses: [
            { expenses: 1000, event: 'Maximum Scorer', year: 2010, progress: 'accepted' },
            { expenses: 2500, event: 'Golden Boot', year: 2012, progress: 'accepted' },
            { expenses: 2500, event: 'Golden Boot', year: 2016, progress: 'accepted' },
            { expenses: 2500, event: 'XI World FIFA/FIFPro', year: 2016, progress: 'accepted' },
           
        ]
    }

];
const sportsmenPicture = [    
    {
        _id: 'rafanadal',
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
