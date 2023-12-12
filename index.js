const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());

var questions = [
  {
    "id": 1,
    "question": "How often do you travel by air in a year ?",
    "options": ['I fly rarely', 'Occasionally', 'Regularly', 'Never'],
  },
  {
    "id": 2,
    "question": "What describes your diet ?",
    "options": [
      'Vegan',
      'Vegetarian',
      'Pescetarian',
      'Ocassionaly eat meat',
      'Regularly eat meat'
    ],
  },
  {
    "id": 3,
    "question": "How much do you travel by car ?",
    "options": [
      'I don\'t drive',
      '~5000 km',
      '~ 5,000 - 10000 km',
      '~ 10,000 - 15,000 km',
      '>15,000 km'
    ],
  },
  {
    "id": 4,
    "question": "Which kind of fuel do you use ?",
    "options": ['Electric', 'Natural gas', 'Petrol, Disel'],
  },
  {
    "id": 5,
    "question": "Tell us something about your shopping habits ?",
    "options": ['Rarely', 'Average', 'Shopper', 'Luxary Shopper'],
  },
  {
    "id": 6,
    "question": "How big is your home ?",
    "options": [
      'Sharing',
      'One-Bedroom',
      'Two-bedroom',
      'Three-bedroom',
      'Bunglow'
    ],
  },
  {
    "id": 7,
    "question": "How many people live in your home ?",
    "options": ['Just me', '2 people', '3 people', '4-6 people', ' > 7 people'],
  },
  {
    "id": 8,
    "question": "Which pet do you own ?",
    "options": ['None', 'Cat', 'Dog', 'Other'],
  },
  {
    "id": 9,
    "question": "Do you use renewable energy sources at your home ?",
    "options": ['Yes', 'Not Yet', 'Not Sure'],
  },
];

var blogs = [
  {
    "title": "OCBC Bank to incorporate MGTC’S LCOS into transition financing plan",
    "image": "https://www.businesstoday.com.my/wp-content/uploads/2023/02/MGTC-OCBC.jpg",
    "desc": "OCBC Bank is set to become the first financial institution in the country to formulate specific plans....",
    "author": "The Star",
    "link": "https://www.thestar.com.my/business/business-news/2023/02/20/ocbc-bank-to-incorporate-mgtcs-lcos-into-transition-financing-plan"
  },
  {
    "title": "IGEM 2023 to feature over 10 conferences on race to net zero",
    "image": "https://mma.prnewswire.com/media/2239507/Deputy_Prime_Minister_Malaysia___IGEM_2023.jpg",
    "desc": "the International Greentech & Eco Products Exhibition & Conference Malaysia (IGEM) 2023 will host over 10 conferences from...",
    "author": "Bernama",
    "link" : "https://www.mgtc.gov.my/2023/09/igem-2023-to-feature-over-10-conferences-on-race-to-net-zero/"
  },
  {
    "title": "SPAN, water service operators to use LCOS system from next year",
    "image": "https://theedgemalaysia.com/_next/image?url=https%3A%2F%2Fassets.theedgemarkets.com%2Fwater-supply_123rf_46.jpg",
    "desc": "The low carbon operating software (LCOS) system will be utilised in National Water Services Commission (SPAN) operations and...",
    "author": "The Edge Malaysia",
    "link" : "https://theedgemalaysia.com/node/690261"
  },
  {
    "title": "Malaysia’s Commitment on Climate Action And Preparations for (UNFCCC) COP28",
    "image": "https://www.mgtc.gov.my/wp-content/uploads/2023/10/Screenshot-2023-10-18-at-12.33.37%E2%80%AFPM.png",
    "desc": "Malaysia will also have a presence through a dedicated Malaysia Pavilion, which will showcase Malaysia’s thought leadership and...",
    "author": "PR News Wire",
    "link" : "https://www.prnewswire.co.uk/news-releases/malaysias-commitment-on-climate-action-and-preparations-for-the-united-nations-framework-convention-on-climate-change-unfccc-cop28-301950439.html"
  },
  {
    "title": "COP28: World leaders to address climate benchmark in Dubai",
    "image": "https://www.mgtc.gov.my/wp-content/uploads/2023/11/jabersd_1700013190.jpg",
    "desc": "The COP28 hosted by United Arab Emirates this year, will look at ways to set global temperature to 1.5 degrees Celcius...",
    "author": "Bernama",
    "link" : "https://www.nst.com.my/news/nation/2023/11/978447/cop28-world-leaders-address-climate-benchmark-dubai"
  },
  
]

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  //res.json(docs);
  res.json(questions);
});


