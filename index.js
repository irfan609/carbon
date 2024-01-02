const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const cron = require('node-cron');


const serviceAccount = {
  "type": "service_account",
  "project_id": "lcos-app-2e724",
  "private_key_id": "d3188d31fb5cebd33d6df1e6bb6db52487d7b738",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCyKj3z8Dv/VKZD\nHYrZFaTsTNXM51K7GkLm6V3A0cRqLUjOi59fZMX+hTdVWccKUmBqp9K63o/3OcRP\nWAK/OUXw09ox9QV3R1MrxkaR+yQtRu0V/2ghPMvPhvsYfqMgFOmS6hXo7YLw/g9k\nbyp5SYjtDj/pNjB7SXIVPYMncqrORGPUDsOUiEsjJ58E5HFQva6Pda2IuwM98kUb\npO26wJpBuS/F0GQhvbze5mB/aNfgqbSC8M3+BUmkOkU0wLWXgwJmFoGKuIsPR/84\nSj/hukvpuCUx746BB5H88vbMKenDFWT6MevebNbfMtrD1xovx9s1xGmgg3QhIXpF\n2c/Jqbc3AgMBAAECgf9qGsMp/tvGbd0FB15RqU54ZwOr6HwyD7qL95djHWIBz8QW\ndTOkj5koj0vLx5UuLpq/qMlhTq08QS1uqfkC3xGEYsTnRuQ+NqLvy9KkyGdmSU0g\nOJRkPAqEdqodno7X+EcEdmlt0/FIHCQ2vaNZPdjYCY3jOiPIieN42++hzV+qixHE\nMuJHd8JmzjDbLQoHa1a/3Ds8QVmUP/sZQl6aY35pg1loTxmecAgwWoXo31xfqKWG\nziZT8s3UGe4jaIAJav0Npvk5hQlgdIn0w3/cyJlZruLGs+M/or8YQwbK3qQof1J+\ntFErv83ntGMOlRaGb+886WHjJNXs+C5H8an64/kCgYEA25gXYJiQp/8XmtuAM9rB\n16V1eBuiHsZ5X4zUWflEKvBf6ls024uHk7utqd920xggIKEevTUjrZ/q1X42DQ1A\n9GdFD/cHypZeaX0gNAtEYolJSkFKewfLRfxTeZGq4m1PLqgGBpyVvKoULEUk+2ks\nsu/uavyCeSFRC3XkF4PyfR8CgYEAz7PWKTT18VthlAgEMhZX9/Mhzor7THzzeHjD\nm/AmdLj3GPiKUXHuk+DoRR85OTJKAB794zmL933owbPunQbZGaIEJpoOYHFFc9pl\nFmzPUL85gCNlhWgGwSMpqi1iugQJ0kcyL9d/9iCLOAX7em/CgNcfxdKDoH1miQ9k\na4n5aukCgYANdNR55t92a/tWUf0ZMF6QiGMaaRcWK7NkV4zrtoqm1vQJuG0UxwgX\n1Xhe4IK3jNLrLPRlQ8xb52DMlF9bjWRdlbZ1s/2WPICsli5TAh2+rAsBsd6Oi3u5\nXiz/Vh3SokAn68Pyw8WpOgLic5pAjcFfdbR2eeLE6XW97gt8JWnGoQKBgGj2SbDz\nSaKZ+nrTfkNNlVEBNkFpbMtfja6A4OFKADUWUBD3cPbtq5Jhox9jQwjLiCf9gXI1\n36zHnTteUaRbFJVmkdBsI/3K4D1GzbUCcdYtfMJroN9FDbzGp0SPwQeeCNSSFCOn\nNMxN7+z04PwjxFhV3oGa+9e753g2JhpOVJQZAoGAdzgyZ85DskbO5aOsH962XAEq\nXnYtKDuKMNyEdVWgE+9I11OjVsEErMuP8mjgpiYUcrB+0GHIBAXJKNk7WqK6YaC3\nK5OOyZVgFVve078fpUz5J2OjFalhDsrqyB+ZIvHZayhLXDoIzCPsrCPN77XZsQLE\naI/5ICOS7m5+UV6JQhs=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-bed0b@lcos-app-2e724.iam.gserviceaccount.com",
  "client_id": "114978187058541395802",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-bed0b%40lcos-app-2e724.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 3000;
const _firestore = admin.firestore();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    "image": "https://theedgemalaysia.com/_next/image?url=https%3A%2F%2Fassets.theedgemarkets.com%2Fwater-supply_123rf_46.jpg&w=1080&q=75",
    "desc": "The low carbon operating software (LCOS) system will be utilised in SPAN operations and...",
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

var dailyTasks = {
  '1': 'Default Task 1',
  '2': 'Default Task 2',
  '3': 'Default Bonus Task',
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(questions);
});

app.get('/dailyTasks', (req, res) => {
  res.json(dailyTasks);
});

app.post('/dailyTasks', (req, res) => {
  // Assuming you are sending an updated dailyTasks object in the request body
  const tasks = req.body;
  dailyTasks = tasks;
  res.send('Daily tasks updated successfully');
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

cron.schedule('56 14 * * *', async () => {
  try {
    console.log('Cron job started for daily update.');
    
    // Perform the daily update logic here
    const usersCollection = _firestore.collection('users');
    const usersSnapshot = await usersCollection.get();

    usersSnapshot.forEach(async (userDoc) => {
      const userUid = userDoc.id;
      const userData = userDoc.data();

      // Get the 'point' value and store it in dailyPointValue
      const dailyPointValue = userData.point || 0;

      // Store dailyPointValue based on the day
      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
      const dailyPointUpdate = {};
      dailyPointUpdate[dayOfWeek] = dailyPointValue;

      await usersCollection.doc(userUid).update({
        dailyPoint: dailyPointUpdate,
        point: 0, // Reset 'point' to zero
      });
    });

    console.log('Daily update completed.');
  } catch (error) {
    console.error('Error during daily update:', error);
  }
}, {
  timezone: 'Asia/Kuala_Lumpur'
});


app.listen(port, () => console.log(`Carbon Footprint app listening on port ${port}!`));
