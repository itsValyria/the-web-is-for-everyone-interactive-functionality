// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Fetch de data van de FDND Agency API
const allData_advertisements = await fetchJson('https://fdnd-agency.directus.app/items/dh_services')
let all_advertisements_data = allData_advertisements.data;

// Maak een nieuwe express app aan
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  response.render('index', {services: all_advertisements_data})
})

app.get('/overzicht', function (request, response) {
  response.render('overzicht', {services: all_advertisements_data})
})

app.get('/service-aanmelden', function (request, response) {
  response.render('service-aanmelden', {services: all_advertisements_data})
})

app.get('/service-aanmelden-gelukt', function (request, response) {
  response.render('service-aanmelden-gelukt', {services: all_advertisements_data})
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/service/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson('https://fdnd-agency.directus.app/items/dh_services/' + request.params.id).then((apiData) => {
    // Render service.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd service
    response.render('service', {service: apiData.data})
  })
})

// POST route om data van het formulier te handlen
app.post('/service-aanmelden', function (request, response) {
  const formData = request.body;

  // Maak een nieuw object met formData
  const newAdvertisement = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    contact: formData.contact,
    title: formData.title,
    short_description: formData.short_description,
    long_description: formData.long_description,
    location: formData.location,
    neighbourhood: formData.neighbourhood,
    start_date: formData.start_date,
    end_date: formData.end_date,
    start_time: formData.start_time,
    end_time: formData.end_time,
    image: formData.image
  };

  // Push het nieuwe object naar het all_advertisements_data array
  all_advertisements_data.push(newAdvertisement);

  // Redirect naar de gelukt pagina
  response.redirect('/service-aanmelden-gelukt');
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})