app.get('/blogs', (req, res) => {
  res.json(blogs);
});

app.post('/calculate', (req, res) => {

  var carbonEmission = 2.33;
  var travel = 0.0;
  var diet = 0.0;
  var carTravel = 0.0;
  var fuel = 0.0;
  var shopping = 0.0;
  var homeSize = 0.0;
  var homePeople = 0.0;
  var pet = 0.0;

  var responses = req.body;

  for (var i = 0; i < Object.keys(responses).length; i++) {
    if (Object.keys(responses).length == 0) {
      break;
    }
    if (i == 0) {
      switch (responses[i]) {
        case 0:
          carbonEmission += 0.66;
          travel += 0.66;
          break;
        case 1:
          carbonEmission += 3.74;
          travel += 3.74;
          break;
        case 2:
          carbonEmission += 12.37;
          travel += 12.37;
          break;
        case 3:
          carbonEmission += 0;
          break;
        default:
          break;
      }
    } else if (i == 1) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 0.23;
          break;
        case 1:
          carbonEmission -= 0.16;
          break;
        case 2:
          carbonEmission -= 0.15;
          break;
        case 3:
          carbonEmission -= 0.06;
          diet += 0.06;
          break;
        case 4:
          carbonEmission += 0.08;
          diet += 0.08;
          break;
        default:
          break;
      }
    } else if (i == 2) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 0.42;
          break;
        case 1:
          carbonEmission += 0.07;
          carTravel += 0.07;
          break;
        case 2:
          carbonEmission += 1.04;
          carTravel += 1.04;
          break;
        case 3:
          carbonEmission += 2.03;
          carTravel += 2.03;
          break;
        case 4:
          carbonEmission += 3.49;
          carTravel += 3.49;
          break;
        default:
          break;
      }
    } else if (i == 3) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 0.18;
          break;
        case 1:
          carbonEmission -= 0.04;
          break;
        case 2:
          carbonEmission += 0.0;
          break;
        default:
          break;
      }
    } else if (i == 4) {
      switch (responses[i]) {
        case 0:
          carbonEmission += 0.18;
          shopping += 0.18;
          break;
        case 1:
          carbonEmission += 0.0;
          shopping += 0.0;
          break;
        case 2:
          carbonEmission += 3.26;
          shopping += 3.26;
          break;
        case 3:
          carbonEmission += 6.85;
          shopping += 6.85;
          break;
        default:
          break;
      }
    } else if (i == 5) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 0.29;
          break;
        case 1:
          carbonEmission -= 0.16;
          break;
        case 2:
          carbonEmission -= 0.04;
          break;
        case 3:
          carbonEmission += 0.09;
          homeSize += 0.09;
          break;
        case 4:
          carbonEmission += 1.69;
          homeSize += 1.69;
          break;
        default:
          break;
      }
    } else if (i == 6) {
      switch (responses[i]) {
        case 0:
          carbonEmission += 0.54;
          homePeople += 0.54;
          break;
        case 1:
          carbonEmission += 0.0;
          break;
        case 2:
          carbonEmission -= 0.19;
          break;
        case 3:
          carbonEmission -= 0.33;
          break;
        case 4:
          carbonEmission -= 0.39;
          break;
        default:
          break;
      }
    } else if (i == 7) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 0.05;
          break;
        case 1:
          carbonEmission += 0.25;
          pet += 0.25;
          break;
        case 2:
          carbonEmission += 0.35;
          pet += 0.35;
          break;
        case 3:
          carbonEmission += 0.11;
          pet += 0.11;
          break;
        default:
          break;
      }
    } else if (i == 8) {
      switch (responses[i]) {
        case 0:
          carbonEmission -= 1.1;
          break;
        case 1:
          carbonEmission += 0.05;
          fuel += 0.05;
          break;
        case 2:
          carbonEmission += 0.0;
          break;
        default:
          break;
      }
    }
  }

  carbonEmission = carbonEmission.toFixed(2);
  carbonEmission = Number(carbonEmission);

  var result = { "result": carbonEmission, "travel": travel, "diet": diet, "carTravel": carTravel, "fuel": fuel, "shopping": shopping, "homeSize": homeSize, "homePeople": homePeople, "pet": pet };
  res.send(result);
});

app.listen(port, () => console.log(`Carbon Footprint app listening on port ${port}!`));
