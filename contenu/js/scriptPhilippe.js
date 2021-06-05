'use strict'

const AppPhil = {
  Date: {
    /**
     * Retourne le dimanche prédédant une date
     *
     * @param {Date} d étant un objet de type Date
     * @returns {Date} une date correspondant au premier dimanche prédédant la date fourni en paramètre
     *Ou d si c'est déjà un dimanche
     */
    obtenirDimancheDeLaSemaine: function (d) {
      var day = d.getDay()
      if (day === 0) return d
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day)
    },
    /**
     *
     *
     * @param {Date} date date de naissance
     * @returns l'âge
     */
    obtenirAge: function (date) {
      if (date > new Date()) throw new Error('Naissance dans le futur...')
      var diff = Date.now() - date.getTime()
      var age = new Date(diff)
      return Math.abs(age.getUTCFullYear() - 1970)
    },
    jours: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  },
  GenerationContenu: {
    /**
     *Génère le contenu le texte et les boutons pour les sept jours de la semaine.
     */
    genererJours: function () {
      const parent = document.getElementById('section_hebdo')
      AppPhil.Date.jours.forEach(element => {
        const div = document.createElement('div')
        parent.appendChild(div)
        div.id = element.toLowerCase()
        div.classList.add('bg-primary', 'rounded')
        const jourDeLaSemaine = document.createElement('h3')
        div.appendChild(jourDeLaSemaine)
        jourDeLaSemaine.classList.add('h4', 'journee', 'd-inline-block', 'text-white', 'ml-3')
        jourDeLaSemaine.innerText = element
        this.genererBoutons(div)
      })
    },
    /**
     * Génère les boutons ajouter et effacer
     * @param {elementHtml} parent le contenant auquel ajouter les boutons
     */
    genererBoutons: function (parent) {
      const divBoutons = document.createElement('div')
      parent.appendChild(divBoutons)
      divBoutons.classList.add('btn-group')
      divBoutons.setAttribute('role', 'group')
      divBoutons.setAttribute('aria-label', 'boutons pour modifier les consomations de la semaine')
      this.genererBouton(divBoutons, 'plus', 'ajouter consommation à la journée', 'btn-secondary')
      this.genererBouton(divBoutons, 'trash', 'effacer toutes les consommations de la journée', 'btn-danger')
    },
    /**
     *Créer un bouton pour des modifications à la consommation d'une journée.
     *
     * @param {elementHtml} parent le groupe de bouton
     * @param {string} icone la partie de la classe FontAwesome à ajouter suivant fa-. Par exemple, pour la classe fa-plus
     * il faut passer 'plus'
     * @param {string} aide le texte à mettre dans le aria-label et dans le title
     * @param {string} classes les classes du boutons à ajouter (Paramètres restants).
     */
    genererBouton: function (parent, icone, aide, ...classes) {
      const bouton = document.createElement('button')
      bouton.setAttribute('aria-label', aide)
      bouton.setAttribute('title', aide)
      bouton.setAttribute('type','button')
      bouton.classList.add('btn', ...classes)
      const elemIcone = document.createElement('i')
      elemIcone.classList.add('fas', 'fa-' + icone)
      parent.appendChild(bouton)
      bouton.appendChild(elemIcone)
    },
    /**
     *Génère un graphique à l'aide de chart.js
     *
     * @param {Number[]} donnees un tableau de 7 nombres. Consommation du dimanche au samedi
     */
    genererGraphique: function (donnees) {
      const ctx = document.getElementById('canvas').getContext('2d')
      // eslint-disable-next-line no-undef
      const graphique = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: AppPhil.Date.jours,
          datasets: [{
            label: '# de consommations',
            data: donnees,
            backgroundColor: [
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
      console.log(graphique)
    }
  },
  EducAlcool: {
    obtenirRecommandations: function (sexe) {
      if (sexe === 'Homme') {
        return this.Recommandations.Homme
      }
      // return this.Recommandations.Femme
      return this.Recommandations.FemmeOuAutre
    },
    Recommandations: {
      Homme: {
        MaxHebdo: 15,
        MaxQuotidien: 3
      },
      FemmeOuAutre: {
        MaxHebdo: 12,
        MaxQuotidien: 2
      }
    }
  },
  Profil: class {
    constructor (nom, age, sexe, situation, consommationHebdo) {
      // Ici, nous devrions valider que les données sont bonnes, je vais seulement vérifier l'âge.
      this.nom = nom
      if (age < 18) {
        throw new Error("Vous deviez valider l'âge...")
      }
      this.age = age
      this.sexe = sexe
      this.situation = situation
      this.consommationHebdo = consommationHebdo
    }

    respecteNormes () {
      const maxQuotidien = Math.max(...this.consommationHebdo)
      const recommandations = AppPhil.EducAlcool.obtenirRecommandations(this.sexe)
      const respectMaxQuotidien = maxQuotidien <= recommandations.MaxQuotidien
      const sommeHebdo = this.consommationHebdo.reduce((accumulateur, valeurCourante) => accumulateur + valeurCourante, 0)
      const respectMaxHebdo = sommeHebdo <= recommandations.MaxHebdo
      if (this.situation !== 'aucune_restriction') {
        if (sommeHebdo > 0) {
          return false
        }
        return true
      }
      if (respectMaxQuotidien && respectMaxHebdo) {
        return true
      }
      return false
    }
  }
}

// Cette ligne est exécutée au chargement de la page
AppPhil.GenerationContenu.genererJours()

/// Ne pas modifier ce qui est au-dessus de cette ligne///
class Consommation {
  constructor (volume, pourcentage) {
    this.volume = volume
    this.pourcentage = pourcentage
  }
}
const consommations = {
  obtenirNbConsomation (volumeConsomme, teneurAlcool) {
    let nbConsomation = 0
    nbConsomation = (volumeConsomme * (teneurAlcool))
    nbConsomation = Math.round((nbConsomation / 20) * 100) / 100
    return nbConsomation
  }
}

const donnees = {
  consommation: [
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ],
    [],
    [
      new Consommation(100, 0.20)
    ],
    [],
    [],
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ],
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ]
  ]
}
const donneesTexte = JSON.stringify(donnees)
console.log(donneesTexte)
