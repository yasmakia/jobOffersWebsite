translationArray = {
  'eventually': 'Télétravail Partiel',
  'regularly': 'Télétravail Ponctuel',
  'full': 'télétravail total',
  'unknown': '',
  'undefined': ''
}

function getFirstLetter(str) {
  if (str && str.length > 0) {
    return str.charAt(0);
  }
  return '';
}

function sortJsonByPublishDate(jsonData) {
  return jsonData.sort((a, b) => {
    const dateA = new Date(a.publishDate);
    const dateB = new Date(b.publishDate);
    return dateB - dateA;
  });
}

function sortBySalary(jsonData) {
  return jsonData.sort((a, b) => b.salary - a.salary);
}

document.addEventListener('DOMContentLoaded', function () {
  let data;
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      const jobOffers       = document.getElementById('jobOffers');
      const sortChoice      = document.getElementById("sort-choice");
      const filterPoste     = document.getElementById("filter-poste");
      const filterContrat   = document.getElementById("filter-contrat");
      const filterRemote    = document.getElementById("filter-remote");

      updateJobOffers();
   
      function updateJobOffers() {

        const selectedOption = sortChoice.value;
        const selectedPoste = Array.from(filterPoste?.options ?? [])
          .filter(option => option.selected && option.value !== "all")
          .map(option => option.value);
        const selectedContrat = Array.from(filterContrat?.options ?? [])
          .filter(option => option.selected && option.value !== "all")
          .map(option => option.value);
        const selectedRemote = Array.from(filterRemote?.options ?? [])
          .filter(option => option.selected && option.value !== "all")
          .map(option => option.value);

        let filteredData = data.filter(job => {
          if (selectedPoste.length > 0 && !selectedPoste.includes(job.jobTitle)) {
            return false;
          }

          if (selectedContrat.length > 0 && !selectedContrat.includes(job.contractType)) {
            return false;
          }

          if (selectedRemote.length > 0 && !selectedRemote.includes(job.remoteWork)) {
            return false;
          }

          return true;
        });

        if (selectedOption === "Date") {
          filteredData = sortJsonByPublishDate(filteredData);
        } else if (selectedOption === "Salaire") {
          filteredData = sortBySalary(filteredData);
        }

        renderJobOffers(filteredData);
      }

      sortChoice.addEventListener("change", updateJobOffers);
      filterPoste.addEventListener("change", updateJobOffers);
      filterContrat.addEventListener("change", updateJobOffers);
      filterRemote.addEventListener("change", updateJobOffers);
      updateJobOffers();

      function renderJobOffers(jobData) {
        jobOffers.innerHTML = "";

        jobData.forEach(job => {

          const options          = { day: "2-digit", month: "long", year: "numeric" };
          const today            = new Date();
          const differenceInTime = today.getTime() - new Date(job.publishDate).getTime();
          const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

          let companyFirstLetter        = getFirstLetter(job.company);
          let jobofferBigCardHTMLstring =`<div class="job-offer-box">
          <div class="job-offer-reduced">
            <div class="company-informations">
              <div class="company-first-letter">${companyFirstLetter}</div>
              <div class="job-infos">
                <div class="job-title" id="jobTitle">Dev ${job.jobTitle}<span class="remote-work-class-${job.remoteWork}">${translationArray[job.remoteWork]}</span></div>
                <div>Salaire ${job.salary}K</div>
              </div>
            </div>
            <div class="reduce">
              Réduire -
            </div>
          </div>
          <div class="job-info-detailed">
            <div class="company-informations">
              <div class="infos"><img src="./icons/city.svg" alt="city"><span>${job.company}-${job.city}</span></div>
              <div class="infos"><img src="./icons/contract.svg" alt="contract"><span>${job.contractType}</span></div>
              <div class="infos"><img src="./icons/date-start.svg" alt="date"><span>Début : ${new Date(job.startDate).toLocaleDateString("fr-FR", options)}</span></div>
              <div class="infos"><img src="./icons/stude.svg" alt="stude"><span>Bac+${job.studyLevel}</span></div>
            </div>
            <div>
              Publié il y a ${differenceInDays} jours
            </div>
          </div>
          <div class="job-discreption">${job.about}</div>
          <div class="applay"><a href="#">Postuler</a></div>
          </div>`;

          let jobOfferCardHtmlString = `<div class="job-offer-reduced reduced">
          <div class="company-informations">
            <div class="company-first-letter">${companyFirstLetter}</div>
            <div class="job-infos">
              <div class="job-title">Dev ${job.jobTitle}  <span  class="remote-work-class-${job.remoteWork}">${translationArray[job.remoteWork]}</span></div>
              <div class="infos-reduced">${job.company} - ${job.city} ----- ${job.contractType}</div>
            </div>
          </div>
          <div class="salary-date">
            <div class="salary">Salaire ${job.salary}k</div>
            <div class="date">Il y a ${differenceInDays} jours</div>
          </div>
          </div>`;

          const parser = new DOMParser();
          const jobOfferCardDom = parser.parseFromString(jobOfferCardHtmlString, 'text/html').body.firstChild;
          const jobOfferBigCardDom = parser.parseFromString(jobofferBigCardHTMLstring, 'text/html').body.firstChild;
          
          jobOfferCardDom.addEventListener('click', (event) => {
            jobOfferCardDom.style.display = 'none'
            jobOfferBigCardDom.style.display = 'flex'
          })

          jobOffers.appendChild(jobOfferCardDom);

          jobOfferBigCardDom.addEventListener('click', (event) => {
            jobOfferCardDom.style.display = 'flex'
            jobOfferBigCardDom.style.display = 'none'
          })

          jobOfferBigCardDom.style.display = 'none';
          jobOffers.appendChild(jobOfferBigCardDom);
        });
      }
    })
    .catch(error => console.log('Error:', error));
});





