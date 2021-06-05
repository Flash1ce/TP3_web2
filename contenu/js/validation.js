'use strict'
let tableauConsomationSemaine
document.addEventListener('DOMContentLoaded', function (event) {
  // Appelle la fonction AfficherDateLundi pour pouvoir affucher la date du lundi.
  // de la semaine courante.
  AfficherDateLundi()
  enTete()
  document.getElementById('genererRapport').className = 'btn btn-primary btn-block disabled'
  tableauConsomationSemaine = donnees.consommation
  const donneeDepart = JSON.stringify(donnees.consommation)
  ChargementDonneeDepart(donneeDepart)
})

// Appelle la fonction GenererRapport quand le bouton genererRapport est clicker.
document.getElementById('genererRapport').addEventListener('click', GenererRapport)

// Appelle la fonction validerDate quand ça valeur est modifier.
document.getElementById('naissance').addEventListener('change', function () {
  let uneDate = new Date()
  uneDate = document.getElementById('naissance').value
  // Appelle la fonction validerDate en lui passant une date en paramètre.

  validerMajeur(uneDate)
})

// Appelle la fonction validerNom quand la zone de texte nom perd le focus.
document.getElementById('nom').addEventListener('blur', function () {
  // const nom, est un nom, il est récupérer dans la zonne de texte nom.
  const nom = document.getElementById('nom').value

  // Appelle de la fonction validerNom en lui passant un nom en paramètre.
  validerNom(nom)
})

/* =================================================================================================
---------------------------------------Validation du formulaire--------------------------------------
================================================================================================== */

function lancerValidation () {
  const nom = document.getElementById('nom').value
  const naissance = new Date(document.getElementById('naissance').value)
  let sexe = document.getElementsByName('sexe')
  for (let i = 0; i < sexe.length; i++) {
    if (sexe[i].checked) {
      sexe = sexe[i].value
    }
  }
  const situation = document.getElementById('situation').value

  let continuer = 'true'
  while (continuer === 'true') {
    continuer = validerNom(nom)
    continuer = validerDate(naissance)
    continuer = validerSexe(sexe)
    continuer = validerSituation(situation)
    continuer = validerMajeur(naissance)
  }
}

// Méthode qui sert a vérifier le nom, elle recoit un nom en paramètre.
function validerNom (nom) {
  let nomValide = Boolean(true)

  for (let i = 0; i <= nom.length; i++) {
    // j indique a quelle caractère substring doit arrêter.
    const j = i + 1

    const caractere = nom.substring(i, j)

    // Vérifie si les caractères ( ou ) ou { et } sont présent dans le nom.
    if (caractere === '(' || caractere === ')' || caractere === '{' || caractere === '}') {
      nomValide = false
    }
  }

  // Vérifie si nom est vide ou undefined et si il comporte moins de 2 caractères.
  if (nom === '' || nom === undefined || nom.length < 2) {
    nomValide = false
  }
  if (nomValide === true) {
    document.getElementById('nomInvalide').className = 'alert alert-danger none'
    document.getElementById('genererRapport').className = 'btn btn-primary btn-block'
    return 'true'
  } else {
    document.getElementById('nomInvalide').className = 'alert alert-danger'
    document.getElementById('genererRapport').className = 'btn btn-primary btn-block disabled'
    return 'false'
  }
}

function validerDate (date) {
  const aujourdhui = Date.getDate
  if (date > aujourdhui) {
    return 'false'
  } else {
    return 'true'
  }
}

function validerSexe (sexe) {
  if (sexe === '' || sexe === undefined) {
    return 'false'
  } else {
    return 'true'
  }
}

function validerSituation (situation) {
  if (situation === '') {
    return 'false'
  } else {
    return 'true'
  }
}

function validerMajeur (naissance) {
  const LaDateNaissance = new Date(naissance)
  const age = AppPhil.Date.obtenirAge(LaDateNaissance)
  console.log(age)
  if (age < 18) {
    $('#ModalMineur').modal()
    return false
  } else {
    return true
  }
}

/* =================================================================================================
--------------------------------Chargement des données de départ------------------------------------
================================================================================================== */

function ChargementDonneeDepart (donneeDepart) {
  const json = JSON.parse(donneeDepart)
  for (let i = 0; i < json.length; i++) {
    const parent = document.getElementsByClassName('journee')
    ChargerEnfants(json[i], parent[i], i)
  }
}
function enTete () {
  for (let i = 0; i < 7; i++) {
    let laJournee = ''
    if (i === 0) {
      laJournee = 'dimanche'
    } else if (i === 1) {
      laJournee = 'lundi'
    } else if (i === 2) {
      laJournee = 'mardi'
    } else if (i === 3) {
      laJournee = 'mercredi'
    } else if (i === 4) {
      laJournee = 'jeudi'
    } else if (i === 5) {
      laJournee = 'vendredi'
    } else if (i === 6) {
      laJournee = 'samedi'
    }
    let jour = document.getElementById(laJournee)
    jour = jour.firstChild

    const div = document.createElement('div')
    div.style.width = '400px'
    const paraTitreVolume = document.createElement('p')
    paraTitreVolume.textContent = 'Volume Alcool'
    paraTitreVolume.style.maxWidth = '100px'
    paraTitreVolume.style.minWidth = '100px'
    paraTitreVolume.style.display = 'inline-block'
    paraTitreVolume.style.fontSize = '1rem'
    const paraTitrePourcentage = document.createElement('p')
    paraTitrePourcentage.textContent = '%'
    paraTitrePourcentage.style.maxWidth = '100px'
    paraTitrePourcentage.style.minWidth = '100px'
    paraTitrePourcentage.style.display = 'inline-block'
    paraTitrePourcentage.style.fontSize = '1rem'
    const paraTitreNbConso = document.createElement('p')
    paraTitreNbConso.textContent = 'Nb consomation'
    paraTitreNbConso.style.maxWidth = '100px'
    paraTitreNbConso.style.minWidth = '100px'
    paraTitreNbConso.style.display = 'inline-block'
    paraTitreNbConso.style.fontSize = '1rem'
    const paraTitreAction = document.createElement('p')
    paraTitreAction.textContent = 'Action'
    paraTitreAction.style.maxWidth = '100px'
    paraTitreAction.style.minWidth = '100px'
    paraTitreAction.style.display = 'inline-block'
    paraTitreAction.style.fontSize = '1rem'
    div.appendChild(paraTitreVolume)
    div.appendChild(paraTitrePourcentage)
    div.appendChild(paraTitreNbConso)
    div.appendChild(paraTitreAction)
    jour.appendChild(div)
  }
}
function ChargerEnfants (listeEnfants, parent, indiceJour) {
  listeEnfants.forEach(consommation => {
    const unElementEnfant = document.createElement('form')

    const inputVolumeConsomme = document.createElement('input')
    const inputPourcentage = document.createElement('input')
    const inputConsomation = document.createElement('input')
    inputPourcentage.id = 'inputPourcentage'
    inputVolumeConsomme.id = 'inputVolumeConsomme'
    inputPourcentage.value = consommation.pourcentage
    inputPourcentage.style.maxWidth = '100px'
    inputVolumeConsomme.value = consommation.volume
    inputVolumeConsomme.style.maxWidth = '100px'
    inputConsomation.value = consommations.obtenirNbConsomation(consommation.volume, consommation.pourcentage)
    inputConsomation.id = 'inputConsomation'
    inputConsomation.style.maxWidth = '100px'
    unElementEnfant.id = consommation.volume + '_' + consommation.pourcentage
    unElementEnfant.setAttribute('indiceJour', indiceJour)
    const boutonEffacer = document.createElement('button')
    boutonEffacer.innerHTML = '<i class="fas fa-eraser"></i>'
    boutonEffacer.addEventListener('click', function () {
      EffacerEnfant(listeEnfants, unElementEnfant.id, indiceJour)
    })

    const boutonModifier = document.createElement('button')
    boutonModifier.innerHTML = '<i class="fas fa-check"></i>'
    boutonModifier.id = 'boutonModifier'
    boutonModifier.addEventListener('click', function () {
      ModifierEnfant(listeEnfants, unElementEnfant.id, indiceJour)
    })

    unElementEnfant.appendChild(inputVolumeConsomme)
    unElementEnfant.appendChild(inputPourcentage)
    unElementEnfant.appendChild(inputConsomation)
    unElementEnfant.appendChild(boutonEffacer)
    unElementEnfant.appendChild(boutonModifier)

    parent.appendChild(unElementEnfant)
  })
}

console.log(document.getElementById('boutonModifier'))

function EffacerEnfant (listeEnfants, elementId, indiceJour) {
  const consommationJournee = listeEnfants
  const uneConsommation = document.getElementById(elementId)
  const indexEnfant = consommationJournee.findIndex(consommation => consommation.volume + '_' + consommation.pourcentage === uneConsommation.id)
  tableauConsomationSemaine[indiceJour].splice(indexEnfant - 1, 1)
  uneConsommation.remove()
  console.log(tableauConsomationSemaine)
}

function ModifierEnfant (listeEnfants, elementId, indiceJour) {
  const consommationJournee = listeEnfants
  const uneConsommation = document.getElementById(elementId)
  const indexEnfant = consommationJournee.findIndex(consommation => consommation.volume + '_' + consommation.pourcentage === uneConsommation.id)
  const volumeConsomme = parseFloat(uneConsommation.childNodes[0].value)
  const teneurAlcool = parseFloat(uneConsommation.childNodes[1].value)
  document.getElementById('inputConsomation').innerText = consommations.obtenirNbConsomation(volumeConsomme, teneurAlcool)
  tableauConsomationSemaine[indiceJour][indexEnfant].volume = volumeConsomme
  tableauConsomationSemaine[indiceJour][indexEnfant].pourcentage = teneurAlcool
  AcctualiserDonnes()
}

function AcctualiserDonnes () {
  const sectHebdo = document.getElementById('section_hebdo')
  const nbChildSectHebdo = sectHebdo.childElementCount
  for (let i = 3; i <= nbChildSectHebdo + 1; i++) {
    const uneJournee = sectHebdo.childNodes[i]
    const h3 = uneJournee.childNodes[0]
    if (h3.childElementCount >= 2) {
      for (let j = 2; j < h3.childElementCount + 1; j++) {
        const unForm = h3.childNodes[j]

        const volume = tableauConsomationSemaine[i - 3][j - 2].volume
        const teneur = tableauConsomationSemaine[i - 3][j - 2].pourcentage
        const nbConso = consommations.obtenirNbConsomation(volume, teneur)

        unForm.childNodes[0].value = volume
        unForm.childNodes[1].value = teneur
        unForm.childNodes[2].value = nbConso
      }
    }
  }
  console.log(tableauConsomationSemaine)
}

/* =================================================================================================
-------------------------------Gestion de la consommation quotidienne-------------------------------
================================================================================================== */

document.querySelectorAll('.btn-group .btn-secondary').forEach(function (elem) {
  elem.addEventListener('click', function () {
    let parent = elem.parentNode.parentNode
    const id = parent.id
    parent = parent.firstChild

    let indiceJour = 0
    if (id === 'dimanche') {
      indiceJour = 0
    } else if (id === 'lundi') {
      indiceJour = 1
    } else if (id === 'mardi') {
      indiceJour = 2
    } else if (id === 'mercredi') {
      indiceJour = 3
    } else if (id === 'jeudi') {
      indiceJour = 4
    } else if (id === 'vendredi') {
      indiceJour = 5
    } else if (id === 'samedi') {
      indiceJour = 6
    }

    const unElementEnfant = document.createElement('form')
    const inputVolumeConsomme = document.createElement('input')
    const inputPourcentage = document.createElement('input')
    const inputConsomation = document.createElement('input')
    inputConsomation.value = consommations.obtenirNbConsomation(0, 0)
    inputConsomation.id = 'inputConsomation'
    inputConsomation.style.maxWidth = '100px'
    inputPourcentage.id = 'inputPourcentage'
    inputPourcentage.value = 0
    inputPourcentage.style.maxWidth = '100px'
    inputVolumeConsomme.id = 'inputVolumeConsomme'
    inputVolumeConsomme.value = 0
    inputVolumeConsomme.style.maxWidth = '100px'

    const teneurAlcool = parseFloat(inputPourcentage.value)
    const volumeConsomme = parseFloat(inputVolumeConsomme.value)

    unElementEnfant.id = volumeConsomme + '_' + teneurAlcool

    unElementEnfant.setAttribute('indiceJour', indiceJour)
    const boutonEffacer = document.createElement('button')
    boutonEffacer.innerHTML = '<i class="fas fa-eraser"></i>'

    const boutonModifier = document.createElement('button')
    boutonModifier.innerHTML = '<i class="fas fa-check"></i>'
    boutonModifier.id = 'boutonModifier'

    unElementEnfant.appendChild(inputVolumeConsomme)
    unElementEnfant.appendChild(inputPourcentage)
    unElementEnfant.appendChild(inputConsomation)
    unElementEnfant.appendChild(boutonEffacer)
    unElementEnfant.appendChild(boutonModifier)
    parent.appendChild(unElementEnfant)
    const uneConsomation = new Consommation(volumeConsomme, teneurAlcool)
    let taille = 0
    taille = tableauConsomationSemaine[0].length
    tableauConsomationSemaine[indiceJour][taille] = uneConsomation
  }
  )
})

// Bouton poubelle
document.querySelectorAll('.btn-group .btn-danger').forEach(function (elem) {
  elem.addEventListener('click', function () {
    const enfant = elem.parentNode.parentNode.firstChild
    console.log(enfant)
    console.log(enfant.lastChild)

    const nbEnfants = enfant.childElementCount
    console.log(nbEnfants)
    if (nbEnfants > 2) {
      $('#ModalPoubelle').modal()
      const btnConfirmer = document.getElementById('ModalPoubelleBoutonConfirmer')
      btnConfirmer.addEventListener('click', function () {
        for (let i = 1; i <= nbEnfants - 1; i++) {
          enfant.lastChild.remove()
        }
      })
    } else if (nbEnfants < 3 && nbEnfants > 1) {
      $('#ModalPoubelle').modal()
      const btnConfirmer = document.getElementById('ModalPoubelleBoutonConfirmer')
      btnConfirmer.addEventListener('click', function () {
        enfant.lastChild.remove()
      })
    }
  }
  )
})

/* =================================================================================================
------------------------------------Génération du rapport------------------------------------------
================================================================================================== */

function GenererRapport () {
  const siDisabled = document.getElementById('genererRapport').className
  if (siDisabled.includes('disabled')) {

  } else {
    // Création de l'objet de la classe profil avec les données fournis par l'utilisateur.
    let unProfilUtilisateur = new AppPhil.Profil()
    // Récupération du nom de l'utilisateur.
    const nom = document.getElementById('nom').value

    // Récupération de la date de naissance de l'utilisateur.
    const naissance = new Date(document.getElementById('naissance').value)

    const age = AppPhil.Date.obtenirAge(naissance)

    let sexe = document.getElementsByName('sexe')
    for (let i = 0; i < sexe.length; i++) {
      if (sexe[i].checked) {
        sexe = sexe[i].value
      }
    }
    const situation = document.getElementById('situation').value

    const entierConsommation = []
    let nbConsoHebdo = 0
    for (let i = 0; i < tableauConsomationSemaine.length; i++) {
      for (let j = 0; j < tableauConsomationSemaine[i].length; j++) {
        const volume = tableauConsomationSemaine[i][j].volume
        const pourcentage = tableauConsomationSemaine[i][j].pourcentage
        let nbConsommation = 0
        nbConsommation = consommations.obtenirNbConsomation(volume, pourcentage)
        entierConsommation[i] = nbConsommation
        nbConsoHebdo += nbConsommation
      }
    }
    console.log(sexe)
    const uneRecommandation = AppPhil.EducAlcool.obtenirRecommandations(sexe)
    const recomMaxHebdo = uneRecommandation.MaxHebdo
    let recommandationMessage
    const parent = document.getElementById('rapport')
    const nbChild = parent.childElementCount
    const enfant = parent.firstChild
    if (nbChild >= 1) {
      enfant.nextSibling.remove()
    }

    const unRapport = document.createElement('p')

    if (recomMaxHebdo === nbConsoHebdo) {
      unRapport.className = 'bg-ok'
      recommandationMessage = 'Recommandations respectées'
    } else {
      unRapport.className = 'bg-mauvais'
      recommandationMessage = 'Recommandations non respectées'
    }

    // Remplissage de l'utilisateur avec les données.
    unProfilUtilisateur = (nom, age, sexe, situation, nbConsoHebdo)

    const message = (nom + ' (' + sexe + ')' + '\n' + 'âge: ' + age + '\n' + situation + '\n' + recommandationMessage)

    unRapport.textContent = message
    document.getElementById('rapport').appendChild(unRapport)

    AppPhil.GenerationContenu.genererGraphique(entierConsommation)
  }
}

/* =================================================================================================
-------------------------------------------Interface-----------------------------------------------
================================================================================================== */

function AfficherDateLundi () {
  const aujourdhui = new Date()
  const dateDimanche = AppPhil.Date.obtenirDimancheDeLaSemaine(aujourdhui)

  // Ajoue d'une journée a la date pour obtenir la date du lundi.
  const date = dateDimanche.getDate()
  dateDimanche.setDate(date + 1)

  document.getElementById('semaine').innerHTML = dateDimanche.toLocaleDateString()
}
